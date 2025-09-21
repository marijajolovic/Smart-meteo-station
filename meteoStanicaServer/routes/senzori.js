const { sendToArduino } = require('../services/arduino');
const express = require('express');
const router = express.Router();
const db = require('../db');



// Uključi sve
router.put('/ukljuci', (req, res) => {
  db.run("UPDATE Senzor SET status = 'ON'", [], function(err) {
    if (err) return res.status(500).json({ error: err.message });

    db.all("SELECT naziv, status FROM Senzor", [], (err, rows) => {
      if (!err) {
        const payload = {};
        rows.forEach(r => { payload[r.naziv] = r.status; });
        sendToArduino({ all: "ON" });
      }
    });

    res.json({ changed: this.changes });
  });
});

// Isključi sve
router.put('/iskljuci', (req, res) => {
  db.run("UPDATE Senzor SET status = 'OFF'", [], function(err) {
    if (err) return res.status(500).json({ error: err.message });

    db.all("SELECT naziv, status FROM Senzor", [], (err, rows) => {
      if (!err) {
        const payload = {};
        rows.forEach(r => { payload[r.naziv] = r.status; });
        sendToArduino({ all: "OFF" });
      }
    });

    res.json({ changed: this.changes });

  });
});

// Update senzora
router.put('/:id', (req, res) => {
  const { status } = req.body;
  db.run("UPDATE Senzor SET status = ? WHERE id = ?",
    [status, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      // Pošalji Arduinu { "naziv": "ON" }
      // sada dohvati naziv senzora iz baze po id
      db.get("SELECT naziv FROM Senzor WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Senzor nije pronađen" });

        // šalji Arduinu JSON { "nazivSenzora": "ON" }
        sendToArduino({ [row.naziv]: status });

        res.json({ changed: this.changes, naziv: row.naziv, status });
      });
    });
});

module.exports = router;
