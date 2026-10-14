import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getFirestore, collection, getDocs, query, orderBy
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDD5BCFkNOx-pklchqoTcJXZ7WMnKb6VaY",
  authDomain: "oud-oro-store.firebaseapp.com",
  projectId: "oud-oro-store",
  storageBucket: "oud-oro-store.firebasestorage.app",
  messagingSenderId: "1017983597686",
  appId: "1:101798359768:web:4904827dc04ec0af1af357",
  measurementId: "G-SS2TEMDL8E"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const status = document.getElementById("status");
const ordersBox = document.getElementById("orders");
const refresh = document.getElementById("refresh");

async function loadOrders() {
  ordersBox.textContent = "";
  status.textContent = "Loading orders...";

  try {
    const snapshot = await getDocs(
      query(collection(db, "orders"), orderBy("createdAt", "desc"))
    );

    if (snapshot.empty) {
      status.textContent = "No orders yet. New orders will appear here once checkout saves them.";
      return;
    }

    status.textContent = "Orders found: " + snapshot.size;

    snapshot.forEach((docSnap) => {
      const order = docSnap.data();
      const card = document.createElement("div");
      card.style.cssText = "padding:15px;margin:12px 0;border:1px solid #ddd;border-radius:8px";

      const heading = document.createElement("h3");
      heading.textContent = "Order #" + docSnap.id;

      const details = document.createElement("pre");
      details.style.whiteSpace = "pre-wrap";
      details.textContent =
        "Customer: " + (order.customerName || "N/A") +
        "\nPhone: " + (order.phone || "N/A") +
        "\nAddress: " + (order.address || "N/A") +
        "\nTotal: Rs. " + (order.total ?? "N/A") +
        "\nStatus: " + (order.status || "Pending");

      card.append(heading, details);
      ordersBox.appendChild(card);
    });
  } catch (error) {
    status.textContent = "Error: " + error.message;
  }
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    status.textContent = "Please log in with the admin account first.";
    ordersBox.textContent = "";
    return;
  }

  if (user.email?.toLowerCase() !== "mamoqureshi55@gmail.com") {
    status.textContent = "Access denied: this account is not the admin.";
    ordersBox.textContent = "";
    return;
  }

  loadOrders();
});

refresh.addEventListener("click", loadOrders);