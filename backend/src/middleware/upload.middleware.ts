import multer from "multer";


const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
});

export default upload;

/*
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";

const tempDir = path.join(process.cwd(), "public", "temp");
fs.mkdirSync(tempDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
});

export default upload;
*/
