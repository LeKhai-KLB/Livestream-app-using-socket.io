import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCgzfgrKOp3BqKTgK1S2c4Qsri-U_WU1_8",
    authDomain: "images-storage-livestrea-e5d17.firebaseapp.com",
    projectId: "images-storage-livestrea-e5d17",
    storageBucket: "images-storage-livestrea-e5d17.appspot.com",
    messagingSenderId: "953669481474",
    appId: "1:953669481474:web:e70a0f4cacc8312d8fe31b"
};

const firebaseApp = initializeApp(firebaseConfig);  
export const storageImage = getStorage(firebaseApp)