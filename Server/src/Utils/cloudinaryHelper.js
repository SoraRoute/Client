const cloudinary = require("../Config/cloudinary");
const fs = require("fs");

class CloudinaryHelper{

    async uploadImage(filePath){
        const result = await cloudinary.uploader.upload(filePath,{
            folder: "products"
        });

        fs.unlinkSync(filePath);

        return{
            image_url: result.secure_url,
            public_id: result.public_id
        };
    }

    async uploadMultipleImages(files){
        const uploadedImages = [];

        for(const file of files){
            const image = await this.uploadImage(file.path);
            uploadedImages.push(image);
        }

        return uploadedImages;
    }

    async deleteImage(publicId){
        await cloudinary.uploader.destroy(publicId);
    }

    async deleteMultipleImages(publicIds){
        for(const publicId of publicIds){
            await this.deleteImage(publicId);
        }
    }
}

module.exports  = new CloudinaryHelper();