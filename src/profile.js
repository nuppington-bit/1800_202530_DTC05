import { onAuthReady } from "./authentication.js";

function showDashboard() {
    const usernameElement = document.getElementById("username")
    const knowledgeLevel = document.getElementById("level")
    const testAverage = document.getElementById("average")

    onAuthReady((user) => {
        if (!user) {
            location.href = "index.html";
            return;
        }
        usernameElement.textContent = user.displayName;
        knowledgeLevel.textContent = user.knowledgeLevel;
        testAverage.textContent = user.testAverage;
    })
}