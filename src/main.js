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
  updateDoc,
  count,
  getCountFromServer,
} from "firebase/firestore";

function addRating() {
  onAuthReady(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }

    const articlesContainer = document.querySelector("#articles_go_here");

    articlesContainer.addEventListener("click", async (event) => {
      const articleCard = event.target.closest(".card");
      const articleId = articleCard.dataset.articleId;

      const thumbsUpBtn = articleCard.querySelector(".thumbsUpBtn");
      const thumbsDownBtn = articleCard.querySelector(".thumbsDownBtn");

      let userRating = null;
      if (thumbsUpBtn.classList.contains("clicked")) userRating = "up";
      if (thumbsDownBtn.classList.contains("clicked")) userRating = "down";

      const clickedUp = event.target.closest(".thumbsUpBtn");
      const clickedDown = event.target.closest(".thumbsDownBtn");

      const ratingRef = doc(db, "articles", articleId, "ratings", user.uid);
      let upVoteCount = articleCard.querySelector(".upVote");
      let downVoteCount = articleCard.querySelector(".downVote");
      if (clickedUp) {
        if (userRating === "up") {
          thumbsUpBtn.classList.remove("clicked");
          await updateDoc(ratingRef, {
            rating: 0,
          });
          articleCard.querySelector(".upVote").textContent =
            Number(upVoteCount.textContent) - 1;
        } else if (userRating === "down") {
          thumbsUpBtn.classList.add("clicked");
          thumbsDownBtn.classList.remove("clicked");
          await setDoc(ratingRef, {
            rating: 1,
          });
          articleCard.querySelector(".downVote").textContent =
            Number(downVoteCount.textContent) - 1;
          articleCard.querySelector(".upVote").textContent =
            Number(upVoteCount.textContent) + 1;
        } else {
          thumbsUpBtn.classList.add("clicked");
          thumbsDownBtn.classList.remove("clicked");
          await setDoc(ratingRef, {
            rating: 1,
          });
          articleCard.querySelector(".upVote").textContent =
            Number(upVoteCount.textContent) + 1;
        }
      }

      if (clickedDown) {
        if (userRating === "down") {
          thumbsDownBtn.classList.remove("clicked");
          await updateDoc(ratingRef, {
            rating: 0,
          });
          articleCard.querySelector(".downVote").textContent =
            Number(downVoteCount.textContent) - 1;
        } else if (userRating === "up") {
          thumbsDownBtn.classList.add("clicked");
          thumbsUpBtn.classList.remove("clicked");
          await setDoc(ratingRef, {
            rating: -1,
          });
          articleCard.querySelector(".upVote").textContent =
            Number(upVoteCount.textContent) - 1;
          articleCard.querySelector(".downVote").textContent =
            Number(downVoteCount.textContent) + 1;
        } else {
          thumbsDownBtn.classList.add("clicked");
          thumbsUpBtn.classList.remove("clicked");
          await setDoc(ratingRef, {
            rating: -1,
          });
          articleCard.querySelector(".downVote").textContent =
            Number(downVoteCount.textContent) + 1;
        }
      }
    });
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
  });
}

function addFilterButton() {
  const navbarToggleButton = document.getElementById("navbarToggleButton");
  let filterToggleButton = document.createElement("div");
  filterToggleButton.innerHTML = `<button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#filterSidebar"><span class="material-symbols-outlined">filter_alt</span></button>`;
  filterToggleButton = filterToggleButton.firstElementChild;
  navbarToggleButton.parentNode.insertBefore(
    filterToggleButton,
    navbarToggleButton
  );
}

async function getQueryFilter(first_fetch, user) {
  let knowledgeLevelSelector = document.getElementById("knowledge-level");
  let userKnowledgeLevel = 0;
  let knowledgeFilter = 0;
  const usersCollectionRef = doc(db, "users", user.uid);
  try {
    const querySnapshot = await getDoc(usersCollectionRef);
    if (first_fetch) {
      userKnowledgeLevel = querySnapshot.data().knowledgeLevel;
      knowledgeFilter = userKnowledgeLevel;
      knowledgeLevelSelector.value = userKnowledgeLevel;
      knowledgeLevelSelector.options[
        knowledgeLevelSelector.selectedIndex
      ].text =
        knowledgeLevelSelector.options[knowledgeLevelSelector.selectedIndex]
          .text + " (Default)";
    } else {
      knowledgeFilter = parseInt(
        knowledgeLevelSelector.options[knowledgeLevelSelector.selectedIndex]
          .value
      );
    }
  } catch (error) {
    console.log(error);
  }
  return knowledgeFilter;
}

