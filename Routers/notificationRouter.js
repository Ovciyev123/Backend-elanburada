import express from 'express';
import { sendPushNotification } from '../Controllers/notificationcontroller.js';


const notificationrouter = express.Router();

notificationrouter.post('/send-notification', sendPushNotification);

export default notificationrouter;
