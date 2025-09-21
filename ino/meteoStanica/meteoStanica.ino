#include <DHT11.h>
#include <Wire.h>
#include <Adafruit_BMP085.h>

Adafruit_BMP085 bmp;
DHT11 dht11(2);

const int temperaturePin = A0;
const int waterSensorPin = A1;
const int ldrPin = 8;
const int xPin = A2;
const int yPin = A3;
const int buzzPin = 9;

bool temperatureSensorOn = false;
bool humiditySensorOn = false;
bool pressureSensorOn = false;
bool waterLevelSensorOn = false;
bool windSensorOn = false;
bool dayNightSensorOn = false;

int samplingInteraval = 3000;

String zaSlanje = "";


unsigned long lastSampleTime = 0;

unsigned long beepStartTime = 0;
bool beeping = false;


void turnOnBeep() 
{
  tone(buzzPin, 2000); // glavni ton
  delay(200);
  noTone(buzzPin);
  delay(50);

  tone(buzzPin, 1800);
  delay(150);
  noTone(buzzPin);
  delay(50);

  tone(buzzPin, 2200);
  delay(150);
  noTone(buzzPin);
  delay(50);

  tone(buzzPin, 2500); // nagli skok
  delay(300);
  noTone(buzzPin);
  delay(100);

  tone(buzzPin, 2000); // vraćanje na glavni ton
  delay(400);
  noTone(buzzPin);
  delay(500); // pauza pre ponavljanja
}


void turnSensorOnOf(String str) {
    int colonIndex = str.indexOf(":");
    if(colonIndex > 0) {
        String sensorName = str.substring(0, colonIndex);
        String state = str.substring(colonIndex + 1);
        state.replace("\n", "");

        if(sensorName == "LM35")
            state == "ON" ? temperatureSensorOn = true : temperatureSensorOn = false;
        if(sensorName == "DHT11")
            state == "ON" ? humiditySensorOn = true : humiditySensorOn = false;
        if(sensorName == "GY61")
            state == "ON" ? windSensorOn = true : windSensorOn = false;
        if(sensorName == "LDR")
            state == "ON" ? dayNightSensorOn = true : dayNightSensorOn = false;
        if(sensorName == "BMP180")
            state == "ON" ? pressureSensorOn = true : pressureSensorOn = false;
        if(sensorName == "Water level sensor")
            state == "ON" ? waterLevelSensorOn = true : waterLevelSensorOn = false;
        if(sensorName == "all") {
            state == "ON" ? temperatureSensorOn = true : temperatureSensorOn = false;
            state == "ON" ? humiditySensorOn = true : humiditySensorOn = false;
            state == "ON" ? windSensorOn = true : windSensorOn = false;
            state == "ON" ? dayNightSensorOn = true : dayNightSensorOn = false;
            state == "ON" ? pressureSensorOn = true : pressureSensorOn = false;
            state == "ON" ? waterLevelSensorOn = true : waterLevelSensorOn = false;
        }
        if(sensorName == "interval")
            samplingInteraval = state.toInt() * 1000;
    }
}

void setup() {
    Serial.begin(9600);
    pinMode(ldrPin, INPUT);
    pinMode(buzzPin, OUTPUT);

    if (!bmp.begin()) {
        Serial.println("BMP180 nije pronađen.");
        while (1);
    }

    dht11.setDelay(0);
}

void loop() {
    while (Serial.available()) {
        String inputString = Serial.readStringUntil('\n');
        inputString.replace("\"", "");
        inputString.replace("{", "");
        inputString.replace("}", "");
        turnSensorOnOf(inputString);
    }


    unsigned long currentMillis = millis();
    if (currentMillis - lastSampleTime >= samplingInteraval) {
        lastSampleTime = currentMillis;

        zaSlanje = "{";

        int temperature = 0;
        int humidity = 0;

        if(dayNightSensorOn) {
            int stanje = digitalRead(ldrPin);
            zaSlanje += "\"LDR\":\"" + String(stanje == LOW ? "Noc" : "Dan") + "\",";
        }

        if(waterLevelSensorOn) {
            int waterLevel = analogRead(waterSensorPin);

            if(waterLevel > 400) {
                turnOnBeep();
            }
            zaSlanje += "\"Water level sensor\":" + String(waterLevel) + ",";
        }

        if(temperatureSensorOn) {
            int raw = analogRead(temperaturePin);
            float voltage = raw * (5.0 / 1023.0);
            float temperatureC = voltage * 100.0;
            zaSlanje += "\"LM35\":" + String(temperatureC) + ",";
        }

        if(pressureSensorOn) {
            float pressure = bmp.readPressure();
            zaSlanje += "\"BMP180\":" + String(pressure/100) + ",";
        }

        if(humiditySensorOn) {
            int result = dht11.readTemperatureHumidity(temperature, humidity);
            if (result == 0) zaSlanje += "\"DHT11\":" + String(humidity) + ",";
        }

        if(windSensorOn) {
            int x = analogRead(xPin);
            int y = analogRead(yPin);
            float ax = ((float)x - 331.5)/65*9.8;
            float ay = ((float)y - 329.5)/68.5*9.8;
            float gravForce = sqrt(ax*ax + ay*ay);
            zaSlanje += "\"GY61\":" + String(gravForce);
        }

        zaSlanje += "}";
        Serial.println(zaSlanje);
    }
}
