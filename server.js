const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware to parse form data sent by the login page
app.use(express.urlencoded({ extended: true }));

// Connect to our SQLite database file
const db = path.join(__dirname, 'database.sqlite');
const database = new sqlite3.Database(db, (err) => {
    if (err) console.error("Database connection failed:", err.message);
    else console.log("Connected to the SQLite database.");
});

// --- ROUTE 1: HOME ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// --- ROUTE 2: ABOUT US ---
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// --- ROUTE 3: LOGIN (Display Page) ---
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// --- ROUTE 4: LOGIN (Processing Form Submission) ---
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt received for: ${email}`);
    // Right now, we will just redirect them straight to their account
    res.redirect('/account');
});

// --- ROUTE 5: ACCOUNT PAGE ---
app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'account.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Multi-route server active on port ${port}`);
});