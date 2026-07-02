const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Tell Express to serve the index.html file when someone visits the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Express server running on port ${port}`);
});