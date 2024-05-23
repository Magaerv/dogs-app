// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "dogs-fe19a.firebaseapp.com",
  projectId: "dogs-fe19a",
  storageBucket: "dogs-fe19a.appspot.com",
  messagingSenderId: "434979640514",
  appId: "1:434979640514:web:95182c89e737d94aaf975b",
  measurementId: "G-71BBVWLP48"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const db = getFirestore(app)