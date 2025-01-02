const express = require("express");
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const { saveData, getData } = require('./database')
require('dotenv').config();

// Config app
const app = express();
const port = 3000;
const api_key = process.env.API_KEY || "key_is_tho493"

// Middleware
app.use(express.static('view'))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/view')
app.use(fileUpload());

// Upload to Cloudinary for persistent storage
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Routes
// API
app.post("/api/v1/saveData", async (req, res) => {
  try {
    // Kiểm tra header API key
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({
        error: 1,
        message: "Unauthorized - Invalid API key"
      });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        error: 1,
        message: "Thiếu file hình ảnh"
      });
    }

    const { name, title, content } = req.body;
    const imageFile = req.files.image;

    // Validate input
    if (!name || !title || !content) {
      return res.status(400).json({
        error: 1,
        message: "Thiếu thông tin cần thiết"
      });
    }

    // Validate độ dài input
    if (name.length > 100 || title.length > 200 || content.length > 1000) {
      return res.status(400).json({
        error: 1,
        message: "Độ dài nội dung vượt quá giới hạn cho phép"
      });
    }

    // Validate image file
    if (!imageFile.mimetype.startsWith('image/')) {
      return res.status(400).json({
        error: 1,
        message: "File không phải là hình ảnh"
      });
    }

    // Tạo tên file ngẫu nhiên
    // const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(imageFile.name);

    // Upload file buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'uploads' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(imageFile.data);
    });

    // Lưu đường dẫn của ảnh
    const imageToSave = uploadResult.secure_url;
    
    const result = await saveData({ name, title, content, image: imageToSave });
    
    if (result.error !== 0) {
      // Xóa ảnh nếu lỗi
      await cloudinary.uploader.destroy(uploadResult.public_id);
      return res.status(400).json(result);
    }

    return res.status(200).json({
      error: 0,
      id: result.id
    });

  } catch (error) {
    return res.status(500).json({
      error: 1,
      message: error.message
    });
  }
});


app.get("/api/v1/getData/:id", async (req, res) => {
  try {
    // Check API key
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({
        error: 1,
        message: "Unauthorized - Invalid API key" 
      });
    }

    const id = req.params.id;
    const result = await getData(id);

    if (result.error !== 0) {
      return res.status(404).json(result);
    }

    return res.status(200).json({
      error: 0,
      data: result.data
    });

  } catch (error) {
    return res.status(500).json({
      error: 1, 
      message: error.message
    });
  }
});

// WEB
app.get("/", (req, res) => {
  res.status(200).render("home", { api_key });
})

app.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const wishData =  await getData(id);
    if (wishData.error != 0) {
      return res.status(404).render("error", {"warning_number": 404, "warning_message": wishData.message });
    }
    else return res.status(200).render(`countdown/01/index`, { data: wishData.data })
  } catch (error) {
    return res.status(500).render("error", {"warning_number": 500, "warning_message": error });
  }
});

app.get("/hny/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const wishData = await getData(id);
    if (wishData.error != 0) {
      return res.status(404).render("error", {"warning_number": 404, "warning_message": wishData.message });
    }
    else {
      const themeId = wishData.data.theme_id || "02";
      return res.status(200).render(`theme/${themeId}/index`, { data: wishData.data });
    }
  } catch (error) {
    return res.status(500).render("error", {"warning_number": 500, "warning_message": error });
  }
});

app.use((req, res, next) => {
  res.status(404).render("error", {"warning_number": 404, "warning_message": "Trang bạn truy cập không tồn tại"});
});

const listener = app.listen(process.env.PORT || port, () =>
  console.log(`Đã mở tại port: http://localhost:${listener.address().port}`)
);