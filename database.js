const axios = require('axios');
require('dotenv').config();

// JSONBin.io configuration
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
const BIN_ID = process.env.JSONBIN_BIN_ID;
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const headers = {
    'Content-Type': 'application/json',
    'X-Master-Key': JSONBIN_API_KEY
};

async function saveData(wishData) {
    try {
        const { image, title, content, name } = wishData;

        // Get current data
        const response = await axios.get(JSONBIN_URL, { headers });
        const data = response.data.record || [];

        let id, isIdExists;
        do {
            id = Math.floor(10000 + Math.random() * 90000).toString();
            isIdExists = data.some(item => item.id === id);
        } while (isIdExists);

        // Create new wish object
        const wish = {
            id,
            time: new Date().toLocaleString(),
            image,
            title,
            content,
            name
        };

        // Add new wish and update bin
        data.push(wish);
        await axios.put(JSONBIN_URL, data, { headers });

        return { "error": 0, "id": wish.id };
    } catch (error) {
        return { "error": 1, "message": error.message };
    }
}

async function getData(id) {
    try {
        const response = await axios.get(JSONBIN_URL, { headers });
        const data = response.data.record || [];
        const wish = data.find(g => g.id === id);

        if (!wish) {
            return { "error": 1, "message": "Bạn đang truy cập một lời chúc không tồn tại", "data": "" };
        }
        return { "error": 0, "message": "", "data": wish };
    } catch (error) {
        return { "error": 2, "message": error.message, "data": "" };
    }
}

module.exports = { saveData, getData };