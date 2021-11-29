/* DOOM Fire

 Updated 2D Fire effect, with "enhanced" dragon's breath mode. 
 Now with More, Better fire!  Version 2 has more dramatic flame,
 and an improved wind algorithm. 
 
 The method is inspired by the low-res fire in the prehistoric PSX port of DOOM!
 Details: https://fabiensanglard.net/doom_fire_psx/ It's purely convolution-based 
 fire -- no Perlin or other gradient, value or fractal noise fields. 
 
 Requires a 2D display and an appropriate mapping function.

 MIT License
 
 v2.1    JEM(ZRanger1) 10/10/2021 
*/ 

// display size - enter the dimensions of your display here
var width = 16;
var height = 16;

// array is sized one row larger than display so we can permanently
// store the "source" fire in the last row, and two rows wider so
// we don't have to worry about clipping or wrapping.
var arrayWidth = width + 2;
var arrayHeight = height + 1;
var lastRow = arrayHeight - 1;
var lastCol = width + 1;

// Global variables for rendering
var buffer1 = array(arrayWidth);   // main drawing surface
var buffer2 = array(arrayWidth);   // secondary drawing surface
var pb1, pb2;                      // buffer pointers for swapping

var baseHue = 0;
var baseBri = 0.6;
var maxCooling = 0.275;        // how quickly flames die down  
var dragonMode = 0;           // 0: plain old fire, 1: dragon's breath
var breathTimer;              // dragon's breath cycle time
var wind = 0.50;              // probability of wind direction change. 0 == no wind
var windDirection = 0;        // current wind direction
var frameTimer = 9999;        // accumulator for simulation timer
var simulationSpeed = 60;     // min milliseconds between simulation frames
var perturb = perturbNormal;  // pointer to fn that plays with fire
var desat = 1.3;              // used when calculating how "white" hot pixels get

// UI
export function hsvPickerHue(h,s,v) {
  baseHue = h;
  baseBri = v;
}

export function sliderFlameHeight(v) {
  v = (1-v); v = v * v;
  maxCooling = max(4 * v,0.1);
}

export function sliderWind(v) {
  wind = (v * v) / 2;
  if (wind == 0) windDirection = 0;
}

var lastDragonMode = dragonMode;
export function sliderDragonMode(v) {
  dragonMode = (v > 0.5);
  if (dragonMode == lastDragonMode) return;
  lastDragonMode = dragonMode;
  
  if (dragonMode) {
    perturb = perturbDragonBreath;
  } else {
    initBuffers();
    perturb = perturbNormal;
  }
}

// simulation speed (ms per frame). Adjust to taste
// for your display
export function sliderSpeed(v) {
  simulationSpeed = v * 200;
}

export function sliderWhiteHeat(v) {
  desat = 1.25 + (1-v);
}

// create two buffers for calculation
function allocateFrameBuffers() {
  for (var i = 0; i < arrayWidth; i ++) {
    buffer1[i] = array(arrayHeight);
    buffer2[i] = array(arrayHeight);
  }
  pb1 = buffer1;
  pb2 = buffer2;
}

// set the lowest row to 1 - this is the source of our fire
function initBuffers() {
  for (var i = 0; i < arrayWidth; i ++) {
    pb1[i][lastRow] = 1;
    pb2[i][lastRow] = 1;    
  }
}

function perturbDragonBreath() {
 for (var i = 0; i < arrayWidth; i ++) {
   pb2[i][lastRow] = breathTimer+wave(-.21+(i/arrayWidth));
  }
}

// change the base heat in a slow wave
function perturbNormal() {
 for (var i = 0; i < arrayWidth; i ++) {
   pb2[i][lastRow] = 0.9+wave(triangle(time(0.3))+(i/arrayWidth))/3;
  }
}

function swapBuffers()  {
  var tmp = pb1; pb1 = pb2; pb2 = tmp;
}

// Fire is hottest at the bottom, and "cools" as it rises. Each pixel
// calculates it's value based on the one below it, with allowance for
// the current wind direction.
function doFire() {
  swapBuffers();
  
  if (wind > 0) windDirection = (random(1) < wind) ? floor(random(3)) - 1 : windDirection;

  for (var x = 1; x < lastCol; x++) {

    // cooling effect decreases with height, so very hot particles
    // that don't cool early on get "carried" farther.  It just looks better.
   for (var y = 0; y < lastRow; y++) {
      var r = random(maxCooling) * (y/lastRow);
      var windFx = (abs((lastRow / 2) - y) / lastRow);
      windFx = x + (random(1) < 0.5-windFx) * windDirection;
      pb2[x][y] = max(0,pb1[windFx][y+1] - r);
    }
  }  
}

// Initialization
allocateFrameBuffers();
initBuffers()

export function beforeRender(delta) {
  frameTimer += delta;

  if (frameTimer > simulationSpeed) {
    breathTimer = wave(time(0.1));    
    
    doFire();  
    perturb();

    frameTimer = 0;
  }
}

export function render2D(index, x, y) {
  x = 1+(x * width);  y = y * height;
  bri = pb2[x][y];
  bri = bri * bri * bri;
  hsv(baseHue+((0.05*bri)), desat-bri/4,baseBri * bri);
}