import sqlite3

# 1) Povezivanje na SQLite bazu (fajl se automatski kreira ako ne postoji)
conn = sqlite3.connect("index.db")
c = conn.cursor()

# 2) Kreiranje tabela
c.execute("""
CREATE TABLE IF NOT EXISTS Senzor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT NOT NULL,
    naziv TEXT NOT NULL
)
""")

c.execute("""
CREATE TABLE IF NOT EXISTS Velicina (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jedinica TEXT NOT NULL,
    naziv TEXT NOT NULL
)
""")

c.execute("""
CREATE TABLE IF NOT EXISTS Merenja (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senzor_id INTEGER NOT NULL,
    velicina_id INTEGER NOT NULL,
    vrednost REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senzor_id) REFERENCES Senzor(id) ON DELETE CASCADE,
    FOREIGN KEY (velicina_id) REFERENCES Velicina(id) ON DELETE CASCADE
)
""")

# 3) Ubacivanje test podataka
senzori = [
    ("OFF", "Water level sensor"),
    ("OFF", "DHT11"),
    ("OFF", "LM35"),
    ("OFF", "BMP180"),
    ("OFF", "LDR"),
    ("OFF", "GY61")
]
c.executemany("INSERT INTO Senzor (status, naziv) VALUES (?, ?)", senzori)


# Ubaci veličine
velicine = [
    ("cm", "Nivo vode"),
    ("%", "Vlaznost"),
    ("°C", "Temperatura"),
    ("mbar", "Pritisak"),
    ("", "Svetlost"),   # 1 = Dan, 0 = Noć
    ("m/s²", "Ubrzanje")
]
c.executemany("INSERT INTO Velicina (jedinica, naziv) VALUES (?, ?)", velicine)


# 5) Dodavanje podesavanja
c.execute("""
CREATE TABLE IF NOT EXISTS Podesavanja (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kljuc TEXT UNIQUE NOT NULL,
    vrednost TEXT NOT NULL
  )
""")
c.execute("INSERT OR IGNORE INTO Podesavanja (kljuc, vrednost) VALUES (?, ?)", ('interval', '3'))

# 6) Čuvanje promena i zatvaranje konekcije
conn.commit()
conn.close()

print("Baza uspešno kreirana i test podaci ubačeni!")
