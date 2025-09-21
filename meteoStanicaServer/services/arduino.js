const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const db = require('../db');

const port = new SerialPort({ path: 'COM4', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

function setupArduino(io) {
  parser.on('data', (data) => {
    console.log('Poruka sa Arduina:', data);
    io.emit('arduino-data', data);
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
