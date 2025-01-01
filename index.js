const express = require("express");
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

// Routes
// API
app.post("/api/v1/saveData", express.json(), async (req, res) => {
  try {
    // Kiểm tra header API key
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({
        error: 1,
        message: "Unauthorized - Invalid API key"
      });
    }

    // Giới hạn kích thước request body
    if (req.headers['content-length'] > 1024 * 1024) { // Giới hạn 1MB
      return res.status(413).json({
        error: 1,
        message: "Request entity too large"
      });
    }

    const { name, title, content, image } = req.body;
    
    // Validate input
    if (!name || !title || !content || !image) {
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

    // Validate định dạng image base64
    if (!image.match(/^data:image\/(png|jpg|jpeg);base64,/)) {
      return res.status(400).json({
        error: 1,
        message: "Định dạng ảnh không hợp lệ"
      });
    }

    const result = await saveData({ name, title, content, image });
    
    if (result.error !== 0) {
      return res.status(500).json(result);
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
    // Kiểm tra header API key
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({
        error: 1,
        message: "Unauthorized - Invalid API key" 
      });
    }

    // Validate ID parameter
    const id = req.params.id;
    if (!id || !/^\d{5}$/.test(id)) {
      return res.status(400).json({
        error: 1,
        message: "Invalid ID format"
      });
    }

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
    else return res.status(200).render("index", { data: wishData.data })
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
      return res.status(200).render("intro", { data: wishData.data });
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