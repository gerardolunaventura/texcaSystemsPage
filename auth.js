import { auth, db } from "./firebase.js?v=6";

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

const formatAuthError = (error) => {
const code = error && error.code ? error.code : "unknown";
if(code === "auth/email-already-in-use"){
return "Este correo ya esta registrado.";
}
if(code === "auth/invalid-email"){
return "El correo no es valido.";
}
if(code === "auth/weak-password"){
return "La contrasena debe tener al menos 6 caracteres.";
}
if(code === "auth/network-request-failed"){
return "No hay conexion a internet o esta bloqueada.";
}
return `No se pudo crear la cuenta (${code}).`;
};

const formatProfileError = (error) => {
const code = error && error.code ? error.code : "unknown";
if(code === "permission-denied"){
return "Cuenta creada, pero no pudimos guardar el perfil (reglas de Firestore).";
}
return `Cuenta creada, pero fallo el guardado del perfil (${code}).`;
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

try{
await setDoc(doc(db,"users",userCredential.user.uid),{

name,
phone,
email,
role: "member",
createdAt: new Date()

});
}catch(error){
setStatus(formatProfileError(error), "error");
submitButton.disabled = false;
return;
}

window.location="dashboard.html";
}catch(error){
setStatus(formatAuthError(error), "error");
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
const code = error && error.code ? error.code : "unknown";
setStatus(`No se pudo iniciar sesion (${code}).`, "error");
submitButton.disabled = false;
}

});

}
