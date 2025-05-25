import admin from "firebase-admin";
import fs from "fs";

// JSON dosyasını oku ve parse et
const serviceAccount = JSON.parse(
  fs.readFileSync("./config/serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
