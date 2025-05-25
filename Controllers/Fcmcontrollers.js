import admin from "../firebaseAdmin.js";
import FcmToken from "../Models/Fcmmodel.js";



export const saveToken = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ message: "Email ve token zorunludur" });
    }

    await FcmToken.findOneAndUpdate(
      { email },
      { token },
      { upsert: true, new: true }
    );

    res.json({ message: "Token başarıyla kaydedildi" });
  } catch (error) {
    console.error("Token kayıt hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const { email, title, body } = req.body;

    if (!email || !title || !body) {
      return res.status(400).json({ message: "email, title ve body gerekli" });
    }

    const user = await FcmToken.findOne({ email });

    if (!user || !user.token) {
      return res.status(404).json({ message: "Kullanıcı veya token bulunamadı" });
    }

    const message = {
      token: user.token,
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

    res.json({ message: "Bildirim gönderildi" });
  } catch (error) {
    console.error("Bildirim gönderme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
