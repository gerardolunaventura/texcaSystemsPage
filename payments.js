import { db, projectId } from "./firebase.js?v=7";
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

const withTimeout = (promise, ms) =>
new Promise((resolve, reject) => {
const timer = setTimeout(() => reject(new Error("timeout")), ms);
promise
  .then((value) => {
    clearTimeout(timer);
    resolve(value);
  })
  .catch((error) => {
    clearTimeout(timer);
    reject(error);
  });
});

const addPaymentViaRest = async (paymentData) => {
const token = await currentUser.getIdToken(true);
const payload = {
  fields: {
    concepto: { stringValue: paymentData.concepto },
    monto: { doubleValue: paymentData.monto },
    uid: { stringValue: paymentData.uid },
    userEmail: { stringValue: paymentData.userEmail },
    createdBy: { stringValue: paymentData.createdBy },
    fecha: { timestampValue: paymentData.fecha.toISOString() }
  }
};

const response = await fetch(
  `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/payments`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  }
);

if(!response.ok){
const body = await response.json().catch(() => ({}));
const message = body.error && body.error.message ? body.error.message : `http_${response.status}`;
throw new Error(message);
}
};

const ensureContext = async (showError = true) => {
const context = await getUserContext();
currentUser = context.user;
currentRole = context.role;
currentProfile = context.profile;

if(!currentUser && showError){
setStatus("Sesion no valida. Inicia sesion nuevamente.", "error");
}

return Boolean(currentUser);
};

const init = async () => {
const ok = await ensureContext(false);
if(ok){
loadPayments();
}
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
const ok = await ensureContext(true);
if(!ok) return;
}

const submitButton = form.querySelector("button");
submitButton.disabled = true;
setStatus("Guardando pago...", "info");

const paymentData = {
concepto,
monto,
uid: currentUser.uid,
userEmail: currentUser.email || "",
createdBy: currentProfile && currentProfile.name ? currentProfile.name : "Usuario",
fecha: new Date()
};

try{
await withTimeout(addDoc(collection(db,"payments"), paymentData), 10000);

setStatus("Pago guardado correctamente.", "success");
form.reset();
loadPayments();
}catch(error){
if(error && error.message === "timeout"){
try{
await addPaymentViaRest(paymentData);
setStatus("Pago guardado correctamente.", "success");
form.reset();
loadPayments();
}catch(restError){
const message = restError && restError.message ? restError.message : "unknown";
setStatus(`No se pudo guardar el pago (${message}).`, "error");
}
}else{
const code = error && error.code ? error.code : "unknown";
setStatus(`No se pudo guardar el pago (${code}).`, "error");
}
}finally{
submitButton.disabled = false;
}

});
}

async function loadPayments(){

if(!list) return;
list.innerHTML="";

try{
const ok = await ensureContext(false);
if(!ok){
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
