import admin from "firebase-admin";

// Ortam değişkeninden base64 string alınır
const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

if (!serviceAccountBase64) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable not set.");
}

// Base64 string'i çöz ve JSON'a çevir
const serviceAccount = JSON.parse(
  Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
);

// Admin SDK'yı başlat
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
