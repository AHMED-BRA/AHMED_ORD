import { getApps, getApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const app = getApps().length ? getApp() : null;

if (!app) {
  console.error("Firebase app is not initialized.");
} else {
  const auth = getAuth(app);
  const db = getFirestore(app);

  window.saveStoreOrder = async function(order) {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Please log in before placing an order.");
    }

    return await addDoc(collection(db, "orders"), {
      customerUid: user.uid,
      customerName: order.name,
      email: order.email || "",
      phone: order.phone,
      address: order.address,
      items: order.items,
      total: order.total,
      status: "Pending",
      createdAt: serverTimestamp()
    });
  };
}
