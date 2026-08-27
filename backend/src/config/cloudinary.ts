import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true,
});

console.log("Cloudinary config:", cloudinary.config());

export default cloudinary;
