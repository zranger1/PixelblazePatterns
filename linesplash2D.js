/*
 Line Splash 2D 
 Waves created by randomly dropping objects from random heights
 into a linear "pond".
 
 For performance, this is actually a system of springs rather
 than a true wave simulation.  
 
 Requires a 2D LED matrix and appropriate pixel mapper.
 
 NOTE that you must set the matrix dimensions in the pattern
 code for this to work properly.
 
 Version  Author        Date        Comment
 1.0.0    JEM(ZRanger1) 10/16/2020 
*/ 

// display size -- we depend on a matrix mapper being present,
// but we still need to know the matrix dimensions
var displayWidth = 32;
var displayHeight = 16;
var initialLevel = displayHeight / 2;
var maxWidthIndex = displayWidth - 1;

// constants affecting water behavior
export var tension = 0.007;   // spring tension -- affects bounce speed
export var damping = 0.008;   // decay rate of waves in the absence of other forces
export var spread = 0.003;    // energy from each cell passed to neighbors

// storage for current state of our water "surface"
var waterLevel = array(displayWidth);
var waterSpeed = array(displayWidth);

// animation controls
var dropInterval = 300;   // initial ms between rock drops
var frameTimer = 0;       // time accumulator for rock dropping
var lineWidth = 1.2;      // approx width of water surface "line"
var hue = 0.6666;         // color of water line
var hueTimer;

initWater();              // initialize water level and speed arrays

// UI
export function sliderTension(v) {
  tension = 0.05 * v * v;
}

export function sliderDamping(v) {
  damping = 0.05 * v * v;
}

export function sliderSpread(v) {
  spread = 0.01 * v * v;
}

export function sliderLineWidth(v) {
  lineWidth = 0.5 + (3 * v);
}

// initialize to calm waters.
function initWater() {
  for (var i = 0; i < displayWidth; i++) {
    waterLevel[i] = initialLevel;
    waterSpeed[i] = 0;
  }
}

export function beforeRender(delta) {
  var i, n1, n2;
  
  hueTimer = time(0.1);
  
// periodically drop rocks in our pond  
  frameTimer += delta;
  if (frameTimer > dropInterval) {
    waterSpeed[random(displayWidth)] = 0.1 * random(1+displayHeight / 2);
    dropInterval = random(700);
    frameTimer = 0;
  }
  
// propagate the waves...  
  for (i = 0; i < displayWidth; i++)  {
  
// apply tension and damping to current cell  
    var newSpeed = initialLevel - waterLevel[i];
    waterSpeed[i] += (tension * newSpeed) - (waterSpeed[i] * damping);
    waterLevel[i] += waterSpeed[i];  

// spread the energy around to the nearest neighbors to left... 
    n1 = clamp(i-1,0,maxWidthIndex); n2 = clamp(i-2,0,maxWidthIndex);
    var lWave = spread * (waterLevel[i] - waterLevel[n2]);
    lWave += spread * (waterLevel[i] - waterLevel[n1]);
    waterSpeed[n1] += lWave;  
    waterLevel[n1] += lWave;

// and right.   
    n1 = clamp(i+1,0,maxWidthIndex); n2 = clamp(i+2,0,maxWidthIndex);
    var rWave = spread * (waterLevel[i] - waterLevel[n1]);
    rWave += spread * (waterLevel[i] - waterLevel[n2]);    
    waterSpeed[n1] += rWave;
    waterLevel[n1] += rWave;  
  }
}

export function render2D(index,x,y) {
  var s,b;
  s = y * 1.75;
  x *= displayWidth;
  y *= displayHeight;
  b = (abs(waterLevel[x]-y) < lineWidth) 

  hsv(hue,s,b)
}