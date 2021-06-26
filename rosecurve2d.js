/* Roses

 Interactive "rose" or rhodonea curve display.

    https://en.wikipedia.org/wiki/Rose_(mathematics)

 N and D sliders control angular frequency.  The wikipedia
 article has a figure illustrating the many types of curves that
 these settings will produce.

 Requires a 2D LED array and appropriate pixel mapper.
 
 MIT License
 
 Version  Author        Date      
 1.0.0    JEM(ZRanger1) 06/26/2021
*/ 

// display size - enter the dimensions of your matrix here
var width = 16;
var height = 16;
var centerX = (width-1) / 2;
var centerY = (width-1) / 2;

// Global variables for rendering
var frameBuffer = array(height);  // main drawing surface
var frameTimer = 9999;            // accumulator for simulation timer

export var speed = 16.6667;   // draw at about 60 fps
export var n = 4;
export var d = 3;
export var tail = 2000;
var r1,r2,t1;                 // timers and waves for animation
var k,steps;

export function slidern(v) {
  n = 1+floor(15 * v);
  k = n / d;
  steps = PI2 * d;  
}

export function sliderd(v) {
  d = 1+floor(15 * v);
  k = n / d;
  steps = PI2 * d;  
}

export function sliderTail(v) {
  tail = floor(v * 10000);
}

export function sliderSpeed(v) {
  speed = 60 * (1-v);
}

function allocateFrameBuffer() {
  for (var i = 0; i < height; i ++) {
    frameBuffer[i] = array(width);
  }
}

function coolFrameBuffer(delta) {
  coolingRate = delta/tail;
  
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var n = frameBuffer[x][y] % 1;
      if (!n) continue;
       frameBuffer[x][y] = floor(frameBuffer[x][y])+max(0,n - coolingRate);
    }
  } 
}

// Initialization
allocateFrameBuffer();

var theta = 0;
export function beforeRender(delta) {
  frameTimer += delta;
  
  if (frameTimer > speed) {
    coolFrameBuffer(speed);      

    theta = (theta + (steps/360)) % steps;
    var r = 0.42 * sin(k * theta)
    var x1 = 0.5 + (r * cos(theta));
    var y1 = 0.5 + (r * sin(theta));
    h = hypot(x1-0.5,y1-0.5)
    frameBuffer[x1 * width][y1 * height] = floor(1000*h)+0.9
    frameTimer = 0;
  }
}

export function render2D(index, x, y) {
  var x1,y1,v,h;
  x1 = floor(x * width) ; y1 = floor(y * height);
  v = frameBuffer[x1][y1];
  h = floor(v) / 1000;
  v = v % 1;
  hsv(h, 1, v);
}