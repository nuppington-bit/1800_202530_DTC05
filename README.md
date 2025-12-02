# WebSafe


## Overview
Our team, DTC05, has developed an informational web security app called WebSafe to help anyone with an online footprint stay updated and informed on ways to keep their information secure online by testing the users knowledge of online security and recommending actionable steps and practices based on their results.

Developed for the COMP 1800 course, this project applies User-Centred Design practices and agile project management, and demonstrates integration with Firebase backend services for storing user bookmarks and likes / dislikes.

---


## Features

- Take a knowledge level test to get recommended articles
- Browse a list of curated articles
- Bookmark or unbookmark articles
- Like or dislike articles
- View a list of bookmarked artices
- Responsive design for desktop and mobile

---


## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend**: Firebase for hosting
- **Database**: Firestore

---


## Usage
1. Run `npm run dev` in the root of the project.
2. Open your browser and visit `http://localhost:5173`.
3. Sign up and take the knowledge test.
4. Scroll through the articles and like / dislike or bookmark them.

---


## Project Structure

```
1800_202530_DTC05/
├── src/
│   ├── components/
│   │   └── site-navbar.js
│   ├── app.js
│   ├── authentication.js
│   ├── firebaseConfig.js
│   ├── index.js
│   ├── knowledgeTest.js
│   ├── loginSignup.js
│   ├── main.js
│   └── profile.js
├── styles/
│   ├── knowledgeStyle.css
│   └── style.css
├── .firebaserc
├── .gitignore
├── favicon.ico
├── knowledgeTest.html
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── index.html
├── login.html
├── main.html
├── package-lock.json
├── package.json
├── profile.html
├── README.md
└── vite.config.js
```

---


## Contributors
- **Allen Lu** - BCIT CST Student with a passion for outdoor adventures and user-friendly applications. Fun fact: Plays the piano
- **Voya Thomison** - BCIT CST Student with a passion for video games and user-friendly applications. Fun fact: Loves solving 5x5 Rubik's Cubes in waaaaay over a minute.
- **Gurkaren** - BCIT CST Student with a passion for outdoor adventures and Python. Fun fact: Loves playing video games.

---


## Acknowledgments

- All articles are owned by the site they link to.
- Code snippets were adapted from resources such as [Stack Overflow](https://stackoverflow.com/), [MDN Web Docs](https://developer.mozilla.org/) and [W3Schools](https://www.w3schools.com/).
- Icons sourced from [Google Material Icons](https://fonts.google.com/icons).

---


## Limitations and Future Work
### Limitations

- Accessibility features can be further improved.

### Future Work

- Implement article commenting.
- Add filtering and sorting options (e.g. rating, all knowledge level).
- Add a dark mode for better usability in low-light conditions.

---


## License

This project is licensed under the MIT License. See the LICENSE file for details.
