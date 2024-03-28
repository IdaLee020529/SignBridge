const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Session and Cookies
const session = require("express-session"); 
const cookieParser = require("cookie-parser");
const filestore = require("session-file-store")(session); 
const path = require("path"); 

const { v4: uuidv4 } = require('uuid');

app.use(cors(
    {
        origin: "http://localhost:5173",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true
    }
));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    name: "session-id",
    secret: "secret-key",
    saveUninitialized: false,
    resave: false,
    store: new filestore({ path: path.join(__dirname, 'sessions') }),
    cookie: {
        secure: false, // Set to true in production
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}))

const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'SignBridge';

const client = new MongoClient(url);

// ---------- For the preset accounts (Sign Expert, Admin) ----------
async function insertPresetAccounts() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db(dbName);
        const collection = database.collection('users');

        // Check if preset accounts already exist
        const existingAccounts = await collection.find({ $or: [{ username: 'admin' }, { username: 'signexpert' }] }).toArray();
        if (existingAccounts.length === 0) {
            // Define preset account data
            const presetAccounts = [
                { username: 'admin', email: 'admin@gmail.com', password: '123456', picture: "./images/profile-img.png", acc_type: "traditional", role_access: "admin" },
                { username: 'signexpert', email: 'signexpert@gmail.com', password: '123456', picture: "./images/profile-img.png", acc_type: "traditional", role_access: "signexpert" },
            ];

            // Insert preset accounts into the collection
            const result = await collection.insertMany(presetAccounts);
            console.log(`${result.insertedCount} preset accounts inserted`);
        } else {
            console.log('Preset accounts already exist');
        }

    } catch (error) {
        console.error('Error inserting preset accounts:', error);
    } 
}

insertPresetAccounts().catch(console.error);

// ---------- For the sign up (Google Auth) ---------- 
app.post('/users-google-auth', async (req, res) => {
    try {
        const database = client.db(dbName);
        const collection = database.collection('users');
        const existingUser = await collection.findOne({ email: req.body.email });
  
        if (existingUser) {
            return res.json({ message: 'User already exists' }); // Return a success response indicating user exists
        }
  
        const document = {
            username: req.body.name,
            email: req.body.email,
            picture: req.body.picture,
            given_name: req.body.given_name,
            family_name: req.body.family_name,
            locale: req.body.locale,
            acc_type: "google",
            role_access: "public"
        }
        const result = await collection.insertOne(document);
        res.json({ message: 'New user created' });
    } catch (error) {
        console.error('Error creating new user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ---------- For the sign up (Traditional Auth) ---------- 
app.post('/users-sign-up-auth', async (req, res) => {
    try {
        const database = client.db(dbName);
        const collection = database.collection('users');
        const existingUser = await collection.findOne({ email: req.body.email });
  
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
  
        const document = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            picture: "./images/profile-img.png",
            acc_type: "traditional",
            role_access: "public"
        }
        const result = await collection.insertOne(document);
        res.json({ message: 'New user created' });
    } catch (error) {
        console.error('Error creating new user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ---------- For the login (Traditional Auth) ----------
app.post('/users-login-auth', async (req, res) => {
    try {
        const database = client.db(dbName);
        const collection = database.collection('users');
        const user = await collection.findOne({ email: req.body.email });
        const token = uuidv4(); // Generate UUID

        // Check if the user exists
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Check if the password matches
        if (user.password !== req.body.password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        req.session.isLoggedIn = true;  
        req.session.username = user.username;
        req.session.role_access = user.role_access;
        req.session.picture = user.picture;
        return res.json({Login: true, username: req.session.username, role_access: req.session.role_access, picture: req.session.picture});

    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ---------- For the session ----------
app.get('/', (req, res) => {
    if (req.session.user) {
      // Send back a JSON response indicating the user is logged in
      res.json({ valid: true, user: req.session.user });
    } else {
      // Send back a JSON response indicating the user is not logged in
      res.json({ valid: false });
    }
});


app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});