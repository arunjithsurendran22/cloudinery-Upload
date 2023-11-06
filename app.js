const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const session = require('express-session');
const Media = require('./models/Media');

require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store uploaded files in memory
const upload = multer({ storage: storage });

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
