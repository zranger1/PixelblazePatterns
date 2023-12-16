// Gently twinkling star to light your way!
// Requires a mapped 2D display.
//
// MIT License
// 12/13/2023 ZRanger1

// global variables
var speed = 1000;
var timebase = 0;
var t1,t2;
var cosT,sinT;
var outX,outY;

// initialization. Calculate
// sine and cosine for rotation so we 
// don't have to do it on every frame
setRotationAngle(PI / 4)

// UI
export function sliderSpeed(v) {
  speed = 2000 * max(0.005,(1-v));
}

// set angle for subsequent 2D rotation calls
function setRotationAngle(angle) {
  cosT = cos(angle); sinT = sin(angle);
}

// rotate 2D point around coordinate origin
function rotate2D(x,y) {
    outX = (cosT * x) - (sinT * y);
    outY = (sinT * x) + (cosT * y);
}

export function beforeRender(delta) {
  timebase = (timebase + delta/speed) % 3600;
  
  resetTransform();
  translate(-0.5,-0.5);   
  
  // slow rotation just makes it look better
  rotate((timebase / 8) % PI)

  // use perlin noise to make it twinkle  
  n = perlin(timebase, 0.333, 0.666,PI2);
  t1 = 0.25 * n;
  t2 = 0.4 * n;
}

// minkowski distance is a generalization of the normal distance formula
// instead of sqrt( a^2+b^2 ), we use the nth root of (a^n + b^n)
// for n == 1, it is equivalent to Manhattan distance
// for n == 2, it is equivalent to Euclidean distance
// as n approaches infinity, it becomes Chebyshev distance
//
// the interesting thing from our perspective, is that if n is
// between 0 and 1, it's a really easy way to make a 4-pointed star!
// 
// this pattern draws two of them, rotated by 45 degrees.
function minkowskiDistance(x1,y1,p) {
  return pow(pow(abs(x1), p) + pow(abs(y1), p),1.0 / p);
}

export function render2D(index,x,y) {
  // draw the vertical/horizontal oriented rays
  var b = min(1, (0.4+t1) / minkowskiDistance(x,y,0.535));
  b = b * b * b * b * b;
  
  rotate2D(x,y);
  
  // draw the diagonal rays
  c = min(1, 0.345 / minkowskiDistance(outX,outY,0.35-t2));  
  c = c * c * c * c;
  
  // normalize everything back to [0,1] range
  b = (b + c)/2;

  // draw star in cyan/blue w/some desaturation towards the middle
  hsv(0.56,1.8-b,b);
}