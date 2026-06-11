# SoundSearch

A university web application for music discovery and playlist curation for campus radio stations. Built as a class project integrating the iTunes Search API and Firebase.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?logo=firebase&logoColor=white)
![iTunes API](https://img.shields.io/badge/API-iTunes%20Search-black?logo=apple&logoColor=white)

---

## About

**SoundSearch** is a university music discovery platform designed to help curate content for a campus radio station. Students search the iTunes catalog, build playlists, and submit suggestions directly to the radio coordination team, which can view all submissions in real time via Firebase Firestore.

---

## Features

- **Search songs, albums, and artists** via the iTunes Search API
- **Filters** by content type and explicit content rating
- **Audio preview** playback inline within search results
- **Details modal** with full item information (genre, duration, price, etc.)
- **Personal playlist** — add and remove items during the session
- **Track flagging** to mark songs for radio suggestion
- **Suggestion form** with field validation (full name, student ID, academic email, justification)
- **Firebase Firestore submission** — data saved to the cloud in real time
- **Submission history** — view all entries ordered by date
- **Responsive layout** with mobile tab navigation between results and playlist

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES Modules) |
| Icons | Font Awesome 6 |
| Music API | [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/) |
| Database | Firebase Firestore (cloud NoSQL) |

---

## Running Locally

This is a pure front-end project — no dependencies to install.

1. Clone the repository:
   ```bash
   git clone https://github.com/Erlandsonjr/SoundSearch
   cd SoundSearch
   ```

2. Open `index.html` in your browser, **or** use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code to serve it locally.

> **About the Firebase config:** The Firebase client config in `app.js` is public by design — it is embedded in every Firebase web app and sent to each visitor's browser. Security is enforced through **Firebase Security Rules** in the project console, not by keeping this config secret.

---

## File Structure

```
SoundSearch/
├── index.html      # HTML structure, modals and suggestion form
├── style.css       # Styles and responsive layout
├── api.js          # iTunes Search API call
├── playlist.js     # Playlist state and persistence (localStorage)
└── app.js          # Core logic, Firebase integration and DOM handling
```

---

## Academic Context

Built as a **Web Development** course assignment, focusing on third-party API integration, cloud storage, and responsive UI design.
