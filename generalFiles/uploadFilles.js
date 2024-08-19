import multer from "multer";
import path from "path";
import { __dirname } from "./variables.js";

const uploadDir = path.join(__dirname, "../tmp");
const maxSize = 25 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (__, ___, cb) => {
    cb(null, uploadDir);
  },
  filename: (__, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });

export const uploadFilles = multer({ storage });
