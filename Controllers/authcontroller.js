import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthModel } from '../Models/authmodel.js';
import UserProfile from "../Models/Profilemodel.js";
import SibApiV3Sdk from "@sendinblue/client";


const secretKey = "SECRETKEY";

const brevoClient = SibApiV3Sdk.ApiClient.instance;
brevoClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const Authcontrollers = {

  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const profileImage = req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : "";

      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }

      if (!password) {
        return res.status(400).json({ message: "Password is required." });
      }

      const existingUser = await AuthModel.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "A user with this email already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new AuthModel({
        username,
        email,
        password: hashedPassword,
        profileImage,
      });

      await newUser.save();

      res.status(201).json({ message: "User registered successfully", user: newUser });

    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },



  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await AuthModel.findOne({ email });

      if (!user) return res.send({ message: "Email incorrect" });

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) return res.send({ message: "Password incorrect" });

      const profile = await UserProfile.findOne({ email });

      if (profile) {
        if (profile.isBlocked && Date.now() > new Date(profile.blockUntil)) {
          profile.isBlocked = false;
          profile.blockUntil = null;
          await profile.save();
        }

        if (profile.isBlocked) {
          return res.status(403).json({ message: "Profil bloklanıb" });
        }
      }

      let otp = Math.floor(100000 + Math.random() * 900000);
      user.confirmpassword = otp;
      await user.save();

 await emailApi.sendTransacEmail({
  sender: { email: "faganio-af206@code.edu.az", name: "ElanBurada" },
  to: [{ email: user.email }],
  subject: "Təsdiq Kodunuz",
  htmlContent: `<h1>${otp}</h1><p>Bu sizin təsdiq kodunuzdur.</p>`,
});


      return res.json({ message: "Confirmation code sent to email" });

    } catch (err) {
      console.log("LOGIN ERROR →", err);
      return res.status(500).json({ message: "Server error" });
    }
  },



  confirm: async (req, res) => {
    try {
      const { confirmpassword } = req.body;

      const user = await AuthModel.findOne({ confirmpassword });

      if (!user) {
        return res.send({ message: "Təsdiq kodu yanlışdır" });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        secretKey,
        { expiresIn: "30d" }
      );

      return res.json({ token, user });

    } catch (err) {
      console.log("CONFIRM ERROR →", err);
      return res.status(500).json({ message: "Server error" });
    }
  },



  searchUsers: async (req, res) => {
    try {
      const { email } = req.body;

      const users = await AuthModel.find({ email });

      if (!users) {
        return res.send({ message: "No users found" });
      }

      res.send(users);

    } catch (err) {
      res.send({ message: "Server error" });
    }
  },



  getAllUsers: async (req, res) => {
    try {
      const users = await AuthModel.find();
      res.send(users);

    } catch (err) {
      res.send({ message: "Server error" });
    }
  },

};