async function displayArticleCardsDynamically(first_fetch) {
  onAuthReady(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }
    let knowledgeFilter = await getQueryFilter(first_fetch, user);
    let cardTemplate = document.getElementById("article_card_template");
    const articlesCollectionRef = query(
      collection(db, "articles"),
      orderBy("article_name", "asc"),
      where("level", "==", knowledgeFilter)
    );

    try {
      const querySnapshot = await getDocs(articlesCollectionRef);
      document.getElementById("articles_go_here").innerHTML = `
      <div class="card mx-auto mt-5 max-w-md" style="width: 75%">
        <div class="card-header d-flex justify-content-between flex-row">
          <div class="d-flex flex-column">
            <a class="show-underline-hover text-body article_link_title" href="#">
              <h3 class="article_name placeholder">Lorem Ipsum</h3>
            </a>
            <div class="d-flex flex-row">
              <svg xmlns="http://www.w3.org/2000/svg" id="brain-1" height="48px" viewBox="0 -960 960 960" width="48px"
                fill="#808080">
                <path
                  d="M317-160q-8 0-15-4t-11-11l-84-150h71l42 80h90v-30h-72l-42-80H191l-63-110q-2-4-3-7.5t-1-7.5q0-2 4-15l63-110h105l42-80h72v-30h-90l-42 80h-71l84-150q4-7 11-11t15-4h118q13 0 21.5 8.5T465-770v175h-85l-30 30h115v130h-98l-39-80h-98l-30 30h108l40 80h117v215q0 13-8.5 21.5T435-160H317Zm208 0q-13 0-21.5-8.5T495-190v-215h117l40-80h108l-30-30h-98l-39 80h-98v-130h115l-30-30h-85v-175q0-13 8.5-21.5T525-800h118q8 0 15 4t11 11l84 150h-71l-42-80h-90v30h72l42 80h105l63 110q2 4 3 7.5t1 7.5q0 2-4 15l-63 110H664l-42 80h-72v30h90l42-80h71l-84 150q-4 7-11 11t-15 4H525Z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" id="brain-2" height="48px" viewBox="0 -960 960 960" width="48px"
                fill="#808080">
                <path
                  d="M317-160q-8 0-15-4t-11-11l-84-150h71l42 80h90v-30h-72l-42-80H191l-63-110q-2-4-3-7.5t-1-7.5q0-2 4-15l63-110h105l42-80h72v-30h-90l-42 80h-71l84-150q4-7 11-11t15-4h118q13 0 21.5 8.5T465-770v175h-85l-30 30h115v130h-98l-39-80h-98l-30 30h108l40 80h117v215q0 13-8.5 21.5T435-160H317Zm208 0q-13 0-21.5-8.5T495-190v-215h117l40-80h108l-30-30h-98l-39 80h-98v-130h115l-30-30h-85v-175q0-13 8.5-21.5T525-800h118q8 0 15 4t11 11l84 150h-71l-42-80h-90v30h72l42 80h105l63 110q2 4 3 7.5t1 7.5q0 2-4 15l-63 110H664l-42 80h-72v30h90l42-80h71l-84 150q-4 7-11 11t-15 4H525Z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" id="brain-3" height="48px" viewBox="0 -960 960 960" width="48px"
                fill="#808080">
                <path
                  d="M317-160q-8 0-15-4t-11-11l-84-150h71l42 80h90v-30h-72l-42-80H191l-63-110q-2-4-3-7.5t-1-7.5q0-2 4-15l63-110h105l42-80h72v-30h-90l-42 80h-71l84-150q4-7 11-11t15-4h118q13 0 21.5 8.5T465-770v175h-85l-30 30h115v130h-98l-39-80h-98l-30 30h108l40 80h117v215q0 13-8.5 21.5T435-160H317Zm208 0q-13 0-21.5-8.5T495-190v-215h117l40-80h108l-30-30h-98l-39 80h-98v-130h115l-30-30h-85v-175q0-13 8.5-21.5T525-800h118q8 0 15 4t11 11l84 150h-71l-42-80h-90v30h72l42 80h105l63 110q2 4 3 7.5t1 7.5q0 2-4 15l-63 110H664l-42 80h-72v30h90l42-80h71l-84 150q-4 7-11 11t-15 4H525Z" />
              </svg>
            </div>
          </div>
          <div>
            <button class="btn bookmarkBtn">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" stroke="#000000"
                stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="card-body">
          <p class="summary_text placeholder">
Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat repellendus cupiditate soluta! Pariatur recusandae laudantium quod rerum possimus? Facilis, quod.</p>
          <div class="d-flex pt-3 justify-content-between align-items-center">
            <div class="d-flex align-items-center justify-content-center ratingBorder">
              <div class="d-flex align-items-center justify-content-center border-end">
                <button class="btn thumbsUpBtn d-flex flex-row my-auto align-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <path
                      d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" />
                  </svg>
                  <p class="py-0 my-auto ps-2 upVote">0</p>
                </button>
              </div>
              <div class="d-flex align-items-center justify-content-center">
                <button class="btn thumbsDownBtn d-flex flex-row my-auto align-middle">
                  <svg xmlns=" http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <path
                      d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3" />
                  </svg>
                  <p class="py-0 my-auto ps-2 downVote">0</p>
                </button>
              </div>
            </div>
            <div>
              <a class="remove-underline text-color article_link" href="" target="_blank">
                <button class="btn btn-main d-flex align-middle py-2" aria-label="Opens in new tab">
                  Read more<span class="material-symbols-outlined ps-2 my-auto">open_in_new</span>
                  <!-- <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="currentColor" d="M20 12l-10 0" />
                    <path stroke="currentColor" d="M20 12l-4 4" />
                    <path stroke="currentColor" d="M20 12l-4 -4" />
                  </svg> -->
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="card mx-auto mt-5 max-w-md" style="width: 75%">
        <div class="card-header d-flex justify-content-between flex-row">
          <div class="d-flex flex-column">
            <a class="show-underline-hover text-body article_link_title" href="#">
              <h3 class="article_name placeholder">Lorem Ipsum</h3>
            </a>
            <div class="d-flex flex-row">
              <svg xmlns="http://www.w3.org/2000/svg" id="brain-1" height="48px" viewBox="0 -960 960 960" width="48px"
                fill="#808080">
                <path
                  d="M317-160q-8 0-15-4t-11-11l-84-150h71l42 80h90v-30h-72l-42-80H191l-63-110q-2-4-3-7.5t-1-7.5q0-2 4-15l63-110h105l42-80h72v-30h-90l-42 80h-71l84-150q4-7 11-11t15-4h118q13 0 21.5 8.5T465-770v175h-85l-30 30h115v130h-98l-39-80h-98l-30 30h108l40 80h117v215q0 13-8.5 21.5T435-160H317Zm208 0q-13 0-21.5-8.5T495-190v-215h117l40-80h108l-30-30h-98l-39 80h-98v-130h115l-30-30h-85v-175q0-13 8.5-21.5T525-800h118q8 0 15 4t11 11l84 150h-71l-42-80h-90v30h72l42 80h105l63 110q2 4 3 7.5t1 7.5q0 2-4 15l-63 110H664l-42 80h-72v30h90l42-80h71l-84 150q-4 7-11 11t-15 4H525Z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" id="brain-2" height="48px" viewBox="0 -960 960 960" width="48px"
                fill="#808080">
                <path
                  d="M317-160q-8 0-15-4t-11-11l-84-150h71l42 80h90v-30h-72l-42-80H191l-63-110q-2-4-3-7.5t-1-7.5q0-2 4-15l63-110h105l42-80h72v-30h-90l-42 80h-71l84-150q4-7 11-11t15-4h118q13 0 21.5 8.5T465-770v175h-85l-30 30h115v130h-98l-39-80h-98l-30 30h108l40 80h117v215q0 13-8.5 21.5T435-160H317Zm208 0q-13 0-21.5-8.5T495-190v-215h117l40-80h108l-30-30h-98l-39 80h-98v-130h115l-30-30h-85v-175q0-13 8.5-21.5T525-800h118q8 0 15 4t11 11l84 150h-71l-42-80h-90v30h72l42 80h105l63 110q2 4 3 7.5t1 7.5q0 2-4 15l-63 110H664l-42 80h-72v30h90l42-80h71l-84 150q-4 7-11 11t-15 4H525Z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" id="brain-3" height="48px" viewBox="0 -960 960 960" width="48px"
                fill="#808080">
                <path
                  d="M317-160q-8 0-15-4t-11-11l-84-150h71l42 80h90v-30h-72l-42-80H191l-63-110q-2-4-3-7.5t-1-7.5q0-2 4-15l63-110h105l42-80h72v-30h-90l-42 80h-71l84-150q4-7 11-11t15-4h118q13 0 21.5 8.5T465-770v175h-85l-30 30h115v130h-98l-39-80h-98l-30 30h108l40 80h117v215q0 13-8.5 21.5T435-160H317Zm208 0q-13 0-21.5-8.5T495-190v-215h117l40-80h108l-30-30h-98l-39 80h-98v-130h115l-30-30h-85v-175q0-13 8.5-21.5T525-800h118q8 0 15 4t11 11l84 150h-71l-42-80h-90v30h72l42 80h105l63 110q2 4 3 7.5t1 7.5q0 2-4 15l-63 110H664l-42 80h-72v30h90l42-80h71l-84 150q-4 7-11 11t-15 4H525Z" />
              </svg>
            </div>
          </div>
          <div>
            <button class="btn bookmarkBtn">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" stroke="#000000"
                stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="card-body">
          <p class="summary_text placeholder">
Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat repellendus cupiditate soluta! Pariatur recusandae laudantium quod rerum possimus? Facilis, quod.</p>
          <div class="d-flex pt-3 justify-content-between align-items-center">
            <div class="d-flex align-items-center justify-content-center ratingBorder">
              <div class="d-flex align-items-center justify-content-center border-end">
                <button class="btn thumbsUpBtn d-flex flex-row my-auto align-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <path
                      d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" />
                  </svg>
                  <p class="py-0 my-auto ps-2 upVote">0</p>
                </button>
              </div>
              <div class="d-flex align-items-center justify-content-center">
                <button class="btn thumbsDownBtn d-flex flex-row my-auto align-middle">
                  <svg xmlns=" http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <path
                      d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3" />
                  </svg>
                  <p class="py-0 my-auto ps-2 downVote">0</p>
                </button>
              </div>
            </div>
            <div class="">
              <a class="remove-underline text-color article_link" href="" target="_blank">
                <button class="btn btn-main d-flex align-middle py-2">
                  Read more
                  <!-- <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="currentColor" d="M20 12l-10 0" />
                    <path stroke="currentColor" d="M20 12l-4 4" />
                    <path stroke="currentColor" d="M20 12l-4 -4" />
                  </svg> -->
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>`;
      let newArticles = document.createElement("div");
      querySnapshot.forEach(async function (docSnap, index) {
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
        const card = newcard.querySelector(".card");
        bookmarkBtn.dataset.articleId = docSnap.id;
        card.dataset.articleId = docSnap.id;
        //checks if the user already has the bookmark in the database
        const bookmarkRef = doc(db, "users", user.uid, "bookmarks", docSnap.id);
        const bookmarkSnapshot = await getDoc(bookmarkRef);

        if (bookmarkSnapshot.exists()) {
          bookmarkBtn.classList.add("clicked");
        }
        const thumbsUpBtn = newcard.querySelector(".thumbsUpBtn");
        const thumbsDownBtn = newcard.querySelector(".thumbsDownBtn");
        const ratingRef = doc(db, "articles", docSnap.id, "ratings", user.uid);
        const ratingSnapShot = await getDoc(ratingRef);

        // checks if user already has a raiting for the article
        if (ratingSnapShot.exists()) {
          const ratingData = ratingSnapShot.data();
          if (ratingData.rating == 1) {
            thumbsUpBtn.classList.add("clicked");
          } else if (ratingData.rating == -1) {
            thumbsDownBtn.classList.add("clicked");
          }
        }
        const parentRatingRef = doc(db, "articles", docSnap.id);
        const queryRatingRef = collection(parentRatingRef, "ratings");
        const upVoteQuery = query(queryRatingRef, where("rating", "==", 1));
        const downVoteQuery = query(queryRatingRef, where("rating", "==", -1));
        const upVotesSnap = await getCountFromServer(upVoteQuery);
        const downVotesSnap = await getCountFromServer(downVoteQuery);
        newcard.querySelector(".upVote").textContent = upVotesSnap.data().count;
        newcard.querySelector(".downVote").textContent =
          downVotesSnap.data().count;

        newArticles.appendChild(newcard);
        document.getElementById("articles_go_here").innerHTML =
          newArticles.innerHTML;
      });
    } catch (error) {
      console.error("error getting documents", error);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  addBookmark();
  addRating();
});

addFilterButton();
displayArticleCardsDynamically(true);

document
  .getElementById("filter-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    displayArticleCardsDynamically(false);
  });
