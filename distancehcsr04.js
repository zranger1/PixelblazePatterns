/*
Read approximate distance from an HC-SR04 Ultrasonic sensor using GPIO

MIT License

ZRanger 16/7/2021

*/

var triggerPin = 4;
var echoPin = 5;
pinMode(triggerPin,OUTPUT);  
pinMode(echoPin,INPUT);  

var sensorTimer = 999;
var maSize = 6;
var aIndex = 0;
var avgBuffer = array(maSize);

// maxIterations controls the maximum measurable distance. On a 
// Pixelblaze2, 1500 is about 1.5 meters.  Minimum measurable distance is
// about 15cm (6 inches), determined to some extent by the Pixelblaze's
// execution speed. 
var maxIterations = 1500;   

// retrieve the Pixelblaze type so someday we can set delay times.
// appropriately.
var hw = getHardwareType();

// something like 1.8ms measured delay on PB2.  TBD - Will
// need to increase delay time on PB3
function delay() {
  ;
}

// average the last <maSize> readings to get rid of some
// of the noise and stabilize our distance reading.
function avgNewReading(dist) {
  var r = 0;
  avgBuffer[aIndex] = dist;
  aIndex = (aIndex + 1) % maSize;
  for (var i = 0; i < maSize; i++) {
    r += avgBuffer[i];
  }
  return r / maSize;
}

// Attempt to detect the Pixelblaze variant the pattern is
// currently running on, based on differences in capacitance 
// returned by touchRead on the "orange LED" GPIO Pin (GPIO12)
//
// Returns: 0 - Pixelblaze 2, 1 - Pixelblaze 3, 2 - Pixelblaze Nano
function getHardwareType() {
  var hw = 0;   // default to pb2
  
  var e = touchRead(12);
  if (e == 0) { hw = 2; }
  else if (e >= 0.99) hw = 1;
  
  return hw;
}  

// send a brief pulse on the trigger pin to start the sensor
function triggerSensor() {
  digitalWrite(triggerPin,LOW);
  delay();
  digitalWrite(triggerPin,HIGH);
  delay();
  delay();
  digitalWrite(triggerPin,LOW);  
}

// wait for the sensor to receive an echo.  Length of the
// wait time determines distance.  It times out in about 38ms
function readSensor() {
  var t = 0;
  // wait for echo pin to go high, indicating that we've
  // started listening.
  while (!digitalRead(echoPin)) {
    if (t++ > 100) break;
  }
  
  // measure how long it takes for echo pin to return to low
  // this will give us a rough distance estimate.
  t = 0;
  while(digitalRead(echoPin)) {
    // if we hit timeout, set the echo pin to LOW
    // to reset the hardware, which otherwise can get stuck
    if (t++ >= maxIterations) {
      pinMode(echoPin,OUTPUT);
      digitalWrite(echoPin,LOW);
      pinMode(echoPin,INPUT);
      break;
    }
  }
  return t / maxIterations;
}

export var distance;
export function beforeRender(delta) {
  sensorTimer += delta;
  
  if (sensorTimer > 50) {
    triggerSensor();
    distance = readSensor();
    distance = avgNewReading(distance);
    sensorTimer = 0;
  }
}

// Display red for pb2, green for pb3, blue for nano, moving lit area of pixels 
// down the strip according to distance sensor reading.
export function render(index) {
  h = hw * 0.3333; // color according to Pixelblaze type.
  s = 1
  v = abs((index / pixelCount) - distance) < 0.1;
  hsv(h, s, v)
}
