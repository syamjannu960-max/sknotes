
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBbxkY3ShS_MyWSxNyDlhrJY12tSkdKWck",
  authDomain: "studio-6210322441-2160a.firebaseapp.com",
  projectId: "studio-6210322441-2160a",
  storageBucket: "studio-6210322441-2160a.appspot.com",
  messagingSenderId: "669204761026",
  appId: "1:669204761026:web:234778eaa62cb11b32ae5b"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
