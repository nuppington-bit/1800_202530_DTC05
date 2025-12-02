import { onAuthReady } from "./authentication.js";
import { db } from "/src/firebaseConfig.js";
import { doc, getDoc, getDocs, query, orderBy, collection, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

async function saveProfileDetails(name) {
    const usernameElement = document.getElementById("username")
    const usernamePlaceholder = document.getElementById("display-name")
    const profileImage = document.getElementById("profileImage")
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user logged in");
    }

    const userRef = doc(db, "users", user.uid);

    // Update the document
    await updateDoc(userRef, {
        displayName: name
    });

    usernameElement.textContent = name
    usernamePlaceholder.setAttribute("placeholder", name)
    profileImage.textContent = name[0]
}

async function saveKnowledgeLevel(level) {
    const levels = ["Beginner", "Intermediate", "Expert"];
    const knowledgeLevel = document.getElementById("level")
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user logged in");
    }

    const userRef = doc(db, "users", user.uid);

    // Update the document
    await updateDoc(userRef, {
        knowledgeLevel: level
    });
    knowledgeLevel.textContent = `Knowledge level: ${levels[level]}`;
}


async function showDashboard() {
    const usernameElement = document.getElementById("username")
    const usernamePlaceholder = document.getElementById("display-name")
    const knowledgeLevel = document.getElementById("level")
    const testAverage = document.getElementById("average")
    const profileImage = document.getElementById("profileImage")
    const placeholderBr = document.getElementById("placeholderBr")
    const scoresList = document.getElementById("scores")
    const levels = ["Beginner", "Intermediate", "Expert"];

    onAuthReady(async (user) => {
        if (!user) {
            location.href = "index.html";
            return;
        }
        const scoresCollectionRef = query(collection(db, "users", user.uid, "testScores"), orderBy("timestamp", "desc"))
        const usersCollectionRef = doc(db, "users", user.uid);
        try {
            const querySnapshot = await getDoc(usersCollectionRef);
            const scoresQuerySnapshot = await getDocs(scoresCollectionRef);
            scoresList.innerHTML = ""
            scoresQuerySnapshot.forEach(async function (docSnap, index) {
                let scoreListItem = document.createElement("li")
                let score = docSnap.data()
                scoreListItem.classList.add("list-group-item")
                scoreListItem.innerHTML = `${new Date(score.timestamp.seconds * 1000).toLocaleDateString('en-US')}: ${score.score.toFixed(2)}%`
                scoresList.appendChild(scoreListItem)
            });
            usernameElement.textContent = querySnapshot.data().displayName;
            usernamePlaceholder.setAttribute("placeholder", querySnapshot.data().displayName)
            knowledgeLevel.textContent = `Knowledge level: ${levels[querySnapshot.data().knowledgeLevel]}`;
            testAverage.textContent = `Last test result: ${querySnapshot.data().testAverage.toFixed(2)}%`;
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

document.getElementById("profile-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const displayName = document.getElementById("display-name").value.trim();

    saveProfileDetails(displayName);
    console.log("done")
    event.target.reset();
});

document.getElementById("knowledge-level-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const level = parseInt(document.getElementById("knowledge-level").value);

    saveKnowledgeLevel(level);
    console.log("done")
    event.target.reset();
});

// if (window.history && window.history.pushState) {
//     document.getElementById("level-modal").on('show.bs.modal', function (e) {
//         window.history.pushState('forward', null, './#levelModal');
//     });

//     window.on('popstate', function () {
//         document.getElementById("level-modal").modal('hide');
//     });
// }