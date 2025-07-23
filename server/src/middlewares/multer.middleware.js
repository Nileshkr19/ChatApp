import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "avatrs",
        allowed_formats: ["jpg", "png", "jpeg"],
        public_id: (req, res) =>{
            return `user_${Date.now()}`
        },
    },
})

const upload = multer({ storage });

export default upload;