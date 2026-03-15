import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form=document.getElementById("paymentForm");

const list=document.getElementById("paymentsList");

form.addEventListener("submit",async(e)=>{

e.preventDefault();

const concepto=document.getElementById("concepto").value;

const monto=document.getElementById("monto").value;

await addDoc(collection(db,"payments"),{

concepto,
monto,
fecha:new Date()

});

loadPayments();

});

async function loadPayments(){

list.innerHTML="";

const querySnapshot=await getDocs(collection(db,"payments"));

querySnapshot.forEach(doc=>{

const data=doc.data();

const li=document.createElement("li");

li.innerText=data.concepto+" $"+data.monto;

list.appendChild(li);

});

}

loadPayments();