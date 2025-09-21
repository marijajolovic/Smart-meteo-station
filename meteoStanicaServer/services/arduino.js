const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const db = require('../db');

const port = new SerialPort({ path: 'COM4', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

const senzorVelicinaMap = {
  "Water level sensor": "Nivo vode",
  "DHT11": "Vlaznost",
  "LM35": "Temperatura",
  "BMP180": "Pritisak",
  "LDR": "Svetlost",     // 1 = Dan, 0 = Noc
  "GY61": "Ubrzanje"     // akcelerometar, m/s²
};


function setupArduino(io) {
  parser.on('data', (data) => {
  console.log('Poruka sa Arduina:', data);

  // Emit raw data ako želiš
  //io.emit('arduino-data', data);

  try {
    const parsed = JSON.parse(data);

    for (const imeSenzora of Object.keys(parsed)) {
      const vrednost = parsed[imeSenzora];
      const imeVelicine = senzorVelicinaMap[imeSenzora];

      if (!imeVelicine) {
        console.error("Nepoznat senzor:", imeSenzora);
        return;
      }

      // Upis u bazu
      db.run(
        `INSERT INTO Merenja (senzor_id, velicina_id, vrednost) 
        VALUES (
          (SELECT id FROM Senzor WHERE naziv = ?),
          (SELECT id FROM Velicina WHERE naziv = ?),
          ?
        )`,
        [imeSenzora, imeVelicine, vrednost],
        function(err) {
          if (err) {
            console.error("Greška pri upisu u bazu:", err.message);
          } else {
            console.log("Merenje upisano u bazu, id:", this.lastID);
          }
        }
      );
    }
    // Nakon upisa, dohvati poslednja merenja svih senzora i emituj
    const sql = `
      SELECT m.id, 
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
      ORDER BY s.naziv
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Greška pri dohvatanju poslednjih merenja:", err.message);
      } else {
        // Emituj ceo niz poslednjih merenja ka klijentima
        console.log(rows)
        io.emit('arduino-data', rows);
      }
    });

  } catch (e) {
    console.error("Greška pri parsiranju JSON-a:", e.message, "Data:", data);
  }
});



  port.on('open', () => {
    console.log('Serijski port otvoren.');
    // učitaj interval iz baze
    db.get("SELECT vrednost FROM Podesavanja WHERE kljuc = 'interval'", [], (err, row) => {
      if (!err && row) {
        port.write(`${row.vrednost}\n`);
      }
    });
  });

  port.on('error', (err) => {
    console.error('Greška sa Arduinom:', err.message);
  });
}

function sendInterval(interval) {
  port.write(`${interval}\n`, (err) => {
    if (err) console.error("Greška pri slanju Arduinu:", err.message);
    else console.log("Poslat novi interval Arduinu:", interval);
  });
}

function sendToArduino(data) {
  const json = JSON.stringify(data);
  port.write(json + '\n', (err) => {
    if (err) console.error("Greška pri slanju Arduinu:", err.message);
    else console.log("Poslato Arduinu:", json);
  });
}


module.exports = { setupArduino, sendInterval, sendToArduino };
