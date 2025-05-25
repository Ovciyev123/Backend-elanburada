import express from "express";
import { AuthModel } from "../Models/authmodel.js";


const tokenrouter = express.Router();

tokenrouter.post("/save-token", async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await AuthModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.fcmToken = token;
    await user.save();

    res.status(200).json({ message: "Token saved successfully" });
  } catch (error) {
    console.error("Token save error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default tokenrouter;
