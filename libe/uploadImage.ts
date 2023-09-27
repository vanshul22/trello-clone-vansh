import { ID, storage } from '@/appwrite/appwrite';

const uploadImage = async (file: File) => {
    if (!file) return;
    const fileUploaded = await storage.createFile(process.env.NEXT_PUBLIC_TODOS_BUCKET_ID!, ID.unique(), file);
    return fileUploaded;
}

export default uploadImage;