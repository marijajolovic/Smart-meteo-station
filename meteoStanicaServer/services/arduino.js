const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const db = require('../db');

const port = new SerialPort({ path: 'COM8', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

const senzorVelicinaMap = {
  "Water level sensor": "Nivo vode",
  "DHT11": "Vlaznost",
  "TMP36": "Temperatura",
  "BMP180": "Pritisak",
  "LDR": "Svetlost",     // 1 = Dan, 0 = Noc
  "GY61": "Ubrzanje"     // akcelerometar, m/s²
};


function setupArduino(io) {
  parser.on('data', (data) => {
    console.log('Poruka sa Arduina:', data);
    io.emit('arduino-data', data);
    try {
      const parsed = JSON.parse(data); 
      // parsed može biti { "Temperatura": 23.5 } ili { "Vlaznost": 60 }

      console.log("Primljeno merenje:", parsed);

      for (const imeSenzora of Object.keys(parsed)) {

        const vrednost = parsed[imeSenzora];
        const imeVelicine = senzorVelicinaMap[imeSenzora];

        console.log(`Primljeno: ${imeSenzora} = ${vrednost}`);
      
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

        // Emituj klijentima u realnom vremenu
        io.emit('novo-merenje', { imeSenzora, vrednost });
      }
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


module.exports = { setupArduino, sendInterval };
