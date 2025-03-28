const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Read passes from db.json
async function readPasses() {
    try {
        const data = await fs.readFile(path.join(__dirname, 'db.json'), 'utf8');
        return JSON.parse(data).passes || [];
    } catch (error) {
        console.error('Error reading passes:', error);
        return [];
    }
}

// Write passes to db.json
async function writePasses(passes) {
    try {
        await fs.writeFile(
            path.join(__dirname, 'db.json'),
            JSON.stringify({ passes }, null, 2),
            'utf8'
        );
    } catch (error) {
        console.error('Error writing passes:', error);
        throw error;
    }
}

// Get all passes
app.get('/api/passes', async (req, res) => {
    try {
        const passes = await readPasses();
        res.json(passes);
    } catch (error) {
        console.error('Error getting passes:', error);
        res.status(500).json({ error: 'Error reading passes' });
    }
});

// Create a new pass
app.post('/api/passes', async (req, res) => {
    try {
        const passes = await readPasses();
        const newPass = {
            id: Math.random().toString(36).substr(2, 4),
            ...req.body,
            timestamp: new Date().toLocaleString()
        };
        passes.push(newPass);
        await writePasses(passes);
        res.status(201).json(newPass);
    } catch (error) {
        console.error('Error creating pass:', error);
        res.status(500).json({ error: 'Error creating pass' });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
