import express from "express";
import { saveToken, sendNotification } from "../controllers/fcmtoken.controller.js";

const fcmrouter = express.Router();

fcmrouter.post("/save-token", saveToken);
fcmrouter.post("/send-notification", sendNotification);

export default fcmrouter;
