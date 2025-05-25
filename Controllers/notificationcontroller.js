import admin from "../Utils/firebaseAdmin.js";


export const sendPushNotification = async (req, res) => {
  const { token, title, body } = req.body;

  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent:", response);
    res.status(200).json({ message: "Notification sent", response });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Error sending notification", error });
  }
};
