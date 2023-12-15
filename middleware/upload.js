import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        const timestamp = Date.now(); // Get the current timestamp
        const fileName = `${file.originalname}-${timestamp}${ext}`;
        callback(null, fileName);
    },
});

const upload = multer({
    storage: storage,
}).fields([
    { name: 'image1', maxCount: 1 },
]);

export default upload;
