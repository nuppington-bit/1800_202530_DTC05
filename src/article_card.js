import { db } from "./firebaseConfig.js"
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

async function displayArticleCardsDynamically(params) {
    let cardTemplate = document.getElementById("article_card_template");   
    const articlesCollectionRef = collection(db, "articles");
    
    try{
        const querySnapshot = await getDocs(articlesCollectionRef);
        querySnapshot.forEach(doc => {
            let newcard = cardTemplate.content.cloneNode(true);
            const article = doc.data();
            console.log(article);
            
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