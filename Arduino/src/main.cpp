#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

// #include <ArduinoJson.h>
#include <IRremoteESP8266.h>
#include <IRrecv.h>
#include <IRutils.h>
#include <IRsend.h>
// #include <SocketIOClient.h>
#include <SocketIoClient.h>
#include <string.h>

#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#define DHTPIN 5      // Pin which is connected to the DHT sensor.
#define DHTTYPE DHT22 // DHT 22 (AM2302)

DHT_Unified dht(DHTPIN, DHTTYPE);

uint32_t delayMS;
extern "C"
{
#include "user_interface.h"
}

/**
 * IR config
*/
#define RECV_PIN 14
#define IR_LED 4 // ESP8266 GPIO pin to use. Recommended: 4 (D2).
#define BAUD_RATE 115200
// 115200
#define CAPTURE_BUFFER_SIZE 1024

#if DECODE_AC
#define TIMEOUT 50U
#else               // DECODE_AC
#define TIMEOUT 15U // Suits most messages, while not swallowing many repeats.
#endif              // DECODE_AC
#define MIN_UNKNOWN_SIZE 12
// ==================== end of TUNEABLE PARAMETERS ====================

IRrecv irrecv(RECV_PIN, CAPTURE_BUFFER_SIZE, TIMEOUT, true);
decode_results results; // Somewhere to store the results
IRsend irsend(IR_LED);  // Set the GPIO to be used to sending the message.

/**
 * Socket config
*/
// SocketIOClient client1;

ESP8266WiFiMulti WiFiMulti;
SocketIoClient webSocket;

// char host[] = "192.168.5.9";
char *host = "nginx.30shine.com";
int port = 28888;

/**
 * WiFi config
*/
const char *ssid = "IT";
const char *password = "phucvuhetminh";
byte mac[6];

String getMAC()
{
    return String(mac[5], HEX) + ":" + String(mac[4], HEX) + ":" + String(mac[3], HEX) + ":" + String(mac[2], HEX) + ":" + String(mac[1], HEX) + ":" + String(mac[0], HEX);
}

void connectWIFI()
{

    Serial.print("Ket noi vao mang: ");
    Serial.println(ssid);
    // WiFi.begin(ssid, password);
    // while (WiFi.status() != WL_CONNECTED)
    // {
    //     delay(500);
    //     Serial.print('.');
    // }
    WiFiMulti.addAP(ssid, password);
    WiFiMulti.addAP("HKT Tang 2", "123456789");
    WiFiMulti.addAP("MSE_Students", "123456789");
    WiFiMulti.addAP("KhangPQ", "123456789");
    WiFiMulti.addAP(ssid, password);
    while (WiFiMulti.run() != WL_CONNECTED)
    {
        delay(100);
    }
    WiFi.macAddress(mac);
    Serial.println(F("Da ket noi WiFi"));
    // Serial.println(F("Dia chi IP cua ESP8266 (Socket Client ESP8266): "));
    // Serial.println(WiFiMulti.localIP());
    Serial.print("MAC: ");
    Serial.println(getMAC());
}
String buildRawForm(const decode_results *result)
{
    String output = uint64ToString(getCorrectedRawLength(result), 10) + ",";
    for (uint16_t i = 1; i < result->rawlen; i++)
    {
        uint32_t usecs;
        for (usecs = result->rawbuf[i] * RAWTICK;
             usecs > UINT16_MAX;
             usecs -= UINT16_MAX)
        {
            output += uint64ToString(UINT16_MAX);
            if (i % 2)
                output += ",0,";
            else
                output += ",0,";
        }
        output += uint64ToString(usecs, 10);
        if (i < result->rawlen - 1)
            output += ","; // ',' not needed on the last one
        if (i % 2 == 0)
            output += ""; // Extra if it was even.
    }
    return output;
}

