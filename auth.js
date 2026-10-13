import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDD5BCFkNOx-pklchqoTcJXZ7WMnKb6VaY",
  authDomain: "oud-oro-store.firebaseapp.com",
  projectId: "oud-oro-store",
  storageBucket: "oud-oro-store.firebasestorage.app",
  messagingSenderId: "1017983597686",
  appId: "1:101798359768:web:4904827dc04ec0af1af357",
  measurementId: "G-SS2TEMDL8E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const authSection = document.getElementById("auth-section");
const status = document.getElementById("auth-status");
const message = document.getElementById("auth-message");

function showError(error) {
  const messages = {
    "auth/email-already-in-use": "This email already has an account. Please log in.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Please use a stronger password of at least 6 characters.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Internet connection problem. Please try again."
  };

  status.textContent =
    messages[error.code] || "Error: " + error.message;
}

document.getElementById("signup-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "Creating your account...";

  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    status.textContent = "Account created successfully!";
  } catch (error) {
    showError(error);
  }
});

document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "Logging in...";

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    status.textContent = "Login successful!";
  } catch (error) {
    showError(error);
  }
});

onAuthStateChanged(auth, (user) => {
  let logoutButton = document.getElementById("store-logout");

  if (user) {
    document.body.classList.remove("auth-locked");
    authSection.hidden = true;

    if (!logoutButton) {
      logoutButton = document.createElement("button");
      logoutButton.id = "store-logout";
      logoutButton.type = "button";
      logoutButton.textContent = "Logout";
      logoutButton.className = "store-logout";

      document.querySelector(".header").appendChild(logoutButton);

      logoutButton.addEventListener("click", async () => {
        try {
          await signOut(auth);
        } catch (error) {
          status.textContent = error.message;
        }
      });
    }
  } else {
    document.body.classList.add("auth-locked");
    authSection.hidden = false;

    if (logoutButton) logoutButton.remove();

    message.textContent = "Welcome! Login or create your account.";
  }
});