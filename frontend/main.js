// main.js

// ==============================
// Firebase imports (existing)
import { db } from "./firebase-config.js";  // Firestore
import { collection, addDoc } from "firebase/firestore";
import { realtimeDb } from "./firebase-config.js";
import { ref, push } from "firebase/database";

// ==============================
// Backend Server IP
const BASE_URL = "http://159.89.164.156:5000";

// ==============================
// Read More / Read Less Toggle
function toggleReadMore(id, btn) {
  const content = document.getElementById(id);
  if (content.style.display === "block") {
    content.style.display = "none";
    btn.innerText = "Read More";
    btn.style.color = "#007BFF";
  } else {
    content.style.display = "block";
    btn.innerText = "Read Less";
    btn.style.color = "#28a745";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const readMoreBtns = document.querySelectorAll('.read-more');

  readMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      const content = card.querySelector('.more-content');

      if(card.classList.contains('expanded')){
        card.classList.remove('expanded');
        btn.textContent = "Read More";
      } else {
        card.classList.add('expanded');
        btn.textContent = "Read Less";
      }
    });
  });
});

// ==============================
// Contact Form Submit
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
      const response = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        contactForm.reset();
      } else {
        alert(data.message || "Error submitting form");
      }
    } catch (err) {
      console.error(err);
      alert("Server not reachable. Try again later.");
    }
  });
}

// ==============================
// Register Form Submit
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        registerForm.reset();
      } else {
        alert(data.message || "Error registering user");
      }
    } catch (err) {
      console.error(err);
      alert("Server not reachable. Try again later.");
    }
  });
}

// ==============================
// Login Form Submit
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        localStorage.setItem("token", data.token);
        loginForm.reset();
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Server not reachable. Try again later.");
    }
  });
}

// ==============================
// Firebase Test: Firestore
async function addTestData() {
  try {
    const docRef = await addDoc(collection(db, "test"), { message: "Hello Firebase!" });
    console.log("Document added with ID:", docRef.id);
  } catch (e) {
    console.error("Error adding document:", e);
  }
}
addTestData();

// ==============================
// Firebase Realtime Database
const saveButton = document.getElementById("saveButton");
if (saveButton) {
  saveButton.addEventListener("click", async () => {
    console.log("hii");
    try {
      const namesRef = ref(realtimeDb, "names");
      await push(namesRef, { name: "Megha" });
      console.log("Name Megha saved to Firebase!");
    } catch (error) {
      console.error("Error saving name:", error);
    }
  });
}
