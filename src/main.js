import { db } from "./firebaseConfig.js"
import { onAuthReady } from "./authentication.js";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, where } from "firebase/firestore";

async function displayArticleCardsDynamically(params) {
    onAuthReady(async (user) => {
        if (!user) {
            location.href = "index.html";
            return;
        }
        let userKnowledgeLevel = 0
        let cardTemplate = document.getElementById("article_card_template");
        const usersCollectionRef = doc(db, "users", user.uid);
        try {
            const querySnapshot = await getDoc(usersCollectionRef);
            userKnowledgeLevel = querySnapshot.data().knowledgeLevel
        }
        catch (error) {
            console.log(error)
        }
        const articlesCollectionRef = query(collection(db, "articles"), orderBy("article_name", "asc"), where("level", "==", userKnowledgeLevel));


        try {
            const querySnapshot = await getDocs(articlesCollectionRef);
            querySnapshot.forEach(doc => {
                let newcard = cardTemplate.content.cloneNode(true);
                const article = doc.data();
                console.log(article);
                if (article.level + 1 > 1) {
                    newcard.querySelector("#brain-2").setAttribute("fill", "#000")
                }
                if (article.level + 1 > 2) {
                    newcard.querySelector("#brain-3").setAttribute("fill", "#000")
                }
                newcard.querySelector("#article_name").textContent = article.article_name;
                newcard.querySelector("#summary_text").textContent = article.summary;
                newcard.querySelector("#article_link").href = article.link;
                newcard.querySelector("#article_link_title").href = article.link;

                document.getElementById("articles_go_here").appendChild(newcard);
            })
        } catch (error) {
            console.error("error getting documents", error);
        }
    })
}

displayArticleCardsDynamically();