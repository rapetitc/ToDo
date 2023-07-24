// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAe0iKRRdGKTdRFO8viUC2F6sfVsi4CT3g",
  authDomain: "todoapp-75da2.firebaseapp.com",
  projectId: "todoapp-75da2",
  storageBucket: "todoapp-75da2.appspot.com",
  messagingSenderId: "391610397513",
  appId: "1:391610397513:web:bbc9a484184e91c8242098"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);