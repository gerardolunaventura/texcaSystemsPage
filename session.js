import { auth } from "./firebase.js?v=6";
import { getUserContext } from "./user-state.js";
import { onAuthStateChanged } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { signOut } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const logoutButton = document.getElementById("logout");
const sessionMessage = document.getElementById("sessionMessage");
const roleBadge = document.getElementById("roleBadge");
const adminLink = document.getElementById("adminLink");

const setSessionMessage = (text, type = "info") => {
if(!sessionMessage) return;
sessionMessage.textContent = text;
sessionMessage.dataset.type = type;
};

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location="login.html";

}

});

const applyRole = async () => {
const { user, role, profile } = await getUserContext();
if(!user) return;

const isAdmin = role === "admin";
const requiresAdmin = document.body.dataset.requiresAdmin === "true";

if(roleBadge){
roleBadge.textContent = isAdmin ? "Administrador" : "Miembro";
roleBadge.dataset.type = isAdmin ? "success" : "info";
}

document.querySelectorAll("[data-role]").forEach((element) => {
const allowedRole = element.dataset.role;
if(allowedRole === "admin"){
element.hidden = !isAdmin;
}
});

if(adminLink){
adminLink.hidden = !isAdmin;
}

if(requiresAdmin && !isAdmin){
window.location = "dashboard.html";
}

if(profile && profile.name){
setSessionMessage(`Hola, ${profile.name}`, "info");
}
};

applyRole();

if(logoutButton){
logoutButton.addEventListener("click",async()=>{
logoutButton.disabled = true;
setSessionMessage("Cerrando sesion...", "info");
try{
await signOut(auth);
window.location="login.html";
}catch(error){
logoutButton.disabled = false;
setSessionMessage("No se pudo cerrar la sesion.", "error");
}
});
}
