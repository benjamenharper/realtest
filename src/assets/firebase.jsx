// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
//https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-web-app-27103.firebaseapp.com",
  projectId: "real-estate-web-app-27103",
  storageBucket: "real-estate-web-app-27103.appspot.com",
  messagingSenderId: "846130938406",
  appId: "1:846130938406:web:e59adf6b33c908a936dce7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
