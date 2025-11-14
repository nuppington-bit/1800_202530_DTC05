import { onAuthReady } from "./authentication.js";
import { db } from "/src/firebaseConfig.js";
import { doc, getDoc, collection, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

onAuthReady(async (user) => {
    console.log(user)
    const loginSignupSection = document.getElementById("loginSignupSection")
    if (user) {
        loginSignupSection.classList.remove("d-flex")
        loginSignupSection.classList.add("d-none")
    }
})