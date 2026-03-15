import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const container=document.getElementById("allPayments");

async function load(){

const snapshot=await getDocs(collection(db,"payments"));

snapshot.forEach(doc=>{

const data=doc.data();

const p=document.createElement("p");

p.innerText=data.concepto+" $"+data.monto;

container.appendChild(p);

});

}

load();