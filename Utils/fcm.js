import admin from "../firebaseAdmin.js";
import FcmToken from "../Models/Fcmmodel.js";


export const sendNotificationToEmail = async (email, title, body) => {
  try {
    const tokenDoc = await FcmToken.findOne({ email });
    if (!tokenDoc || !tokenDoc.token) {
      console.warn("Bildirim gönderilemedi: Token bulunamadı.");
      return;
    }

    const message = {
      token: tokenDoc.token,
      notification: {
        title,
        body,
      },
      webpush: {
        notification: {
          icon: "https://elanburada.az/logo192.png",
        },
      },
    };

    await admin.messaging().send(message);
    console.log("📨 Bildirim gönderildi:", title);
  } catch (error) {
    console.error("🔥 Bildirim gönderme hatası:", error);
  }
};
