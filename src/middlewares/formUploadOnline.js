const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinaryUpload = require("../../helper/cloudinary");
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/upload/");
    },
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.originalname}`);
    },
});

const storageOnline = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: {
        folder: "yannn-coffee-shop",
        format: async (req, file) => "png",
        public_id: (req, file) => new Date().getTime(),
    },
});

const formUploadOnline = multer({
    storage: storageOnline, //test bisa atau ga
    fileFilter: (req, res, file, cb) => {
        // console.log(file);
        let formatType = path.extname(file.originalname);
        if (formatType == ".png" || formatType == ".jpg" || formatType == ".jpeg") {
            cb(null, true);
        } else {
            cb("image not valid", false);
        }
    },
    limit: {
        fileSize: 1048576 * 2, //2 mb
    },
});

module.exports = formUploadOnline