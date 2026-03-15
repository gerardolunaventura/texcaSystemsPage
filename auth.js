import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

if(registerForm){

registerForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const userCredential = await createUserWithEmailAndPassword(auth,email,password);

await setDoc(doc(db,"users",userCredential.user.uid),{

name,
phone,
email

});

window.location="dashboard.html";

});

}

if(loginForm){

loginForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

await signInWithEmailAndPassword(auth,email,password);

window.location="dashboard.html";

});

}