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

// Multer konfiqurasiyası
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // artıq sabit yol
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
