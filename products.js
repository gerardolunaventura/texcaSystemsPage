import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const container=document.getElementById("productsList");

async function loadProducts(){

const querySnapshot=await getDocs(collection(db,"products"));

querySnapshot.forEach(doc=>{

const data=doc.data();

const div=document.createElement("div");

div.innerHTML=`

<h4>${data.name}</h4>
<img src="${data.photo}" width="120">
<p>$${data.price}</p>

`;

container.appendChild(div);

});

}

loadProducts();