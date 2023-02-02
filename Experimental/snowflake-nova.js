/* Snowflake Nova

 Started life as a random snowflake generator, but turned into more
 of a ridiculously complicated psychedelic snowflake mandela thing...
 
 Simulates the "fold and cut random holes with scissors" snowflake 
 making method, which works in a strange and interesting way
 at the low spatial resolution of LED displays.
 
 Requires a Pixelblaze 3 with 2D display and appropriate mapping
 function. Best with some sort of diffuser over the display.
 
 MIT License
 
 Version  Author        Date      
 1.1.0    JEM(ZRanger1) 01/31/2023
*/ 

// Basic shape controls
var ITERATIONS = 3;
export var THICKNESS = 0.21;

// user selectable signed distance functions for "cutouts" of various shapes...
export var distanceMode = 0;
var modes = array(3);
modes[0] = (r) =>  max((outX * 0.866025) + (outY * 0.5), outY) - THICKNESS; // hex
modes[1] = (r) => max(outX - THICKNESS, outY - THICKNESS);  // box (rotated 60 degrees)
modes[2] = (r) => hypot(outX,outY) - THICKNESS;  // circle

// Chaos, complexity 
export var SHRINK = 0.9;
export var SCALE = 0.5;
export var NARROW = 0.858;
export var SPREAD = 0.42;
export var DECAY = 0.55;

var COMPLEXITY = 50.0;
var VELOCITY = .2;
var minDelta = 0.5 / ITERATIONS;

// Temporary storage for vector functions

var outX,outY;

// Animation management
var frameTimer = 9999;
export var frameMs = 333;
var frameSeed = random(32761);

// precalculated sin and cos angles for frequently used angles
var sin30 = sin(0.5236);
var cos30 = cos(0.5236);

export function sliderSpeed(v) {
  frameMs = 100+(v * 2000);
}

// pick a signed distance function shape for cutouts
export function sliderDistanceMode(v) {
  distanceMode = floor(0.5 + v * 2)
}

// Uncomment the block below for "Advanced" UI, but be warned,
// some of these parameters are very sensitive, and changes may not result
// in an attractive or even reasonable display.
/*
export function sliderNarrow(v) {
  NARROW = 4 * v;
}

export function sliderDecay(v) {
  DECAY = 4*v;
}

export function sliderThickness(v) {
  THICKNESS = v * v;
}

export function sliderScale(v) {
  SCALE = .01+2*v;
}

export function sliderShrink(v) {
  SHRINK = 2*v;
}

export function sliderSpread(v) {
  SPREAD = v * v;
}
*/

// rotate so point is aligned with nearest hexagon radial
function foldRotate(x,y) { 
  var a = floor((0.5236 - atan2(x,y)) / 1.0472) * 1.0472;
  cosT = cos(a); sinT = sin(a);
  outX = cosT * x + sinT * y;
  outY = cosT * y - sinT * x;
}

// calculate signed distance from current point to whatever shape
// we have selected for "cutouts".  "SHRINK" allows downscaling
// so more points will be affected.
function signedDistanceHex(x,y){

  cosT = cos30;  sinT = sin30;
  outX = cosT * x + sinT * y;
  outY = cosT * y - sinT * x;

  outX = abs(outX) * SHRINK;
  outY = abs(outY) * SHRINK;

  return modes[distanceMode]();
}

// fold,cut add a little random displacement...
function snowflakeDf(x,y) {
      prngSeed(frameSeed);  
      v = 0;      
      for (var i = 0; i < ITERATIONS; i++) {  
        foldRotate(x,y);
        x = outX; y = outY;
      
        val = x *= (NARROW + prng(1))-prng(1);
        y -= (prng(1) * SPREAD);
      
        var dec = DECAY + prng(1);        
        x *= dec; y *= dec;
      
        var dist = signedDistanceHex(x,y);
        v += (dist <= 0) * (minDelta+floor((sin(dist * COMPLEXITY)*2.0)+1.0) * VELOCITY);
      }  
      return (v < 0.1) ? 0 : v;
} 
var theta;
var tColor;
frameSeed = random(32761);
export function beforeRender(delta) {
  frameTimer += delta;
  tColor = time(0.08);
  

  if (frameTimer > frameMs) {
    frameSeed = random(32761);
    frameTimer = 0;
  }
  theta = (theta + 0.05)  % PI2
  resetTransform();
  translate(-0.5,-0.5);
  rotate(theta);    
  scale(SCALE,SCALE);

}

export function render2D(index,x,y)  {
  var v = snowflakeDf(x,y)
  hsv(tColor+hypot(x,y), 1, v*v*v)
}