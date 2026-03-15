import { db } from "./firebase.js?v=6";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const container=document.getElementById("allPayments");
const status=document.getElementById("adminStatus");

const setStatus = (text, type = "info") => {
if(!status) return;
status.textContent = text;
status.dataset.type = type;
};

async function load(){

if(!container) return;
container.innerHTML = "";

try{
const snapshot=await getDocs(collection(db,"payments"));

if(snapshot.empty){
setStatus("Aun no hay pagos registrados.", "info");
return;
}

snapshot.forEach(doc=>{

const data=doc.data();

const p=document.createElement("p");

const montoTexto = typeof data.monto === "number" ? data.monto.toFixed(2) : data.monto;
const autor = data.createdBy || data.userEmail || "Usuario";
p.innerText=`${data.concepto} $${montoTexto} · ${autor}`;

container.appendChild(p);

});
}catch(error){
setStatus("No se pudieron cargar los pagos.", "error");
}

}

load();
