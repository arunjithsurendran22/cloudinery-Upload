const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const ejs = require("ejs");
const multer = require("multer");
const Image = require("./models/images");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes
const imageController = require("./controllers/imageController");
app.get("/", imageController.getImages);
app.post("/upload", multer().single("image"), imageController.uploadImage);
app.post("/delete/:id", imageController.deleteImage);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
