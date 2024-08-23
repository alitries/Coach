// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaPzXKD147Qh1FT3igRgK7adN-2FK_SZE",
  authDomain: "coach-ai-clutch.firebaseapp.com",
  projectId: "coach-ai-clutch",
  storageBucket: "coach-ai-clutch.appspot.com",
  messagingSenderId: "976194478322",
  appId: "1:976194478322:web:c6c15a2e9ee04f51ad306b",
};


const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth  };
