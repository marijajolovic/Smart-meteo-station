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
  db.all(`SELECT m.id, 
                s.naziv AS senzor_naziv, 
                v.naziv AS velicina_naziv, 
                v.jedinica,
                 m.vrednost, 
                 s.status
          FROM Merenja m
          JOIN Senzor s ON m.senzor_id = s.id
          JOIN Velicina v ON m.velicina_id = v.id
          INNER JOIN (
            SELECT senzor_id, MAX(timestamp) AS max_time
            FROM Merenja
            GROUP BY senzor_id
          ) latest
          ON m.senzor_id = latest.senzor_id AND m.timestamp = latest.max_time
          ORDER BY s.naziv`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
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

    const map = {}; // privremeno čuvamo po imenu senzora

    rows.forEach(row => {
      if (!map[row.senzor_naziv]) {
        map[row.senzor_naziv] = [];
      }
      // dodajemo max 2 vrednosti po senzoru
      if (map[row.senzor_naziv].length < 2) {
        map[row.senzor_naziv].push(row.vrednost);
      }
    });

    // konvertujemo u niz objekata sa last/previous
    const result = Object.entries(map).map(([senzor, values]) => ({
      sensor: senzor,
      values: {
        last: values[0] ?? null,
        previous: values[1] ?? null
      }
    }));

    res.json(result);
  });
});

module.exports = router;
