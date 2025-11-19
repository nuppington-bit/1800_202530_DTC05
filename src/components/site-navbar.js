// Import specific functions from the Firebase Auth SDK
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "/src/firebaseConfig.js";
import { logoutUser } from "/src/authentication.js";

class SiteNavbar extends HTMLElement {
    constructor() {
        super();
        this.renderNavbar();
        this.renderAuthControls();
    }

    renderNavbar() {
        this.innerHTML = `
            <header>
                <nav class="navbar navbar-expand-md navbar-dark">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="/">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#E8E9F0">
                                <path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q97-30 162-118.5T718-480H480v-315l-240 90v207q0 7 2 18h238v316Z" />
                            </svg>
                            WebSafe
                        </a>
                        <div class="d-flex gap-4">
                        <div id="mobileAuthControls" class="auth-controls d-flex align-items-center gap-2 my-2 my-lg-0">
                            <!-- populated by JS -->
                        </div>
                        <button class="navbar-toggler" type="button" id="navbarToggleButton" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        </div>
                        <div class="collapse navbar-collapse flex-grow-0" id="navbarSupportedContent">
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <a class="nav-link show-underline-hover" href="/">Home</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link show-underline-hover" href="/main.html">Articles</a>
                                </li>
                            </ul>
                            <div id="authControls" class="auth-controls d-flex align-items-center gap-2 my-2 my-lg-0">
                                <!-- populated by JS -->
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        `;
    }

    // -------------------------------------------------------------
    // Renders the authentication controls (login/logout) based on user state
    // Uses Firebase Auth's onAuthStateChanged to listen for changes
    // and updates the navbar accordingly.
    // Also adds a "Profile" link when the user is logged in.
    // This keeps the navbar in sync with the user's authentication status.
    // -------------------------------------------------------------
    renderAuthControls() {
        const authControls = this.querySelector("#authControls");
        const mobileAuthControls = this.querySelector("#mobileAuthControls");
        const navList = this.querySelector("ul"); // your main nav <ul>

        // invisible placeholder to maintain layout
        authControls.innerHTML = `<div class="btn btn-outline-light" style="visibility: hidden; min-width: 80px;">Log out</div>`;
        mobileAuthControls.innerHTML = `<div class="btn btn-outline-light" style="visibility: hidden; min-width: 80px;">Log out</div>`;

        onAuthStateChanged(auth, (user) => {
            let updatedAuthControl;
            let updatedMobileAuthControl;

            // Remove existing "Profile" link if present (avoid duplicates)
            const existingProfile = navList?.querySelector("#profileLink");
            const existingKnowledgeLink = navList?.querySelector("#knowledgeLink");
            if (existingProfile) existingProfile.remove();
            if (existingKnowledgeLink) existingKnowledgeLink.remove();

            if (user) {
                // 1️⃣ Add Profile item to menu
                if (navList) {
                    const profileItem = document.createElement("li");
                    const knowledgeItem = document.createElement("li");
                    profileItem.classList.add("nav-item");
                    knowledgeItem.classList.add("nav-item");
                    profileItem.innerHTML = `<a class="nav-link show-underline-hover" id="profileLink" href="/profile.html">Profile</a>`;
                    knowledgeItem.innerHTML = `<a class="nav-link show-underline-hover" id="knowledgeLink" href="/final-knowledge-level-test.html">Knowledge Test</a>`;
                    navList.appendChild(profileItem);
                    navList.appendChild(knowledgeItem);
                }

                // 2️⃣ Show logout button
                updatedAuthControl = `<button class="btn btn-outline-light d-none d-md-inline-block text-nowrap min-w-fit" id="signOutBtn" type="button">Log out</button>`;
                updatedMobileAuthControl = `<button class="btn btn-outline-light d-md-none text-nowrap min-w-fit" id="signOutBtn" type="button">Log out</button>`;
                authControls.innerHTML = updatedAuthControl;
                mobileAuthControls.innerHTML = updatedMobileAuthControl;

                const signOutBtn = authControls.querySelector("#signOutBtn");
                signOutBtn?.addEventListener("click", logoutUser);
            } else {
                // Remove Profile if user logs out
                if (existingProfile) existingProfile.remove();

                // Show login button
                updatedAuthControl = `<a class="btn btn-outline-light d-none d-md-inline-block text-nowrap min-w-fit" id="loginBtn" href="/login.html">Log in</a>`;
                authControls.innerHTML = updatedAuthControl;
                updatedMobileAuthControl = `<a class="btn btn-outline-light d-md-none text-nowrap min-w-fit" id="loginBtn" href="/login.html">Log in</a>`;
                mobileAuthControls.innerHTML = updatedMobileAuthControl;
            }
        });
    }
}

customElements.define("site-navbar", SiteNavbar);

