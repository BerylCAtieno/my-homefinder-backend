import { fileURLToPath } from "node:url";
import path from "path";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../upload/documents"));
  },
  filename(req, file, callback) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${ext}`;
    callback(null, uniqueName);
  },
});

const uploadMiddleware = multer({ storage });

export default uploadMiddleware;
