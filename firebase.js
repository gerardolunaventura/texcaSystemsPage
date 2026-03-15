import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Configuracion de Firebase para este proyecto
const firebaseConfig = {
  apiKey: "AIzaSyAEAnwzWAE1QFYOj2UxnjiOSKZNzmIedFk",
  authDomain: "texcapage.firebaseapp.com",
  projectId: "texcapage",
  storageBucket: "texcapage.firebasestorage.app",
  messagingSenderId: "626087641610",
  appId: "1:626087641610:web:3526689bd253ed918fd5f3",
  measurementId: "G-E6KXGSWGP5"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
