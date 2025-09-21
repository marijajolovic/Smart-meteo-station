const express = require('express');
const router = express.Router();
const db = require('../db');

// Sve merenja
router.get('/', (req, res) => {
  db.all(`SELECT m.id, s.naziv AS senzor_naziv, v.naziv AS velicina_naziv, v.jedinica,
                 m.vrednost, m.timestamp
          FROM Merenja m
          JOIN Senzor s ON m.senzor_id = s.id
          JOIN Velicina v ON m.velicina_id = v.id
          ORDER BY m.timestamp DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Najnovije
router.get('/latest', (req, res) => {
  db.get(`SELECT * FROM Merenja ORDER BY timestamp DESC LIMIT 1`, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Novo merenje
router.post('/', (req, res) => {
  const { senzor_id, velicina_id, vrednost } = req.body;
  db.run("INSERT INTO Merenja (senzor_id, velicina_id, vrednost) VALUES (?, ?, ?)",
    [senzor_id, velicina_id, vrednost],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

// Poslednja dva merenja za svaki senzor
router.get('/last-two', (req, res) => {
  db.all(`
    SELECT s.naziv AS senzor_naziv, m.vrednost, m.timestamp
    FROM Merenja m
    JOIN Senzor s ON m.senzor_id = s.id
    ORDER BY s.id, m.timestamp DESC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const result = {};
    rows.forEach(row => {
      if (!result[row.senzor_naziv]) {
        result[row.senzor_naziv] = [];
      }
      // dodaj vrednost dok ne skupimo 2 po senzoru
      if (result[row.senzor_naziv].length < 2) {
        result[row.senzor_naziv].push(row.vrednost);
      }
    });

    res.json(result);
  });
});

module.exports = router;
