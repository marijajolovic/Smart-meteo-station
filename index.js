const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { Server } = require('socket.io');
const express = require('express');
const http = require('http');
const cors = require('cors');

const port = new SerialPort({
  path: 'COM4',
  baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', (data) => {
  console.log('Poruka sa Arduina:', data);
  io.emit('arduino-data', data); // ✔️ šalje Angular klijentima
});

port.on('open', () => {
  console.log('Serijski port otvoren.');

  // Kada se port otvori, pročitaj interval iz baze i pošalji Arduinu
  db.get("SELECT vrednost FROM Podesavanja WHERE kljuc = 'interval'", [], (err, row) => {
    if (err) {
      console.error("Greška pri čitanju intervala iz baze:", err.message);
    } else if (row) {
      const interval = row.vrednost;
      port.write(`${interval}\n`, (err) => {
        if (err) console.error("Greška pri slanju Arduinu:", err.message);
        else console.log("Inicijalni interval poslat Arduinu:", interval);
      });
    }
  });
});

port.on('error', (err) => {
  console.error('Greška:', err.message);
});

const app = express();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./index.db');
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST'],
  credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Klijent povezan:', socket.id);

  socket.on('disconnect', () => {
    console.log('Klijent se diskonektovao:', socket.id);
  });
});

// 1) Čitanje svih merenja
app.get('/api/merenja', (req, res) => {
  db.all(`
    SELECT m.id,
          s.naziv AS senzor_naziv,
          v.naziv AS velicina_naziv,
          v.jedinica,
          m.vrednost,
          m.timestamp
    FROM Merenja m
    JOIN Senzor s ON m.senzor_id = s.id
    JOIN Velicina v ON m.velicina_id = v.id
    ORDER BY m.timestamp DESC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 2) Najnovije merenje
app.get('/api/merenja/latest', (req, res) => {
  db.get(`
    SELECT m.id,
          s.naziv AS senzor_naziv,
          v.naziv AS velicina_naziv,
          v.jedinica,
          m.vrednost,
          m.timestamp
    FROM Merenja m
    JOIN Senzor s ON m.senzor_id = s.id
    JOIN Velicina v ON m.velicina_id = v.id
    ORDER BY m.timestamp DESC
    LIMIT 1
  `, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });

});

// 3) Upis novog merenja
app.post('/api/merenja', (req, res) => {
  const { senzor_id, velicina_id, vrednost } = req.body;
  db.run("INSERT INTO Merenja (senzor_id, velicina_id, vrednost) VALUES (?, ?, ?)", 
    [senzor_id, velicina_id, vrednost], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
  });
});


// 5) Uključi sve senzore
app.put('/api/senzori/ukljuci', (req, res) => {
  db.run("UPDATE Senzor SET status = 'aktivan'", [], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changed: this.changes });
  });
});

// 6) Isključi sve senzore
app.put('/api/senzori/iskljuci', (req, res) => {
  db.run("UPDATE Senzor SET status = 'neaktivan'", [], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changed: this.changes });
  });
});


// 4) Update jednog senzora po ID
app.put('/api/senzori/:id', (req, res) => {
  const { status, naziv } = req.body;
  db.run("UPDATE Senzor SET status = ?, naziv = ? WHERE id = ?", 
    [status, naziv, req.params.id], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changed: this.changes });
  });
});

// Merenja za određeni dan
app.get('/api/merenja/dan/:datum', (req, res) => {
  const { datum } = req.params;

  db.all(`
    SELECT m.id,
           s.naziv AS senzor_naziv,
           v.naziv AS velicina_naziv,
           v.jedinica,
           m.vrednost,
           m.timestamp
    FROM Merenja m
    JOIN Senzor s ON m.senzor_id = s.id
    JOIN Velicina v ON m.velicina_id = v.id
    WHERE DATE(m.timestamp) = DATE(?)
    ORDER BY m.timestamp DESC
  `, [datum], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// Merenja za određeni senzor
app.get('/api/merenja/senzor/:id', (req, res) => {
  const { id } = req.params;

  db.all(`
    SELECT m.id,
           s.naziv AS senzor_naziv,
           v.naziv AS velicina_naziv,
           v.jedinica,
           m.vrednost,
           m.timestamp
    FROM Merenja m
    JOIN Senzor s ON m.senzor_id = s.id
    JOIN Velicina v ON m.velicina_id = v.id
    WHERE m.senzor_id = ?
    ORDER BY m.timestamp DESC
  `, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Merenja za određeni senzor na određen dan
app.get('/api/merenja/senzor/:id/dan/:datum', (req, res) => {
  const { id, datum } = req.params;

  db.all(`
    SELECT m.id,
           s.naziv AS senzor_naziv,
           v.naziv AS velicina_naziv,
           v.jedinica,
           m.vrednost,
           m.timestamp
    FROM Merenja m
    JOIN Senzor s ON m.senzor_id = s.id
    JOIN Velicina v ON m.velicina_id = v.id
    WHERE m.senzor_id = ? AND DATE(m.timestamp) = DATE(?)
    ORDER BY m.timestamp DESC
  `, [id, datum], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// Rad sa podesavanjima
// Vrati trenutno podešavanje
app.get('/api/podesavanja/interval', (req, res) => {
  db.get("SELECT vrednost FROM Podesavanja WHERE kljuc = 'interval'", [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ interval: row ? parseInt(row.vrednost) : null });
  });
});

// Promeni podešavanje
app.put('/api/podesavanja/interval', (req, res) => {
  const { interval } = req.body;
  if (!interval) return res.status(400).json({ error: "Morate poslati interval u sekundama" });

  db.run("UPDATE Podesavanja SET vrednost = ? WHERE kljuc = 'interval'", [interval], function(err) {
    if (err) return res.status(500).json({ error: err.message });

    // Pošalji Arduinu novi interval
    port.write(`${interval}\n`, (err) => {
      if (err) console.error("Greška pri slanju Arduinu:", err.message);
      else console.log("Poslat novi interval Arduinu:", interval);
    });

    res.json({ changed: this.changes });
  });
});



server.listen(3000, () => {
  console.log('Server radi na http://localhost:3000');
});
