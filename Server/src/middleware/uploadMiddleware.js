const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join("uploads","temp");

if(!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir,{recursive:true});
}

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,uploadsDir);
    },

    filename:(req,file,cb) => {
        const uniqueName = Date.now()+ "-" + Math.round(Math.random() * 1e9);
        cb(null,uniqueName + path.extname(file.originalname));
    }
});

const fileFilter = (req,file,cb) => {
    const allowedTypes = /jpeg|jpg|png|webg/;

    const isValid = allowedTypes.test(file.mimetype) && allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if(isValid){
        return cb(null,true);
    }

    cb(new Error("Only JPG,JPEG,PNG and WEBP images are allowed."));

};

const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = upload;