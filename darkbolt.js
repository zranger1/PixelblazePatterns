/*
 A bolt of darkness makes its way down the strip, accelerating as it goes.
 User controllable background color, bolt size, speed and direction.

 
 Version  Author        Date        Comment
 1.0.0    JEM(ZRanger1) 10/13/2020 
 
*/

// GLOBAL VARIABLES
var t1;
export var speed = 0.017;
export var size = max(3, pixelCount / 8);
var hue = 0; 
var sat = 1;
var bri = 0.8;
var dir = 0; 

// short functions that calculate the position, speed and acceleration
// of the bolt, in both directions
var modes = array(2);
modes[0] = () => { t1 = pow(time(speed),5) * pixelCount; }  // forward
modes[1] = () => { t1 = (1-pow(time(speed),5)) * pixelCount;};  // reverse

// UI sliders
export function sliderSize(v) {
  size = max(3,pixelCount * (v / 3));
}

export function sliderSpeed(v) {
  speed = max(0.0025,0.1 * (1-v));
}

export function sliderDirection(v) {
  dir = floor(v+0.5);
}

export function hsvPickerColor(h, s, v) {
  hue = h; sat = s; bri = v;
}

// DRAWING
export function beforeRender(delta) {
  modes[dir]();
}

export function render(index) {
  b = clamp(abs((index - t1) / size),0,bri);
  b = b * b * b;
  hsv(hue,sat,b)
}