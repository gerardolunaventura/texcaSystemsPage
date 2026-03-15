import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {

apiKey: "TU_API_KEY",
authDomain: "TU_PROYECTO.firebaseapp.com",
projectId: "TU_PROYECTO",
storageBucket: "TU_PROYECTO.appspot.com",
messagingSenderId: "XXXX",
appId: "XXXX"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 