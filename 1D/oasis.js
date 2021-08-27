/*
 Oasis -- peaceful light dances on waves.
 
 A quiet space to rest and reflect on what we've 
 lost in this strangest of years, and to remember
 the beauty that remains, and the tasks that 
 must still be begun and finished...
 
 Inspired by FASTLEd's Pacifica effect

 Version  Author        Date        Comment
 1.0.0    JEM(ZRanger1) 10/20/2020 
 1.0.1    JEM(ZRanger1) 11/27/2020  Updated wavelength scaling method
 1.0.2    JEM(ZRanger1) 11/30/2020  Fixed phase offset bug
*/ 

// constant wave descriptor array indices.
// !!!Be extremely careful when changing or adding indices to this list!!!
// Not used in beforeRender() or render() -- it makes enough of a performance
// difference here to matter.  Static numbers are a hair faster.
var _speed = 0;        // base wave movement speed 
var _direction = 1;    // direction - 0 = down, 1 = up
var _divisor = 2;      // wavelength divisor 
var _tSpeed = 3;       // speed timer;
var _cSpeed = 4;       // current speed, based on UI slider
var _cWlen = 5;        // current wavelength divisor

var descriptorSize = 6;

// wave descriptors
var layer1 = array(descriptorSize);
var layer2 = array(descriptorSize);
var layer3 = array(descriptorSize);
var layer4 = array(descriptorSize);

// brightness adjustment lookup table
var gamma = array(512);

// UI control variables
export var speed = 1;
export var whiteCaps = 1.46; 
export var depth = 0.65;
export var aura = 0.66667
export var wavelenScale = 1

var baseHue;  

// UI functions
export function sliderHue(v) {
  aura = v
}

export function sliderSpeed(v) {
  speed = 1.5+(4.5 * (1-v))
}

export function sliderWhitecaps(v) {
  whiteCaps = 1+(1-v);
}

export function sliderDepth(v) {
  depth = (1-v);
}

export function sliderWavelength(v) {
  wavelenScale = 0.15+(2 * (1-v));
  setup();
}

// short functions that calculate brightness for a waveform moving
// in either direction
function waveReverse(n) {
  return 1-time(n);
}  
function waveForward(n) {
  return time(n);
}

// calculate sum of all waves at a pixel.  Returns averaged and
// gamma corrected value. 
function gammatron(index) {
  var v,n;
  n = ((index + layer1[3]) * layer1[5]) / pixelCount;
  v = gamma[511 * abs(n % 1)];
  
  n = ((index + layer2[3]) * layer2[5]) / pixelCount;
  v += gamma[511 * (n % 1)];

  n = ((index + layer3[3]) * layer3[5]) / pixelCount;
  v += gamma[511 * (n % 1)];

  n = ((index + layer4[3]) * layer4[5]) / pixelCount;
  v += gamma[511 * (n % 1)];
  
  return v / 4;
}  

// make sure that the overall wave density stays about
// the same regardless of strip size
function scaleWaveToStrip(divisor) {
  return  divisor * (pixelCount / 150);
}

// makes sure movment speed stays about the same no matter
// how many LEDs we're displaying
// Param <seconds> - number of seconds to traverse the strip.
function scaleSpeedToStrip(seconds) {
  return (seconds / 65.356) * (pixelCount / 150);
}

function initWave(w,spd,dir,divisor) {
  w[_speed] = scaleSpeedToStrip(spd * speed);
  w[_direction] = (dir) ? waveForward : waveReverse;
  w[_divisor] = divisor * wavelenScale;
  w[_cSpeed] = w[_speed];
  w[_cWlen] = w[_divisor];
}

// configure wavelengths and speeds  
function setup() {
  initWave(layer1,10, 1, 21);
  initWave(layer2,6,  1, 9);
  initWave(layer3,15, 0, 11);
  initWave(layer4,22, 0, 5);  
}

// initialize gamma lookup table
for (var i = 0; i < 512; i++) {
  gamma[i] = pow(wave(0.25+(i / 512)),4);
}

// initialize all waves
setup();

export function beforeRender(delta) {
    var t = triangle(time(0.3))

    layer1[3] = pixelCount * layer1[1](layer1[4]); 
    layer2[3] = pixelCount * layer2[1](layer2[4]);
    layer3[3] = pixelCount * layer3[1](layer3[4]);
    layer4[3] = pixelCount * layer4[1](layer4[4]); 
    layer4[5] = layer4[2] * (0.9 + ( t * 0.2))    

    baseHue = aura + (0.02 * t);
}

export function render(index) {
  var h,s,v;

// calculate brightness for this pixel  
  v = gammatron(index);
  h = baseHue - (depth * v * 0.3);  
  s = whiteCaps - v;
  
  hsv(h, s, v)
}
