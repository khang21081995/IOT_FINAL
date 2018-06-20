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
char *host = "192.168.5.9";
int port = 3000;

/**
 * WiFi config
*/
const char *ssid = "HKT Tang 2";
const char *password = "123456789";
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
    }
    else
        Serial.println("Fail!!!");
}

void onRegistrationMac(const char *payload, size_t length)
{
    webSocket.emit("device_connected", getMAC());
}

void connectSocketServer()
{
    webSocket.on("send", onSend);
    webSocket.on("MACregistration", onRegistrationMac);
    webSocket.begin(host, 3000);
    webSocket.emit("device_connected", getMAC());
}

void setup()
{
    // 115200
    Serial.begin(BAUD_RATE, SERIAL_8N1, SERIAL_TX_ONLY);
    while (!Serial) // Wait for the serial connection to be establised.
        delay(50);
    connectWIFI();
    connectSocketServer();

#if DECODE_HASH
    // Ignore messages with less than minimum on or off pulses.
    irrecv.setUnknownThreshold(MIN_UNKNOWN_SIZE);
#endif // DECODE_HASH
    irsend.begin();
    irrecv.enableIRIn(); // Start the receiver
    uint32_t free = system_get_free_heap_size();
    Serial.println(free);
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
