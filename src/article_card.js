import { db } from "./firebaseConfig.js"
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";

async function displayArticleCardsDynamically(params) {
    let cardTemplate = document.getElementById("article_card_template");
    const articlesCollectionRef = query(collection(db, "articles"), orderBy("article_name", "asc"));

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

            document.getElementById("articles_go_here").appendChild(newcard);
        })
    } catch (error) {
        console.error("error getting documents", error);
    }
}

displayArticleCardsDynamically();