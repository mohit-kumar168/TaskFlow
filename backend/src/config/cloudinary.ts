import { v2 as cloudinary } from "cloudinary";
import env from "./env";

cloudinary.config({
  secure: true,
});

console.log("Cloudinary config:", cloudinary.config());

export default cloudinary;
