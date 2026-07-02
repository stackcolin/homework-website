const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Connect to SQLite Database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Database connection failed:", err.message);
    else console.log("Connected to the SQLite database.");
});

// Hardcoded current user tracking (In a production app, you'd use sessions/cookies!)
let loggedInUserId = null;

// --- ROUTES ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'home.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'views', 'about.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));

// --- UPGRADED ROUTE 4: LOGIN VALIDATION ---
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Look up user in the database
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) {
            return res.send("Database error occurred.");
        }
        
        // Check if user exists and password matches
        if (user && user.password_hash === password) {
            loggedInUserId = user.id; // Save who logged in
            console.log(`User ${email} successfully logged in.`);
            res.redirect('/account');
        } else {
            res.send("<h2>Invalid email or password!</h2><a href='/login'>Try Again</a>");
        }
    });
});

// --- UPGRADED ROUTE 5: USER-SPECIFIC DATA FETCH ---
const fs = require('fs'); // Add this to the top of your server.js file

// ... (keep your database connection and other routes exactly the same)

// --- CLEAN ROUTE 5: ACCOUNT PAGE ---
app.get('/account', (req, res) => {
    if (!loggedInUserId) {
        return res.redirect('/login');
    }

    // 1. Fetch data from SQLite database
    db.all("SELECT * FROM visited_countries WHERE user_id = ?", [loggedInUserId], (err, countries) => {
        if (err) return res.status(500).send("Database error fetching data.");

        // 2. Build just the list items text string
        let countryListHtml = countries.map(c => 
            `<li><strong>${c.country_name}</strong> (${c.date_visited}) — <em>"${c.notes}"</em></li>`
        ).join('');
        
        if (countries.length === 0) {
            countryListHtml = "<li>No countries logged yet!</li>";
        }

        // 3. Read the pure HTML file from disk
        const accountPagePath = path.join(__dirname, 'views', 'account.html');
        fs.readFile(accountPagePath, 'utf8', (err, htmlContent) => {
            if (err) return res.status(500).send("Error loading dashboard layout.");

            // 4. Inject the data into the placeholder and send it!
            const finalizedPage = htmlContent.replace('{{TRAVEL_LIST}}', countryListHtml);
            res.send(finalizedPage);
        });
    });
});

// Simple logout handler
app.get('/logout', (req, res) => {
    loggedInUserId = null;
    res.redirect('/');
});

app.listen(port, '0.0.0.0', () => console.log(`Multi-route server active on port ${port}`));