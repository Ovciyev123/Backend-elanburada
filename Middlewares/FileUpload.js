import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// uploads qovluğunu yoxla və yoxdursa yarat
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("🟡 Fayl yazılır (destination):", file.originalname);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "_" + file.originalname;
    console.log("🟢 Fayl adı yaradıldı (filename):", uniqueName);
    cb(null, uniqueName);
  },
});


const upload = multer({ storage });

export default upload;
