// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEAnwzWAE1QFYOj2UxnjiOSKZNzmIedFk",
  authDomain: "texcapage.firebaseapp.com",
  projectId: "texcapage",
  storageBucket: "texcapage.firebasestorage.app",
  messagingSenderId: "626087641610",
  appId: "1:626087641610:web:3526689bd253ed918fd5f3",
  measurementId: "G-E6KXGSWGP5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);