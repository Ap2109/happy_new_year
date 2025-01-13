const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get, set } = require("firebase/database");
const cloudinary = require('cloudinary').v2;
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

// Upload to Cloudinary for persistent storage
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function uploadImage(imageFile) {
  // Upload lên Cloudinary
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'uploads' }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(imageFile);
  });
}

async function deleteImage(publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}


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
            time: new Date().toLocaleString('vi-VN'),
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
            throw new Error(`Failed to save to firebase: ${dbError.message}`);
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

module.exports = { saveData, getData, uploadImage, deleteImage };