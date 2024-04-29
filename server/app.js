require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const filestore = require('session-file-store')(session);
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const dbName = process.env.DATABASE_NAME || 'SignBridge';
const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const client = new MongoClient(dbUrl);
const database = client.db(dbName);

// Middleware
app.use(cors({
  origin: `http://localhost:${process.env.FRONTEND_PORT || 5173}`,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  name: 'session-id',
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  store: new filestore({ path: path.join(__dirname, 'sessions') }),
  cookie: {
    secure: false, // Set to true in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
}));

// -------------------Newly Added Working According to Folder Structure----------------------------------------
const userRoutes = require("./routes/UserRoutes")
app.use(userRoutes);

const feedbackRoutes = require("./routes/FeedbackRoutes")
app.use(feedbackRoutes);

const faqRoutes = require("./routes/FaqRoutes")
app.use(faqRoutes);

// ------------------------------------------------------------------------------------------------------------
const UserController = require("./controllers/UserController")
const FaqController = require("./controllers/FaqController")
  app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
  UserController.insertPresetAccounts();
  FaqController.insertFixFaq();
});