const express = require('express');
const router = express.Router();
const db = require('../db');
const { sendInterval } = require('../services/arduino');

// Vrati interval
router.get('/interval', (req, res) => {
  db.get("SELECT vrednost FROM Podesavanja WHERE kljuc = 'interval'", [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ interval: row ? parseInt(row.vrednost) : null });
  });
});

// Promeni interval
router.put('/interval', (req, res) => {
  const { interval } = req.body;
  if (!interval) return res.status(400).json({ error: "Morate poslati interval" });

  db.run("UPDATE Podesavanja SET vrednost = ? WHERE kljuc = 'interval'", [interval], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    sendInterval(interval);
    res.json({ changed: this.changes });
  });
});

module.exports = router;
