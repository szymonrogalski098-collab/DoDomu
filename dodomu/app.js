import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const VIEW_IDS = ["view-auth", "view-pending", "view-app"];

const authForm = document.getElementById("auth-form");
const emailInput = document.getElementById("auth-email");
const passwordInput = document.getElementById("auth-password");
const registerButton = document.getElementById("btn-register");
const logoutButton = document.getElementById("btn-logout");
const authErrorEl = document.getElementById("auth-error");

function showView(id) {
  for (const viewId of VIEW_IDS) {
    document.getElementById(viewId).hidden = viewId !== id;
  }
}

function showAuthError(message) {
  authErrorEl.textContent = message;
}

function clearAuthError() {
  authErrorEl.textContent = "";
}

function mapAuthErrorToMessage(code) {
  switch (code) {
    case "auth/wrong-password":
      return "Nieprawidłowe hasło.";
    case "auth/invalid-credential":
      return "Nieprawidłowy e-mail lub hasło.";
    case "auth/user-not-found":
      return "Nie znaleziono konta z tym adresem e-mail.";
    case "auth/email-already-in-use":
      return "To konto już istnieje.";
    case "auth/invalid-email":
      return "Nieprawidłowy adres e-mail.";
    case "auth/weak-password":
      return "Hasło musi mieć co najmniej 6 znaków.";
    default:
      return "Coś poszło nie tak. Spróbuj ponownie.";
  }
}

function getCredentialsFromForm() {
  return {
    email: emailInput.value.trim(),
    password: passwordInput.value,
  };
}

function buildNewUserRecord(email) {
  return {
    approved: false,
    balance: 0,
    email,
    createdAt: Date.now(),
  };
}

async function createUserDocument(uid, email) {
  await setDoc(doc(db, "users", uid), buildNewUserRecord(email));
}

async function fetchUserDocument(uid) {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? snapshot.data() : null;
}

async function handleLogin(event) {
  event.preventDefault();
  clearAuthError();
  const { email, password } = getCredentialsFromForm();
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    showAuthError(mapAuthErrorToMessage(error.code));
  }
}

async function handleRegister() {
  clearAuthError();
  const { email, password } = getCredentialsFromForm();
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocument(credential.user.uid, email);
  } catch (error) {
    showAuthError(mapAuthErrorToMessage(error.code));
  }
}

async function handleLogout() {
  await signOut(auth);
}

async function routeSignedInUser(user) {
  const userRecord = await fetchUserDocument(user.uid);
  if (userRecord && userRecord.approved === true) {
    showView("view-app");
  } else {
    showView("view-pending");
  }
}

function handleAuthStateChanged(user) {
  clearAuthError();
  if (user === null) {
    showView("view-auth");
    return;
  }
  routeSignedInUser(user);
}

function bindEventListeners() {
  authForm.addEventListener("submit", handleLogin);
  registerButton.addEventListener("click", handleRegister);
  logoutButton.addEventListener("click", handleLogout);
}

function init() {
  bindEventListeners();
  onAuthStateChanged(auth, handleAuthStateChanged);
}

init();
