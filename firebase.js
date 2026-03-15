import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
getAuth,
setPersistence,
browserLocalPersistence,
browserSessionPersistence,
inMemoryPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { initializeFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
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
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false
});
const storage = getStorage(app);

const authReady = setPersistence(auth, browserLocalPersistence)
  .catch(() => setPersistence(auth, browserSessionPersistence))
  .catch(() => setPersistence(auth, inMemoryPersistence));

export { app, auth, db, storage, authReady };
