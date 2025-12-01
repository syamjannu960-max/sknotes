
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Course } from "./types";
import { getAuth } from "firebase/auth";

// These variables are exposed to the client and MUST be prefixed with NEXT_PUBLIC_
const firebaseConfig = {
  apiKey: "AIzaSyBbxkY3ShS_MyWSxNyDlhrJY12tSkdKWck",
  authDomain: "studio-6210322441-2160a.firebaseapp.com",
  projectId: "studio-6210322441-2160a",
  storageBucket: "studio-6210322441-2160a.appspot.com",
  messagingSenderId: "669204761026",
  appId: "1:669204761026:web:234778eaa62cb11b32ae5b"
};

// Initialize Firebase for client-side usage
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Function to get all courses
export async function getCourses(): Promise<Course[]> {
  const coursesCol = collection(db, 'courses');
  const courseSnapshot = await getDocs(coursesCol);
  const courseList = courseSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Course[];
  return courseList;
}

export { app, db, storage, auth };
