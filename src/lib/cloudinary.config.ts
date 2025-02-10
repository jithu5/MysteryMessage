import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


export async function UploadImageToCloudinary(filePath: string) {
    try {
        
        const response = await cloudinary.uploader.upload(filePath,{
            folder: "whatsapp-profile",
            format: "jpg"
        })
        console.log("Image uploaded successfully", response);
        return response;
    } catch (error) {
        console.log("Error in uploading file ", error)
        return null;
    }
    finally{
        try {
            if (fs.existsSync(filePath)){
                fs.unlinkSync(filePath);
                console.log("Deleted temporary image file")
            }
        } catch (error) {
            console.log("error in deleting image from", error)
        }
    }

}


export async function DeleteImageFromCloudinary(publicId: string) {
    try {
        await cloudinary.uploader.destroy(publicId)
        console.log("Image deleted successfully", publicId);
    } catch (error) {
        console.log("Error in deleting image from cloudinary ", error)
    }
 
}