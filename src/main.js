import { db } from "./firebaseConfig.js";
import { onAuthReady } from "./authentication.js";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  doc,
  onSnapshot,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

function showUsersBookmarks() {
  onAuthReady(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }
  });
}
function addBookmark() {
  onAuthReady(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }
    const articlesContainer = document.querySelector("#articles_go_here");

    articlesContainer.addEventListener("click", async (event) => {

      const btn = event.target.closest(".bookmarkBtn");
      if (!btn) return;

      const articleId = btn.dataset.articleId;

      btn.classList.toggle("clicked");

      const bookmarkRef = doc(db, "users", user.uid, "bookmarks", articleId);
      if (btn.classList.contains("clicked")) {
        await setDoc(bookmarkRef, { articleId });
      } else {
        await deleteDoc(bookmarkRef);
      }
    });
  })
}

function addFilterButton() {
  const navbarToggleButton = document.getElementById("navbarToggleButton");
  let filterToggleButton = document.createElement("div");
  filterToggleButton.innerHTML = `<button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#filterSidebar"><span class="material-symbols-outlined">filter_alt</span></button>`;
  filterToggleButton = filterToggleButton.firstElementChild;
  navbarToggleButton.parentNode.insertBefore(filterToggleButton, navbarToggleButton);
}

async function displayArticleCardsDynamically() {
  onAuthReady(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }
    let userKnowledgeLevel = 0;
    let cardTemplate = document.getElementById("article_card_template");
    const usersCollectionRef = doc(db, "users", user.uid);
    try {
      const querySnapshot = await getDoc(usersCollectionRef);
      userKnowledgeLevel = querySnapshot.data().knowledgeLevel;
    } catch (error) {
      console.log(error);
    }
    const articlesCollectionRef = query(
      collection(db, "articles"),
      orderBy("article_name", "asc"),
      where("level", "==", userKnowledgeLevel)
    );

    try {
      const querySnapshot = await getDocs(articlesCollectionRef);
      querySnapshot.forEach(async (docSnap) => {
        let newcard = cardTemplate.content.cloneNode(true);
        const article = docSnap.data();
        console.log(article);
        if (article.level + 1 > 1) {
          newcard.querySelector("#brain-2").setAttribute("fill", "#000");
        }
        if (article.level + 1 > 2) {
          newcard.querySelector("#brain-3").setAttribute("fill", "#000");
        }
        newcard.querySelector(".article_name").textContent =
          article.article_name;
        newcard.querySelector(".summary_text").textContent = article.summary;
        newcard.querySelector(".article_link").href = article.link;
        newcard.querySelector(".article_link_title").href = article.link;
        const bookmarkBtn = newcard.querySelector(".bookmarkBtn");
        bookmarkBtn.dataset.articleId = docSnap.id;

        //checks if the user already has the bookmark in the database
        const bookmarkRef = doc(db, "users", user.uid, "bookmarks", docSnap.id);
        const bookmarkSnapshot = await getDoc(bookmarkRef);

        if (bookmarkSnapshot.exists()) {
          bookmarkBtn.classList.add("clicked");
        }

        document.getElementById("articles_go_here").appendChild(newcard);
      });
    } catch (error) {
      console.error("error getting documents", error);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addBookmark();
})

addFilterButton();
displayArticleCardsDynamically();

