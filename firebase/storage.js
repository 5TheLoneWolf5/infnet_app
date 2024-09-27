import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./app";

const uriToBlob = async = async (uri) => {
    const response = await fetch(uri);
    return await response.blob();
};

const uploadImageStorage = async (img, path) => {
    const imgBlob = await uriToBlob(img);

    try {
        const storageRef = ref(storage, `images/${path}`);
        await uploadBytes(storageRef, imgBlob);
        return await getDownloadURL(storageRef);
    } catch (error) {
        console.error(error);
    }

};

const deleteImage = async (path) => {
    try {
        const storageRef = ref(storage, `images/${path}`);
        await deleteObject(storageRef);
    }catch (err) {
        console.error(`[deleteImage] > Error: ${err}`);
        throw err;
    }
}

export { uploadImageStorage, deleteImage };