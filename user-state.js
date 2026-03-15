import { auth, db, authReady } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const waitForAuth = () =>
new Promise((resolve) => {
const unsubscribe = onAuthStateChanged(auth, (user) => {
unsubscribe();
resolve(user);
});
});

export const getUserContext = async () => {
await authReady;
const user = auth.currentUser ?? (await waitForAuth());
if(!user){
return { user: null, role: "guest", profile: null };
}

try{
const snapshot = await getDoc(doc(db, "users", user.uid));
const profile = snapshot.exists() ? snapshot.data() : null;
const role = profile && profile.role ? profile.role : "member";
return { user, role, profile };
}catch(error){
return { user, role: "member", profile: null };
}
};
