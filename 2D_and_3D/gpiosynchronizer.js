/*
 Utility: GPIO Synchronization Demo
 
 Uses two GPIO pins to synchronize patterns between
 a pair of connected Pixelblazes. Caution:  Connecting
 Pixelblazes this way requires soldering and basic electronics
 knowledge. See the README.md or the Pixelblaze forums for
 additional guidance.
 
 To use: 
 - Call initGPIO(inPin,outPin) to set up your GPIO pins
 - Call synchronize(delta) from your beforeRender() function
 - Call syncTime() instead of time() for things that need to
   be synchronized.
 - To manually initiate synchronization, call requestSync()
 
 Version  Author        Date        Comment
 1.0.0    JEM(ZRanger1) 11/1/2020 
*/ 

// Global state variables for synchronizer
var _syncState = 1;   // state of sync state machine
var _holdTime = 0;    // how long we've been in a given state
var _inPin = 4;       // input GPIO pin
var _outPin = 5;      // output GPIO pin 
var _tcount = 0;      // accumulator for sync'd timebase

// Configure the two GPIO pins needed for synchronization
function initGPIO(inPin,outPin) {
  _inPin = inPin;
  _outPin = outPin;

  pinMode(_outPin,OUTPUT)  
  pinMode(_inPin,INPUT)    
  digitalWrite(_outPin,LOW);  
}

// Just like built-in time(), but uses our synchronized timebase to
// keep patterns running together.
function syncTime(rate) {
  return (_tcount * 0.57375 / rate) % 1;
}

// Reset base time for syncTime().  If two Pixelblazes call this at
// almost exactly the same time, their patterns will be synchronized.
function resetTime() {
  _tcount = 0;
}

// start the pattern synchronization process the next time 
// synchronize() is called.
function requestSync() {
  _syncState = 1;
}

// GPIO Pattern synchronization state machine.  Must be called in
// beforeRender(), before any calls to syncTime()
function synchronize(delta) {
  _holdTime += delta;
  _tcount = (_tcount + (delta >> 15)) % 1;  
  
  if (_syncState == 0) {            // synchronized -- normal operation
    _syncState = digitalRead(_inPin);
  }
  else if (_syncState == 1 ) { 
    _holdTime = 0;
    digitalWrite(_outPin,HIGH);    // set pin HIGH to request sync 
    _syncState = 2;
  }
  else if (_syncState == 2) {
    if (digitalRead(_inPin)) {    // wait for other side to respond 
      _holdTime = 0;
      _syncState = 3;
    }
    else {
      if (_holdTime > 1000) _syncState = 1;
    }    
  }
  else if (_syncState == 3) {
    digitalWrite(_outPin,LOW);    // clear our req pin to ack other side's request    
    if (!digitalRead(_inPin)) {   // wait for other side to respond
      _syncState = 0;
      resetTime();
    }
    else {
      if (_holdTime > 1000) _syncState = 1;
    }
  }  
}

// GPIO Setup - set input and output pins.
initGPIO(4,5);

// 3 colored pixel demo from @jeff's "An Intro to Pixelblaze Code"
var leadPosition = 0;

export function beforeRender(delta) {
  synchronize(delta);  
  leadPosition = pixelCount * syncTime(.1);    
}

export function render(index) {
  red   = abs(leadPosition - index) < 1
  green = abs(leadPosition - index - 4) < 1
  blue  = abs(leadPosition - index - 8) < 1
    
  rgb(red, green, blue)  
}
