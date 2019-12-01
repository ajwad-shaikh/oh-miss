
/* Final Code OH-MISS */
#include <TinyGPS.h>
#include "SoftwareSerial.h"
#include <SPI.h>
#include <SD.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "WiFiEsp.h"

#define ONE_WIRE_BUS 8
#define trigPin1 6
#define echoPin1 5
DeviceAddress thermometerAddress;
OneWire oneWire(ONE_WIRE_BUS);
File myFile;
DallasTemperature sensors(&oneWire);
SoftwareSerial gps_serial(10, 11); //RX=pin 10, TX=pin 11
TinyGPS gps;                       //This is the GPS object that will pretty much do all the grunt work with the NMEA data
//AltSoftSerial Serial1(18, 19); // RX, TX
WiFiEspServer server(80);
WiFiEspClient client;

long duration, distance;
float Celsius = 0, Fahrenheit = 0, lat, lon;
long dt, ti;
int id = 0;
char ssid[] = "ABCD";        // your network SSID (name)
char pass[] = "abcdefghi";   // your network password
int status = WL_IDLE_STATUS; // the Wifi radio's status
int reqCount = 0;            // number of requests received
String MC = "";
bool connectWiFi = false;
int gpsCount = 0;
int clientFailCount = 0;

String genJSON();
void writeSD(String data);
void printWifiStatus();
void initESP();
void attemptWiFi();

void setup()
{
  sensors.begin();
  Serial.begin(9600); //This opens up communications to the Serial monitor in the Arduino IDE
                      //  while (!Serial);
  sensors.setResolution(thermometerAddress, 12);
  Serial.print("Initializing SD card...");
  if (!SD.begin(53))
  {
    Serial.println("initialization failed!");
    while (1)
      ;
  }
  Serial.println("initialization done.");
  initESP();
  gps_serial.begin(9600);
  Serial.println("GPS Start"); //Just show to the monitor that the sketch has started
  pinMode(trigPin1, OUTPUT);
  pinMode(echoPin1, INPUT);
}

void loop()
{
  SonarSensor(trigPin1, echoPin1);
  String Depth = String(distance);
  //client = server.available();
  if (gpsCount >= 5)
  {
    Serial.println("gpsCount check");
    attemptWiFi();
    gpsCount = 0;
  }

  if (connectWiFi)
  {
    client = server.available();
    Serial.println("Attempt to Connect To Web : " + String(clientFailCount));
    if (client)
    {
      Serial.println("New client");
      // an http request ends with a blank line
      boolean currentLineIsBlank = true;
      while (client.connected())
      {
        if (client.available())
        {
          char c = client.read();
          Serial.write(c);
          // if you've gotten to the end of the line (received a newline
          // character) and the line is blank, the http request has ended,
          // so you can send a reply
          if (c == '\n' && currentLineIsBlank)
          {
            Serial.println("Sending response");
            // re-open the file for reading:
            // send a standard http response header
            // use \r\n instead of many println statements to speedup data send
            client.print(
                "HTTP/1.1 200 OK\r\n"
                "Content-Type: text/html\r\n"
                "Connection: close\r\n" // the connection will be closed after completion of the response
                "\r\n");
            client.print("<!DOCTYPE HTML>\r\n");
            client.print("<html>\r\n");
            //            client.print("<h1>Hello World!</h1>\r\n");
            //            client.print("Requests received: ");
            //            client.print(++reqCount);
            client.print("<center><h1>OH-MISS</h1></center>\r\n");
            client.print("<center><h2>Ocean Health Monitoring Instrument Stuck to a Ship</h2></center>\r\n");
            client.print("<br>\r\n");
            myFile = SD.open("gps.txt");
            if (myFile)
            {
              Serial.println("gps.txt:");
              // read from the file until there's nothing else in it:
              String data = "";
              while (myFile.available())
              {
                int x = (myFile.read());
                data = data + char(x);
                if (x == 10)
                  data += "<br>\r\n\r\n";
                if (x == 125)
                {
                  client.print(data);
                  data = "";
                }
              }
              // close the file:
              myFile.close();
            }
            else
            {
              // if the file didn't open, print an error:
              Serial.println("error opening gps.txt");
            }
            client.print("<br>\r\n");
            client.print("</html>\r\n");
            break;
          }
          if (c == '\n')
          {
            // you're starting a new line
            currentLineIsBlank = true;
          }
          else if (c != '\r')
          {
            // you've gotten a character on the current line
            currentLineIsBlank = false;
          }
        }
      }
      // give the web browser time to receive the data
      delay(10);
      // close the connection:
      client.stop();
      Serial.println("Client disconnected");
    }
    else
      clientFailCount++;
    if (clientFailCount == 500)
    {
      connectWiFi = false;
      clientFailCount = 0;
      status = WL_IDLE_STATUS;
    }
  }
  else
  {
    while (gps_serial.available()) //While there are characters to come from the GPS
    {
      if (connectWiFi)
        break;

      //This feeds the serial NMEA data into the library one char at a time
      if (gps.encode(gps_serial.read()))
      {
        Serial.println("hgfhgfdfdfg" + (String)gpsCount);
        String data = genJSON();
        Serial.println(data);
        writeSD(data);
        gpsCount++;
      }
      if (gpsCount >= 5)
        break;
    }
  }
  //attemptWiFi();
}

