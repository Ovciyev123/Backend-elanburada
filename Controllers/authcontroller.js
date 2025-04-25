import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthModel } from '../Models/authmodel.js';
import nodemailer from "nodemailer"
const secretkey="SECRETKEY"

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: "rvbrgbgrbrbrbgrbrggrbrgb@gmail.com",
      pass: "unjw gxpo ffnw pung",
    },
  });


export const Authcontrollers = {
  searchUsers : async (req, res) => {
    const {email } = req.query;
  
    try {
      const users = await AuthModel.find({ email });
      if (!users) {
        return res.send({ message: 'No users found' });
      }
      res.send(users);
    } catch (err) {
      res.send({ message: 'Server error' });
    }
  },
  

  getAllUsers : async (req, res) => {
    try {
      const users = await AuthModel.find();
      res.send(users);
    } catch (err) {
      res.send({ message: 'Server error' });
    }
  },
    
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
        profileImage, // Artıq burada tək şəkil URL-i olacaq
      });
  
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  
   login : async (req, res) => {
    const { email, password } = req.body;

    const user = await AuthModel.findOne({ email });

   

    if (!user) {
        return res.send({ message: 'Email incorrect' });
    }

    const isTruePassword = await bcrypt.compare(password, user.password);

    if (!isTruePassword) {
        return res.send({ message: "Password incorrect" });
    }

    let confirmcode = Math.floor(Math.random() * 999999);
    console.log("random" + confirmcode)
    user.confirmpassword = confirmcode;
    console.log(user.confirmpassword)
    await user.save();
    
    await transporter.sendMail({
        from: "rvbrgbgrbrbrbgrbrggrbrgb@gmail.com", 
        to: user.email, 
        subject: "Confirmation Code", 
        html: `<b>Bu Sizin Confirm Kodunuzdur: ${confirmcode}</b>`, 
    });

    res.send({ message: "Confirmation code sent to email" });
  },

  confirm: async (req, res) => {
   
    let { confirmpassword } = req.body;

    const user = await AuthModel.findOne({ confirmpassword });

    if (!user) {
        return res.send({ message: "Confirmpassword is incorrect" });  
    }
  else{
    const token = jwt.sign({ userId: user._id, email: user.email, }, secretkey, { expiresIn: '30d' });

    res.send( {token,user} );

  }
    
  }
}
