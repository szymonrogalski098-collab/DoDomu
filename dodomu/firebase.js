import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBgB8czYpWo_ifYorWyCK1HrBVgZV6XD5Q",
  authDomain: "dodomu-507716.firebaseapp.com",
  projectId: "dodomu-507716",
  storageBucket: "dodomu-507716.firebasestorage.app",
  messagingSenderId: "659057204974",
  appId: "1:659057204974:web:e8feb8237840d3909a1dff"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
