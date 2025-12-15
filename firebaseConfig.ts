
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import firebaseEnv from "./firebaseEnv";

console.log("DEBUG firebaseEnv:", firebaseEnv);

const app = initializeApp(firebaseEnv);
export const auth = getAuth(app);

export const db = getFirestore(app);

export const getStorageRef = (path: string | undefined) => ref(storage, path);
export const storage = getStorage(app);

export const getDownloadUrl = async (path: string | undefined) => {
  const storageRef = getStorageRef(path);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};

export default app;
