const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: ProcessingInstruction.env.CLOUD_NAME,
    api_key: ProcessingInstruction.env.API_KEY,
    api_secret: ProcessingInstruction.env.API_SECRET,
})

module.exports = cloudinary;