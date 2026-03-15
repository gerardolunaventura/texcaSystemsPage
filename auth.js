import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

const setStatus = (text, type = "info") => {
if(!message) return;
message.textContent = text;
message.dataset.type = type;
};

if(registerForm){

registerForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
const submitButton = registerForm.querySelector("button");

setStatus("Creando cuenta...", "info");
submitButton.disabled = true;

try{
const userCredential = await createUserWithEmailAndPassword(auth,email,password);

await setDoc(doc(db,"users",userCredential.user.uid),{

name,
phone,
email,
role: "member",
createdAt: new Date()

});

window.location="dashboard.html";
}catch(error){
setStatus("No se pudo crear la cuenta. Revisa los datos e intenta de nuevo.", "error");
submitButton.disabled = false;
}

});

}

if(loginForm){

loginForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
const submitButton = loginForm.querySelector("button");

setStatus("Verificando acceso...", "info");
submitButton.disabled = true;

try{
await signInWithEmailAndPassword(auth,email,password);
window.location="dashboard.html";
}catch(error){
setStatus("Credenciales incorrectas. Intenta de nuevo.", "error");
submitButton.disabled = false;
}

});

}
