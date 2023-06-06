const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const url = process.env.ATLAS_URI;
global.URL = url;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const options = { serverSelectionTimeoutMS: 30000 };

mongoose.connect(url, { 
    useNewUrlParser: true,  
    useUnifiedTopology: true,
    ...options,
});
const connection = mongoose.connection;

connection.once('open',()=>{
    console.log("MongoDB connection successfully.");
});

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(session({
  secret: 'mysecretkey',
  cookie:{maxAge:60000},
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.ATLAS_URI })
}));

app.use(express.json());

const food_recipe = require('./routes/food_recipe.js');
app.use('/food_recipe', food_recipe);


const member = require('./routes/member.js');
app.use('/member', member);

// Configure Multer for file upload
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'uploads',
      allowedFormats: ['jpg', 'jpeg', 'png'],
      maxFileSize: 10 * 1024 * 1024 // 10MB (Specify the maximum file size in bytes)
    }
  });
  

const upload = multer({ storage: storage });

// Route to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    // Access the uploaded file details
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // File upload successful
    res.status(200).json({ message: 'File uploaded successfully' , fileName: file.filename });
});

app.listen(port,() =>{
    console.log(`Server is running on port: ${port}`);
});
