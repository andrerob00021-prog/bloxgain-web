const express = require('express');
const Database = require('better-sqlite3');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new Database('bloxgain.db');

app.use(bodyParser.json());
app.use(express.static('.'));

db.exec('CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, coins INTEGER DEFAULT 0)');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/balance/:userId', (req, res) => {
    const row = db.prepare('SELECT coins FROM users WHERE id = ?').get(req.params.userId);
    res.json({ coins: row ? row.coins : 0 });
});

app.post('/add-coins', (req, res) => {
    const { userId, amount } = req.body;
    db.prepare('INSERT OR IGNORE INTO users (id, coins) VALUES (?, 0)').run(userId);
    db.prepare('UPDATE users SET coins = coins + ? WHERE id = ?').run(amount, userId);
    res.json({ success: true });
});

app.listen(3000, () => console.log('✅ Blox Gain ON: http://localhost:3000'));
