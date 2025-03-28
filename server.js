const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Read passes from db.json
function readPasses() {
    const data = fs.readFileSync('db.json');
    return JSON.parse(data).passes;
}

// Write passes to db.json
function writePasses(passes) {
    fs.writeFileSync('db.json', JSON.stringify({ passes }, null, 2));
}

// Get all passes
app.get('/api/passes', (req, res) => {
    try {
        const passes = readPasses();
        res.json(passes);
    } catch (error) {
        res.status(500).json({ error: 'Error reading passes' });
    }
});

// Create a new pass
app.post('/api/passes', (req, res) => {
    try {
        const passes = readPasses();
        const newPass = {
            id: Math.random().toString(36).substr(2, 4),
            ...req.body,
            timestamp: new Date().toLocaleString()
        };
        passes.push(newPass);
        writePasses(passes);
        res.status(201).json(newPass);
    } catch (error) {
        res.status(500).json({ error: 'Error creating pass' });
    }
});

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
