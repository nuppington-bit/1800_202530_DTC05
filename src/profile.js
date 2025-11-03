import { onAuthReady } from "./authentication.js";
import { db } from "/src/firebaseConfig.js";
import { doc, getDoc, collection } from "firebase/firestore";

async function showDashboard() {
    const usernameElement = document.getElementById("username")
    const knowledgeLevel = document.getElementById("level")
    const testAverage = document.getElementById("average")
    const profileImage = document.getElementById("profileImage")
    const placeholderBr = document.getElementById("placeholderBr")
    const levels = ["Beginner", "Intermediate", "Expert"];

    onAuthReady(async (user) => {
        if (!user) {
            location.href = "index.html";
            return;
        }
        const usersCollectionRef = doc(db, "users", user.uid);
        try{
            const querySnapshot = await getDoc(usersCollectionRef);
            usernameElement.textContent = querySnapshot.data().displayName;
            knowledgeLevel.textContent = `Knowledge level: ${levels[querySnapshot.data().knowledgeLevel]}`;
            testAverage.textContent = `Average: ${String(querySnapshot.data().testAverage).padStart(2, '0')}%`;
            profileImage.textContent = querySnapshot.data().displayName[0]
            
            usernameElement.classList.remove("placeholder")
            knowledgeLevel.classList.remove("placeholder")
            placeholderBr.remove()
            testAverage.classList.remove("placeholder")
            profileImage.classList.remove("placeholder")
        } catch (error) {
            console.error("error getting user", error);
        }
    })
}

showDashboard();