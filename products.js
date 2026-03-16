import { db, storage } from "./firebase.js?v=7";
import { getUserContext } from "./user-state.js";

import {
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const container=document.getElementById("productsList");
const form=document.getElementById("productForm");
const status=document.getElementById("productStatus");
let currentUser = null;
let currentRole = "member";

const setStatus = (text, type = "info") => {
if(!status) return;
status.textContent = text;
status.dataset.type = type;
};

const ensureContext = async (showError = true) => {
const context = await getUserContext();
currentUser = context.user;
currentRole = context.role;

if(!currentUser && showError){
setStatus("Sesion no valida. Inicia sesion nuevamente.", "error");
}

return Boolean(currentUser);
};

const init = async () => {
const ok = await ensureContext(false);
if(ok && currentRole !== "admin"){
if(form){
form.hidden = true;
}
setStatus("Solo administradores pueden subir productos.", "info");
}
loadProducts();
};

init();

if(form){
form.addEventListener("submit",async(e)=>{
e.preventDefault();

if(currentRole !== "admin"){
setStatus("Permiso denegado para subir productos.", "error");
return;
}

const name=document.getElementById("productName").value;
const priceValue=document.getElementById("price").value;
const price=Number.parseFloat(priceValue);
const photoFile=document.getElementById("photo").files[0];

if(!name || Number.isNaN(price)){
setStatus("Completa nombre y precio con un numero valido.", "error");
return;
}

if(!photoFile){
setStatus("Selecciona una foto para el producto.", "error");
return;
}

const submitButton = form.querySelector("button");
submitButton.disabled = true;
setStatus("Subiendo producto...", "info");

if(!currentUser){
const ok = await ensureContext(true);
if(!ok){
submitButton.disabled = false;
return;
}
}

try{
const storageRef = ref(storage, `products/${Date.now()}-${photoFile.name}`);
await uploadBytes(storageRef, photoFile);
const photoUrl = await getDownloadURL(storageRef);

await addDoc(collection(db,"products"),{
name,
price,
photo: photoUrl,
createdBy: currentUser.uid,
createdAt: new Date()
});

setStatus("Producto subido correctamente.", "success");
form.reset();
loadProducts();
}catch(error){
const code = error && error.code ? error.code : "unknown";
setStatus(`No se pudo subir el producto (${code}).`, "error");
}finally{
submitButton.disabled = false;
}
});
}

async function loadProducts(){

if(!container) return;
container.innerHTML = "";

try{
const querySnapshot=await getDocs(collection(db,"products"));

if(querySnapshot.empty){
const empty=document.createElement("p");
empty.className = "muted";
empty.innerText = "Aun no hay productos publicados.";
container.appendChild(empty);
return;
}

querySnapshot.forEach(doc=>{

const data=doc.data();

const div=document.createElement("div");
div.className = "product-card";

div.innerHTML=`

<img src="${data.photo || ""}" alt="${data.name || "Producto"}">
<div class="product-info">
<h4>${data.name}</h4>
<p>$${typeof data.price === "number" ? data.price.toFixed(2) : data.price}</p>
</div>

`;

container.appendChild(div);

});
}catch(error){
setStatus("No se pudieron cargar los productos.", "error");
}

}
