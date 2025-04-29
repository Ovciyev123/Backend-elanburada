import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// __dirname alternativi (çünki ES6-da birbaşa __dirname yoxdur)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer konfiqurasiyası
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads")); // tam yol
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
