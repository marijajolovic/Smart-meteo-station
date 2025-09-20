# Smart-meteo-station
Arduino Meteo Station


# Smart Meteo Station

This project is a **Weather Monitoring System** built for the *Internet of Things* course.  
It combines Arduino sensors, a Node.js backend, SQLite database, and Angular frontend to provide real-time monitoring and configuration of a smart meteo station.

---

## 🚀 Features
- Collects temperature and humidity data via Arduino sensors  
- Stores all measurements in an SQLite database  
- Node.js backend with REST API for data access and control  
- Real-time communication between Arduino ↔ Node.js ↔ Angular  
- Adjustable sampling interval (in seconds) stored in database settings and synced with Arduino  
- API endpoints for managing sensors (enable/disable individually or all at once)  
- Filtering of measurements by **sensor** and **date**

---

## 🛠️ Tech Stack
- **Arduino** (temperature & humidity sensors)  
- **Node.js + Express** (backend REST API)  
- **SQLite** (lightweight relational database)  
- **Socket.IO** (real-time data streaming)  
- **Angular** (frontend interface)

---

## 📡 API Endpoints

### Measurements
- `GET /api/merenja` → get all measurements (joined with sensor and unit info)  
- `GET /api/merenja/latest` → get the latest measurement  
- `POST /api/merenja` → add a new measurement  
- `GET /api/merenja/dan/:date` → filter measurements by date (`YYYY-MM-DD`)  
- `GET /api/merenja/senzor/:id` → filter measurements by sensor  
- `GET /api/merenja/senzor/:id/dan/:date` → filter by sensor and date  

### Sensors
- `GET /api/senzori` → get all sensors  
- `PUT /api/senzori/:id` → update one sensor (status, name)  
- `PUT /api/senzori/ukljuci` → enable all sensors  
- `PUT /api/senzori/iskljuci` → disable all sensors  

### Settings
- `GET /api/podesavanja/interval` → get current sampling interval (seconds)  
- `PUT /api/podesavanja/interval` → update sampling interval (also sent to Arduino)  

---

## ⚡ Arduino Communication
- Arduino receives the sampling interval from Node.js on startup.  
- Any interval updates from the frontend are stored in SQLite and forwarded to Arduino over serial communication.  
- Arduino performs sensor readings at the configured interval and sends results back to Node.js.  

---

## 👨‍💻 Team Members
- Veljko Djurović  
- Magdalena Stamenović  
- Ognjen Jovanović  
- Marija Jolović  

---

## 📘 License
This project is developed for educational purposes as part of the **Internet of Things** course.  
