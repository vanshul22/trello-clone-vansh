import { storage } from "@/appwrite/appwrite";
import { Image } from "@/typing";

const getURL = async (image: Image) => {
    const url = storage.getFilePreview(image.bucketId, image.fileId);
    return url;
}

export default getURL