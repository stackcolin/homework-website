const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    console.log("Filling up database with dummy data...");

    // clear out any existing data to start completely fresh
    db.run("DELETE FROM visited_countries");
    db.run("DELETE FROM users");

    // insert Test Users
    const insertUser = db.prepare("INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)");
    insertUser.run(1, "colin@test.com", "password123");
    insertUser.run(2, "rohini@test.com", "rohiniisawesome");
    insertUser.run(3, "adam@test.com", "adamspassword");
    insertUser.finalize();

    // insert Visited Countries linked to those specific User IDs
    const insertCountry = db.prepare("INSERT INTO visited_countries (user_id, country_name, date_visited, notes) VALUES (?, ?, ?, ?)");
    
    // colins trips
    insertCountry.run(1, "Japan", "2024-03-15", "Loved Tokyo! Food was incredible.");
    insertCountry.run(1, "Italy", "2025-07-22", "Explored Rome and the Amalfi coast.");
    
    // rohinis trips
    insertCountry.run(2, "Canada", "2023-11-02", "Very cold but the mountains were beautiful.");
    insertCountry.run(2, "France", "2026-05-10", "Saw the Eiffel Tower.");

    // adams trips
    insertCountry.run(3, "Brazil", "2025-02-20", "Went to Rio for Carnival!");

    insertCountry.finalize();
    console.log("Database populated with 3 users and 5 countries!");
});

db.close();