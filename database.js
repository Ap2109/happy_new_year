const fs = require('fs').promises;
const path = require('path');

// Đường đẫn tới file data.json
const dataFile = path.join(__dirname, 'data.json');

// Khởi tạo file data nếu không tồn tại
const initDataFile = async () => {
    try {
        await fs.access(dataFile);
    } catch {
        await fs.writeFile(dataFile, JSON.stringify([]));
    }
};

async function saveData (wishData) {
     try {
        const { image, title, content, name } = wishData;
        
        await initDataFile();
        // Read data
        const fileContent = await fs.readFile(dataFile, 'utf8');
        const data = JSON.parse(fileContent);

        let id,  isIdExists;
        do {
            id = Math.floor(10000 + Math.random() * 90000).toString();
            isIdExists = data.some(item => item.id === id);
        } while (isIdExists);

        // Khởi tạo Wish object
        const wish = {
            id,
            time: new Date().toLocaleString(),
            image,
            title, 
            content,
            name
        };

        // Thêm dữ liệu
        data.push(wish);
        await fs.writeFile(dataFile, JSON.stringify(data, null, 2));

       return {"error": 0, "id": wish.id};
    } catch (error) {
        return {"error": 1, "message": error};
    }
}

async function getData (id){
    try {
        const fileContent = await fs.readFile(dataFile, 'utf8');
        const data = JSON.parse(fileContent);
        const wish = data.find(g => g.id === id);
        
        if (!wish) {
            return {"error": 1, "message": "Bạn đang truy cập một lời chúc không tồn tại", "data": ""};
        }
        return {"error": 0, "message": "", "data": wish}
    } catch (error) {
        return {"error": 2, "message": error, "data": ""};
    }
}

module.exports = { saveData, getData };