String genJSON()
{
  sensors.requestTemperatures();
  Celsius = sensors.getTempCByIndex(0);
  id++;
  gps.get_datetime(&dt, &ti);
  gps.f_get_position(&lat, &lon); // get latitude and longitude
  SonarSensor(trigPin1, echoPin1);
  String Depth = String(distance);

  String latitude = String(lat, 6);
  String longitude = String(lon, 6);
  Serial.println(latitude + ";" + longitude);
  String data = "{";
  data = data + "\n";
  data = data + "coords: [";
  data = data + latitude + "," + longitude + "],";
  data = data + "\n";
  data = data + "id:" + String(id) + ",";
  data = data + "\n";
  data = data + "temp:" + String(Celsius) + ",";
  data = data + "\n";
  data = data + "depth:" + Depth + ",";
  data = data + "\n";
  data = data + "date:" + String(dt) + ",";
  data = data + "\n";
  data = data + "type:\"marker\"" + "\n}," + "\n";
  //Serial.println(data);
  return data;
}

void writeSD(String data)
{
  myFile = SD.open("gpsWrite.txt", FILE_WRITE);
  if (myFile)
  {
    Serial.print("Writing to gpsWrite.txt...");
    myFile.println(data);
    myFile.close();
    Serial.println("done");
  }
  else
  {
    // if the file didn't open, print an error:
    Serial.println("error opening gpsWrite.txt");
  }
}

void printWifiStatus()
{
  // print the SSID of the network you're attached to
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print where to go in the browser
  Serial.println();
  Serial.print("To see this page in action, open a browser to http://");
  Serial.println(ip);
  Serial.println();
}

void initESP()
{
  // initialize serial for ESP module
  Serial1.begin(9600);
  // initialize ESP module
  WiFi.init(&Serial1);

  // check for the presence of the shield
  if (WiFi.status() == WL_NO_SHIELD)
  {
    Serial.println("WiFi shield not present");
    // don't continue
    while (true)
      ;
  }
  attemptWiFi();
}

void attemptWiFi()
{
  // attempt to connect to WiFi network
  if (status != WL_CONNECTED)
  {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network
    status = WiFi.begin(ssid, pass);
    if (status != WL_CONNECTED)
    {
      connectWiFi = false;
      return;
    }
    Serial.println("You're connected to the network");
    printWifiStatus();

    // start the web server on port 80
    server.begin();
    connectWiFi = true;
  }
}
void SonarSensor(int trigPin, int echoPin)
{
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = (duration / 2) / 29.1;
}
