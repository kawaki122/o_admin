// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUv9NxoSSlmbrs1O7hawBiEx8wiAMG7l4",
  authDomain: "omedia-30ec6.firebaseapp.com",
  projectId: "omedia-30ec6",
  storageBucket: "omedia-30ec6.appspot.com",
  messagingSenderId: "116960679877",
  appId: "1:116960679877:web:f05b0f7c277629c47c1dac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);