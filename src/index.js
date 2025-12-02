import { onAuthReady } from "./authentication.js";
import { db } from "/src/firebaseConfig.js";
import {
  doc,
  getDoc,
  collection,
  updateDoc,
  query,
  getDocs,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

function addBookmark() {
  onAuthReady(async (user) => {
    const articlesContainer = document.querySelector("#bookmarksGoHere");

    articlesContainer.addEventListener("click", async (event) => {
      const btn = event.target.closest(".bookmarkBtn");
      if (!btn) return;

      const articleId = btn.dataset.articleId;
      const card = btn.closest(".card");

      btn.classList.toggle("clicked");

      const bookmarkRef = doc(db, "users", user.uid, "bookmarks", articleId);
      if (btn.classList.contains("clicked")) {
        await setDoc(bookmarkRef, { articleId }); // Add bookmark to user's bookmark collection
      } else {
        await deleteDoc(bookmarkRef); // Remove bookmark
      }
      if (card) card.remove();
    });
  });
}

async function setupHome() {
  onAuthReady(async (user) => {
    console.log(user);
    const loginSignupSection = document.getElementById("loginSignupSection");
    const bookmarksGoHere = document.getElementById("bookmarksGoHere");
    if (user) {
      // remove login/sign up buttons if a user is signed in
      loginSignupSection.classList.remove("d-flex");
      loginSignupSection.classList.add("d-none");
      // replace login buttons with users bookmarks if they exist.
      bookmarksGoHere.classList.remove("d-none");
      let bookmarkTemplate = document.getElementById("bookmarkTemplate");
      const usersCollectionRef = doc(db, "users", user.uid);
      try {
        const querySnapshot = await getDoc(usersCollectionRef);
        userKnowledgeLevel = querySnapshot.data().knowledgeLevel;
        console.log(userKnowledgeLevel);
      } catch (error) {
        console.log(error);
      }

      const bookmarkCollectionRef = collection(usersCollectionRef, "bookmarks");

      try {
        const bookmarkSnap = await getDocs(bookmarkCollectionRef);

        bookmarkSnap.forEach(async (docSnap) => { // Populate bookmarks list with user's bookmarked articles
          const bookmarkId = docSnap.data().articleId;
          const articleRef = doc(db, "articles", bookmarkId);
          const artSnap = await getDoc(articleRef);
          let bookmarkCard = bookmarkTemplate.content.cloneNode(true);
          if (artSnap.exists()) {
            const article = artSnap.data();
            if (article.level + 1 > 1) { // Change brain icon color to represent knowledge level
              bookmarkCard
                .querySelector("#brain-2")
                .setAttribute("fill", "#000");
            }
            if (article.level + 1 > 2) {
              bookmarkCard
                .querySelector("#brain-3")
                .setAttribute("fill", "#000");
            }
            bookmarkCard.querySelector(".article_name").textContent =
              article.article_name;
            bookmarkCard.querySelector(".article_link").href = article.link;
            bookmarkCard.querySelector(".article_link_title").href =
              article.link;
            const bookmarkBtn = bookmarkCard.querySelector(".bookmarkBtn");
            bookmarkBtn.dataset.articleId = docSnap.id;

            //checks if the user already has the bookmark in the database
            const bookmarkRef = doc(
              db,
              "users",
              user.uid,
              "bookmarks",
              docSnap.id
            );
            const bookmarkSnapshot = await getDoc(bookmarkRef);

            if (bookmarkSnapshot.exists()) {
              bookmarkBtn.classList.add("clicked");
            }
            document
              .getElementById("bookmarksGoHere")
              .appendChild(bookmarkCard);
          } else {
            console.log("No Bookmark Found!");
          }
        });
      } catch (error) {
        console.error("error getting documents", error);
      }
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  addBookmark();
});
setupHome();
