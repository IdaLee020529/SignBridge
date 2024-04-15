require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const filestore = require('session-file-store')(session);
const { MongoClient } = require('mongodb');
const { sendEmail, mailTemplate } = require("./utils/email");
const jwt = require('jsonwebtoken');
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

// ------------------------------------------------------------------------------------------------------------

// ---------- For the preset accounts (Sign Expert, Admin) ----------
// async function insertPresetAccounts() {
//   try {
//     await client.connect();
//     console.log("Connected to MongoDB");

//     const collection = database.collection("users");

//     // Check if preset accounts already exist
//     const existingAccounts = await collection
//       .find({ $or: [{ username: "admin" }, { username: "signexpert" }] })
//       .toArray();
//     if (existingAccounts.length === 0) {
//       // Define preset account data
//       const presetAccounts = [
//         {
//           username: "admin",
//           email: "admin@gmail.com",
//           password: "123456",
//           picture: "./images/profile-img.png",
//           acc_type: "traditional",
//           role_access: "admin",
//         },
//         {
//           username: "signexpert",
//           email: "signexpert@gmail.com",
//           password: "123456",
//           picture: "./images/profile-img.png",
//           acc_type: "traditional",
//           role_access: "signexpert",
//         },
//       ];

//       // Insert preset accounts into the collection
//       const result = await collection.insertMany(presetAccounts);
//       console.log(`${result.insertedCount} preset accounts inserted`);
//     } else {
//       console.log("Preset accounts already exist");
//     }
//   } catch (error) {
//     console.error("Error inserting preset accounts:", error);
//   }
// }

// insertPresetAccounts().catch(console.error);

// ---------- For the sign up (Google Auth) ----------
app.post("/users-google-auth", async (req, res) => {
  try {

    const collection = database.collection("users");
    const existingUser = await collection.findOne({ email: req.body.email });

    if (existingUser) {
      return res.json({ message: "User already exists" }); // Return a success response indicating user exists
    }

    const document = {
      username: req.body.name,
      email: req.body.email,
      picture: req.body.picture,
      given_name: req.body.given_name,
      family_name: req.body.family_name,
      locale: req.body.locale,
      acc_type: "google",
      role_access: "public",
    };
    const result = await collection.insertOne(document);
    res.json({ message: "New user created" });
  } catch (error) {
    console.error("Error creating new user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------- For the sign up (Traditional Auth) ----------
app.post("/users-sign-up-auth", async (req, res) => {
  try {
    const collection = database.collection("users");
    const existingUser = await collection.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, { expiresIn: "1h", }); // Generate verification token

    const mailOption = {
      email: req.body.email,
      subject: "Verify Email Address",
      message: mailTemplate(
        "Thank you for signing up for our service! To complete your registration and start using our platform, please verify your email address by clicking the button below.",
        `${process.env.BACKEND_URL}/verify-email?token=${token}`,
        "Verify Email"
      ),
    };
    await sendEmail(mailOption);

    const document = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      picture: "./images/profile-img.png",
      acc_type: "traditional",
      role_access: "public",
      email_verified: false, // Add a field to track email verification status
      verification_token: token, // Store verification token in the database
    };
    const result = await collection.insertOne(document);
    res.json({
      message:
        "Verification email sent. Please verify your email to complete registration.",
    });
  } catch (error) {
    console.error("Error creating new user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------- For the email verification ----------
app.get("/verify-email", async (req, res) => {
  try {
    const token = req.query.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const collection = database.collection("users");
    const user = await collection.findOneAndUpdate(
      { email: decoded.email },
      { $set: { email_verified: true }, $unset: { verification_token: "" } }
    );

    if (user.email === decoded.email) {
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    } else {
      res.status(400).send("Invalid or expired token"); // Token is invalid or expired
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------- For the login (Traditional Auth) ----------
app.post("/users-login-auth", async (req, res) => {
  try {
    const collection = database.collection("users");
    const user = await collection.findOne({ email: req.body.email });

    const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    }); // Generate verification token

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Check if the password matches
    if (user.password !== req.body.password) {
      return res.status(401).json({ error: "Incorrect password" });
    } else if (user.email_verified === false) {
      return res.status(403).json({ error: "Email not verified" });
    }

    req.session.isLoggedIn = true;
    req.session.username = user.username;
    req.session.role_access = user.role_access;
    req.session.picture = user.picture;
    return res.json({
      Login: true,
      username: req.session.username,
      role_access: req.session.role_access,
      picture: req.session.picture,
      token: token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------- For the forgot password ----------
app.post("/forgot-password", async (req, res) => {
  try {
    const collection = database.collection("users");
    const email = await collection.findOne({ email: req.body.email });

    if (!email) {
      return res.status(400).json({ error: "Email not found" }); // Return 404 Not Found if email is not found
    }

    const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const mailOption = {
      email: email.email,
      subject: "Forgot Password Link",
      message: mailTemplate(
        "We have received a request to reset your password. Please reset your password by clicking on the button below.",
        `${process.env.FRONTEND_URL}/reset-password?token=${token}`,
        "Reset Password"
      ),
    };
    await sendEmail(mailOption);

    res.json({
      message: "Verification email sent. Please verify your email to reset password.",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------- For the reset password ----------
app.post("/reset-password", async (req, res) => {
  try {
    const token = req.body.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const collection = database.collection("users");
    const user = await collection.findOne({ email: decoded.email });

    if (!user || user.email !== decoded.email) {
      return res.status(400).send("Invalid or expired token");
    }

    await collection.updateOne({ email: decoded.email }, { $set: { password: req.body.password } });
    res.json({ status: 200, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------- For the session ----------
app.get("/", (req, res) => {
  if (req.session.user) {
    // Send back a JSON response indicating the user is logged in
    res.json({ valid: true, user: req.session.user });
  } else {
    // Send back a JSON response indicating the user is not logged in
    res.json({ valid: false });
  }
});

// app.get("/users", async (req, res) => {
//   try {
//     const collection = database.collection("users");
//     const users = await collection.find().toArray(); // Find all users and convert to array

//     return res.json(users); // Send the array of user objects as a JSON response
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

const UserController = require("./controllers/UserController")
  app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
  UserController.insertPresetAccounts();
});