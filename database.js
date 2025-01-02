const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get, set } = require("firebase/database");
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain:  process.env.authDomain,
  databaseURL:  process.env.databaseURL,
  projectId:  process.env.projectId,
  storageBucket:  process.env.storageBucket,
  messagingSenderId:  process.env.messagingSenderId,
  appId:  process.env.appId,
  measurementId: process.env.measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function saveData(wishData) {
    try {
        const { image, title, content, name } = wishData;

        // Generate unique ID
        let id, snapshot;
        do {
            id = Math.floor(10000 + Math.random() * 90000).toString();
            snapshot = await get(ref(db, id));
        } while (snapshot.exists());

        // Create new wish object
        const wish = {
            id,
            time: new Date().toLocaleString(),
            image,
            title,
            content,
            name
        };

        // Save to Firebase
        await set(ref(db, id), wish);

        return { "error": 0, "id": wish.id };
    } catch (error) {
        return { "error": 1, "message": error.message };
    }
}

async function getData(id) {
    try {
        const snapshot = await get(ref(db, id));
        const wish = snapshot.val();

        if (!wish) {
            return { "error": 1, "message": "Bạn đang truy cập một lời chúc không tồn tại", "data": "" };
        }
        return { "error": 0, "message": "", "data": wish };
    } catch (error) {
        return { "error": 2, "message": error.message, "data": "" };
    }
}

module.exports = { saveData, getData };