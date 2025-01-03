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
        // Validate input
        if (!wishData || typeof wishData !== 'object') {
            return { "error": 1, "message": "Invalid wish data" };
        }

        // Generate unique ID with retry limit
        let id, snapshot;
        let attempts = 0;
        const maxAttempts = 10;
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        do {
            if (attempts >= maxAttempts) {
                throw new Error("Failed to generate unique ID after multiple attempts");
            }
            id = '';
            for (let i = 0; i < 6; i++) {
                id += chars[Math.floor(Math.random() * chars.length)];
            }
            snapshot = await get(ref(db, id));
            attempts++;
        } while (snapshot.exists());

        // Create new wish object with validation
        const wish = {
            id,
            time: new Date().toLocaleString('vi-VN'), // Use Vietnamese locale
            ...wishData
        };

        // Validate required fields
        if (!wish.name || !wish.title || !wish.content) {
            return { "error": 1, "message": "Missing required fields" };
        }

        // Save to Firebase with error handling
        try {
            await set(ref(db, id), wish);
        } catch (dbError) {
            throw new Error(`Failed to save to database: ${dbError.message}`);
        }

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