const express = require('express');
const router = express.Router();
const db = require('../db');

// Update senzora
router.put('/:id', (req, res) => {
  const { status, naziv } = req.body;
  db.run("UPDATE Senzor SET status = ?, naziv = ? WHERE id = ?",
    [status, naziv, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changed: this.changes });

      // Pošalji Arduinu { "naziv": "ON" }
      sendToArduino({ [naziv]: status });
      res.json({ changed: this.changes });
    });
});

// Uključi sve
router.put('/ukljuci', (req, res) => {
  db.run("UPDATE Senzor SET status = 'ON'", [], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changed: this.changes });

    db.all("SELECT naziv, status FROM Senzor", [], (err, rows) => {
      if (!err) {
        const payload = {};
        rows.forEach(r => { payload[r.naziv] = r.status; });
        sendToArduino(payload);
      }
    });

    res.json({ changed: this.changes });
  });
});

// Isključi sve
router.put('/iskljuci', (req, res) => {
  db.run("UPDATE Senzor SET status = 'OFF'", [], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changed: this.changes });

    db.all("SELECT naziv, status FROM Senzor", [], (err, rows) => {
      if (!err) {
        const payload = {};
        rows.forEach(r => { payload[r.naziv] = r.status; });
        sendToArduino(payload);
      }
    });

    res.json({ changed: this.changes });

  });
});

module.exports = router;
