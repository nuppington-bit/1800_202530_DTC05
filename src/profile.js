import { onAuthReady } from "./authentication.js";

function showDashboard() {
    const usernameElement = document.getElementById("username")
    const knowledgeLevel = document.getElementById("level")
    const testAverage = document.getElementById("average")
    const profileImage = document.getElementById("profileImage")
    const levels = ["Beginner", "Intermediate", "Expert"];

    onAuthReady((user) => {
        if (!user) {
            location.href = "index.html";
            return;
        }
        usernameElement.textContent = user.displayName;
        knowledgeLevel.textContent = levels[user.knowledgeLevel];
        testAverage.textContent = `Average: ${String(user.testAverage).padStart(2, '0')}%`;
        profileImage.textContent = user.displayName[0]
    })
}

showDashboard();