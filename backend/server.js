// server.js - Firebase-only backend (CommonJS)

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

// Firebase Admin SDK
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://digitalmarketingwebsite-cf2de-default-rtdb.firebaseio.com"
});


const db = admin.firestore();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to Digital Marketing Backend API (Firebase)!");
});

// ==============================
// Contact API
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const docRef = await db.collection("contacts").add({
      name,
      email,
      message,
      createdAt: new Date()
    });
    res.json({ message: "Your message has been recorded. Thank you!", id: docRef.id });
  } catch (err) {
    res.status(500).json({ message: "Firebase error", error: err.message });
  }
});

// ==============================
// Register API
// ==============================
// Register API
// ==============================
// Register API
// ==============================
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email already exists in Firestore
    const snapshot = await db.collection("users").where("email", "==", email).get();
    if (!snapshot.empty) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    // Password ko hash karna (for login matching)
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Firestore me store karna
    await db.collection("users").doc(userRecord.uid).set({
      name,
      email,
      password: hashedPassword,   // 👈 IMPORTANT
      createdAt: new Date().toISOString()
    });

    res.status(200).json({ 
      message: "User registered successfully",
      uid: userRecord.uid 
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Firebase error", error: err.message });
  }
});


// ==============================
// Login API
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const snapshot = await db.collection("users").where("email", "==", email).get();
    if (snapshot.empty) return res.status(400).json({ message: "Invalid credentials" });

    let userData;
    snapshot.forEach(doc => {
      userData = { id: doc.id, ...doc.data() };
    });

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: userData.id, email: userData.email }, JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Firebase error", error: err.message });
  }
});

// ==============================
// Get all messages
app.get("/api/messages", async (req, res) => {
  try {
    const snapshot = await db.collection("contacts").orderBy("createdAt", "desc").get();
    const messages = [];
    snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Firebase error", error: err.message });
  }
});

// ==============================
// Delete a message
app.delete("/api/messages/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection("contacts").doc(id).delete();
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Firebase error", error: err.message });
  }
});

// ==============================
// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const snapshot = await db.collection("users").orderBy("createdAt", "desc").get();
    const users = [];
    snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Firebase error", error: err.message });
  }
});

// Serve static files
app.use(express.static(path.join(path.resolve(), "public")));

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
