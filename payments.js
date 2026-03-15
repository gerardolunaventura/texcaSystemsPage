import { db } from "./firebase.js";
import { getUserContext } from "./user-state.js";

import {
collection,
addDoc,
getDocs,
query,
where,
orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form=document.getElementById("paymentForm");
const list=document.getElementById("paymentsList");
const status=document.getElementById("paymentStatus");
let currentUser = null;
let currentRole = "member";
let currentProfile = null;

const setStatus = (text, type = "info") => {
if(!status) return;
status.textContent = text;
status.dataset.type = type;
};

const init = async () => {
const context = await getUserContext();
currentUser = context.user;
currentRole = context.role;
currentProfile = context.profile;
loadPayments();
};

init();

if(form){
form.addEventListener("submit",async(e)=>{

e.preventDefault();

const concepto=document.getElementById("concepto").value;

const montoValue=document.getElementById("monto").value;
const monto=Number.parseFloat(montoValue);

if(!concepto || Number.isNaN(monto)){
setStatus("Completa concepto y monto con un numero valido.", "error");
return;
}

if(!currentUser){
setStatus("Sesion no valida. Inicia sesion nuevamente.", "error");
return;
}

const submitButton = form.querySelector("button");
submitButton.disabled = true;
setStatus("Guardando pago...", "info");

try{
await addDoc(collection(db,"payments"),{

concepto,
monto,
uid: currentUser.uid,
userEmail: currentUser.email || "",
createdBy: currentProfile && currentProfile.name ? currentProfile.name : "Usuario",
fecha:new Date()

});

setStatus("Pago guardado correctamente.", "success");
form.reset();
loadPayments();
}catch(error){
setStatus("No se pudo guardar el pago.", "error");
}finally{
submitButton.disabled = false;
}

});
}

async function loadPayments(){

if(!list) return;
list.innerHTML="";

try{
if(!currentUser){
setStatus("Sesion no valida. Inicia sesion nuevamente.", "error");
return;
}

let paymentsQuery;
if(currentRole !== "admin"){
paymentsQuery = query(collection(db,"payments"), where("uid","==", currentUser.uid));
}else{
paymentsQuery = query(collection(db,"payments"), orderBy("fecha","desc"));
}

const querySnapshot=await getDocs(paymentsQuery);

if(querySnapshot.empty){
const li=document.createElement("li");
li.innerText="Aun no hay pagos registrados.";
list.appendChild(li);
return;
}

querySnapshot.forEach(doc=>{

const data=doc.data();

const li=document.createElement("li");

const montoTexto = typeof data.monto === "number" ? data.monto.toFixed(2) : data.monto;
li.innerText=`${data.concepto} $${montoTexto}`;

list.appendChild(li);

});
}catch(error){
setStatus("No se pudieron cargar los pagos.", "error");
}

}

loadPayments();
