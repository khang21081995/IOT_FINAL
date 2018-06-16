#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <SocketIOClient.h>
#include <ArduinoJson.h>

SocketIOClient client;

char host[] = "192.168.5.9"; //Địa chỉ IP dịch vụ, hãy thay đổi nó theo địa chỉ IP Socket server của bạn.
int port = 3000;             //Cổng dịch vụ socket server do chúng ta tạo!

//từ khóa extern: dùng để #include các biến toàn cục ở một số thư viện khác. Trong thư viện SocketIOClient có hai biến toàn cục
// mà chúng ta cần quan tâm đó là
// RID: Tên hàm (tên sự kiện
// Rfull: Danh sách biến (được đóng gói lại là chuối JSON)
extern String RID;
extern String Rfull;
byte mac[6];
String getMAC()
{
    return String(mac[5], HEX) + ":" + String(mac[4], HEX) + ":" + String(mac[3], HEX) + ":" + String(mac[2], HEX) + ":" + String(mac[1], HEX) + ":" + String(mac[0], HEX);
}

void connectWIFI()
{
    const char *ssid = "HKT Tang 2";    //Tên mạng Wifi mà Socket server của bạn đang kết nối
    const char *password = "123456789"; //Pass mạng wifi ahihi, anh em rãnh thì share pass cho mình với.
    Serial.print("Ket noi vao mang: ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print('.');
    }
    WiFi.macAddress(mac);
    Serial.println(F("Da ket noi WiFi"));
    Serial.println(F("Dia chi IP cua ESP8266 (Socket Client ESP8266): "));
    Serial.println(WiFi.localIP());
    Serial.print("MAC: ");
    Serial.println(getMAC());
}

void connectSocketServer()
{
    if (!client.connect(host, port))
    {
        Serial.println(F("Ket noi den socket server that bai!"));
        return;
    }

    if (client.connected())
    {
        client.send("connected", "MAC", getMAC());
        // client.postREST("")
    }
}

void setup()
{
    // 115200
    Serial.begin(9600);
    delay(10);
    connectWIFI();
    connectSocketServer();
}
unsigned long previousMillis = 0;
long interval = 2000;

void keepAlive()
{
    if (millis() - previousMillis > interval)
    {
        // Serial.println("keepAlive");
        previousMillis = millis();
        client.send("keepAlive", "keepAlive", "keepAlive");
    }

    if (!client.connected())
    {
        Serial.println("reconnect");
        client.reconnect(host, port);
        if (client.connected())
        {
            client.send("connected", "MAC", getMAC());
        }
    }
}

void loop()
{

    if (client.monitor())
    {
        Serial.println(RID);
        Serial.println(Rfull);
    }
    keepAlive();
}