void onSend(const char *payload, size_t length)
{
    char *str = const_cast<char *>(payload);
    char *ptr = strtok(str, ",");
    if (ptr == NULL)
    {
        return;
    }
    int codeLength = atoi(ptr);
    if (codeLength == 0)
        return;
    int count = 0;
    uint16_t rawData[codeLength];
    ptr = strtok(NULL, ",");
    while (ptr != NULL)
    {
        rawData[count] = atoi(ptr);
        count++;
        ptr = strtok(NULL, ",");
    }
    if (count == codeLength)
    {
        Serial.print("Send:");
        count = 0;
        while (count != codeLength)
        {
            Serial.printf("%d,", rawData[count]);
            count++;
        };
        irsend.sendRaw(rawData, codeLength, 38);
        digitalWrite(BUILTIN_LED, LOW);
        delay(200);
        digitalWrite(BUILTIN_LED, HIGH);
    }
    else
    {
        digitalWrite(BUILTIN_LED, LOW);
        delay(200);
        digitalWrite(BUILTIN_LED, HIGH);
        delay(200);
        digitalWrite(BUILTIN_LED, LOW);
        delay(200);
        digitalWrite(BUILTIN_LED, HIGH);
    }
}

void onRegistrationMac(const char *payload, size_t length)
{
    webSocket.emit("device_connected", getMAC());
}
void onTemperature(const char *payload, size_t length)
{
    sensors_event_t event;
    dht.temperature().getEvent(&event);
    if (!isnan(event.temperature))
    {
        webSocket.emit("re-temperature", String(event.temperature));
    }
}
void onHumidity(const char *payload, size_t length)
{
    sensors_event_t event;
    dht.humidity().getEvent(&event);
    if (!isnan(event.relative_humidity))
    {
        webSocket.emit("re-humidity", String(event.relative_humidity));
    }
}
void onTemp(const char *payload, size_t length)
{
    sensors_event_t event;
    dht.humidity().getEvent(&event);
    String humidity = "";
    if (!isnan(event.relative_humidity))
    {
        humidity = String(event.relative_humidity);
    }
    dht.temperature().getEvent(&event);
    String temperature = "";
    if (!isnan(event.temperature))
    {
        temperature = String(event.temperature);
    }

    String ret = "";
    if (temperature == "")
    {
        ret += "NaN *C";
    }
    else
    {
        ret += temperature + " *C";
    }
    ret += "|";
    if (humidity == "")
    {
        ret += "NaN%";
    }
    else
    {
        ret += humidity + "%";
    }
    webSocket.emit("re-temp", ret);
}

void connectSocketServer()
{
    webSocket.on("MACregistration", onRegistrationMac);
    webSocket.on("send", onSend);
    webSocket.on("temperature", onTemperature);
    webSocket.on("humidity", onHumidity);
    webSocket.on("temp", onTemp);
    webSocket.begin(host, port);
    delay(500);
    webSocket.emit("device_connected", getMAC());
}

void setup()
{
    // 115200
    Serial.begin(BAUD_RATE, SERIAL_8N1, SERIAL_TX_ONLY);
    dht.begin();
    while (!Serial) // Wait for the serial connection to be establised.
        delay(50);
    pinMode(BUILTIN_LED, OUTPUT);
    digitalWrite(BUILTIN_LED, HIGH);
    connectWIFI();
    connectSocketServer();

#if DECODE_HASH
    // Ignore messages with less than minimum on or off pulses.
    irrecv.setUnknownThreshold(MIN_UNKNOWN_SIZE);
#endif // DECODE_HASH
    irsend.begin();
    irrecv.enableIRIn(); // Start the receiver
}

void loop()
{

    webSocket.loop();
    if (irrecv.decode(&results))
    {
        String data = resultToSourceCode(&results);
        // Serial.println();
        webSocket.emit("addData", buildRawForm(&results));
        yield(); // Feed the WDT (again)
        irrecv.resume();
    }
}
