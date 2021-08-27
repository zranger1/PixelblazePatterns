/* Snowflake Nova

 Started life as a snowflake generator, but turned into more
 of a psychedelic snowflake kaleidoscope thing...
 
 Simulates the "fold and cut random holes with scissors" snowflake 
 making method, which works in a strange and interesting way
 at the low spatial resolution of LED displays.
 
 Requires a 2D display and appropriate mapping function. Best
 with some sort of diffuser over the display.

 MIT License
 
 Version  Author        Date      
 1.0.0    JEM(ZRanger1) 06/26/2021
*/ 

// Basic shape controls
var ITERATIONS = 3;
export var THICKNESS = 0.21;

// user selectable signed distance functions for "cutouts" of various shapes...
export var distanceMode = 0;
var modes = array(3);
modes[0] = (r) =>  max((tmpVec[0] * 0.866025) + (tmpVec[1] * 0.5), tmpVec[1]) - THICKNESS; // hex
modes[1] = (r) => max(tmpVec[0] - THICKNESS, tmpVec[1] - THICKNESS);  // box (rotated 60 degrees)
modes[2] = (r) => hypot(tmpVec[0],tmpVec[1]) - THICKNESS;  // circle

// Chaos, complexity 
export var SHRINK = 0.9;
export var SCALE = 0.5;
export var NARROW = 0.898;
export var SPREAD = 0.42;
export var DECAY = 0.55;

var COMPLEXITY = 50.0;
var VELOCITY = .2;
var minDelta = 0.5 / ITERATIONS;

// Frame buffer
var height = 16;
var width = 16;

var frame = array(width)
for (var i = 0; i < width; i ++) {
  frame[i] = array(height);
}

// Temporary storage for vector functions
var uv = array(2);
var tmpVec = array(2);

// Animation management
var frameTimer = 9999;
export var frameMs = 250;
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
  SCALE = 1 / (2+(11*v));
}

export function sliderShrink(v) {
  SHRINK = v;
}

export function sliderSpread(v) {
  SPREAD = v * v;
}

*/

// 16 bit xorshift PRNG from 
// http://www.retroprogramming.com/2017/07/xorshift-pseudorandom-numbers-in-z80.html
// returns a pseudorandom value between 0 and 1
var xs;
function roll() {
  xs ^= xs << 7
  xs ^= xs >> 9
  xs ^= xs << 8
  return frac(abs(xs / 100));
}

function rollSeed(seed) {
  xs = seed;
}

// 2D rotation of point vector
var cosT = 0;  var sinT = 0;
function rotateVector2D(v) {
    var x = v[0];  var y = v[1];
    v[0] = (cosT * x) + (sinT * y);
    v[1] = (-sinT * x) + (cosT * y);
}

// rotate so point is aligned with nearest hexagon radial
function foldRotate(p) { 
  var a = floor((0.5236 - atan2(p[0],p[1])) / 1.0472) * 1.0472;
  cosT = cos(a); sinT = sin(a);
  rotateVector2D(p)
}

// calculate signed distance from current point to whatever shape
// we have selected for "cutouts".  "SHRINK" allows downscaling
// so more points will be affected.
function signedDistanceHex(p){
  tmpVec[0] = p[0]; tmpVec[1] = p[1];
  
  cosT = cos30;  sinT = sin30;
  rotateVector2D(tmpVec);

  tmpVec[0] = abs(tmpVec[0]) * SHRINK;
  tmpVec[1] = abs(tmpVec[1]) * SHRINK;

  return modes[distanceMode]();
}

// fold and cut...
function doSnowflake() {
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < height; x++) {
      uv[0] =  SCALE * ((x/(width-1)) - 0.5); uv[1] = SCALE * ((y/(height-1)) - 0.5);
      rollSeed(frameSeed);  
      v = 0;      
      for (var i = 0; i < ITERATIONS; i++) {  
        foldRotate(uv);
      
        val = uv[0] *= (NARROW + roll())-roll();
        uv[1] -= (roll() * SPREAD);
      
        var dec = DECAY + roll();        
        uv[0] *= dec; uv[1] *= dec;
      
        var dist = signedDistanceHex(uv);
        v += (dist < 0) * (minDelta+floor((sin(dist * COMPLEXITY)*2.0)+1.0) * VELOCITY);
      }  
      frame[x][y] = (v < 0.01) ? 0 : v;
    } 
  }  
} 

export function beforeRender(delta) {
  frameTimer += delta;

  if (frameTimer > frameMs) {
    frameSeed = random(32761);
    doSnowflake();    
    frameTimer = 0;
  }
}

export function render2D(index,x,y)  {
  var v = frame[x * width][y * height];
  v = v*v*v
  var radius = time(0.06) - hypot(x-0.5,y-0.5);  

  hsv(radius, 1-v/3, v)
}