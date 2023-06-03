// Radial rainbow for 2D displays
// initial circle/rainbow code by @zranger1
// modified for sound by @scruffynerf

export var speed = 0.5
export var direction = 1
export var size = 100
export var spin = 1
export var spincycle = 0
export var spincyclearray = 0

export var frequencyData
export var angle

// UI sliders

// higher is faster
export function sliderSpeed(v) {
  speed = 1-v;  
}

// left = inward, right = outward
export function sliderDirection(v) {
  direction = (v < 0.5) ? 1 : -1;  
}

// sizing
export function sliderSize(v) {
  size = 200*v
}

// spin
export function sliderSpin(v) {
  spin = v
}

// pythagorean distance from center of display.  Pixelblaze
// provides normalized x,y coords, so center is always going
// to be (0.5,0.5) regardless of real world display dimensions
function getRadius(x, y) {
  x -= 0.5; y -= 0.5;
  return sqrt(x*x + y*y)*2;
}

// pythagorean angle from center of display.  Pixelblaze
// provides normalized x,y coords, so center is always going
// to be (0.5,0.5) regardless of real world display dimensions
function getAngle(x, y) {
  x -= 0.5; y -= 0.5;    
  angle = floor(((atan2(y,x)+PI)/4)*32)%32
  angle = (angle+spincyclearray)%32;
  return angle;
}

// generate a timer - a sawtooth wave that we can
// use to animate color -- the direction flag makes
// it positive or negative, depending on the UI slider setting
// spin slider controls the spin, currently only one direction
export function beforeRender(delta) {
  t1 = direction * time(0.08 * speed);
  spincycle = (spincycle + spin)%32
  spincyclearray = floor(spincycle);
}

// use radius+angle and timer to color every pixel, if it's loud enough
export function render2D(index, x, y) {
  radius = getRadius(x, y);
  bri = (radius <= frequencyData[getAngle(x,y)]*size) ? 1 : 0.3
  hsv(t1+radius, 1, bri);
}