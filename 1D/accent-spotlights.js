// Display multiple independent "spotlights" that you can position and focus 
// to highlight your art, architecture, landscaping, etc... 
//
// To disable the background lighting, or any individual spotlight,
// set its color to black.  Spotlights can overlap - their colors will be blended.
// To add more lights, just change <nLights> and add the controls you need.
// 
// 2024 ZRanger1

// storage for light info
var nLights = 5;                // number of "spotlights"
var Lights = array(nLights);

// indices of light control information
var _r = 0;
var _g = 1;
var _b = 2;
var _pos = 3;
var _sharp = 4;

// storage for light info
var nLights = 5;
var Lights = array(nLights);
var focusMax = 0.1;

// RGB background color
export var bg_r = 0;
export var bg_g = 0;
export var bg_b = 0;

function initLightInfo() {
  for (var i = 0; i < nLights; i++) {
    light = array(5);
    light[_r] = 0.5;
    light[_g] = 0.4;
    light[_b] = 0.3;
    light[_pos] = 0.1+0.8*(i / (nLights-1));
    light[_sharp] = .03;
    Lights[i] = light;
  }
}

// control sets for individual lights 
export function rgbPicker_1(r, g, b) { Lights[0][_r] = r; Lights[0][_g] = g; Lights[0][_b] = b;}
export function sliderPosition_1(v) { Lights[0][_pos] = v; }
export function sliderFocus_1(v) {  Lights[0][_sharp] = 0.004 + (focusMax * v * v); }

export function rgbPicker_2(r, g, b) { Lights[1][_r] = r; Lights[1][_g] = g; Lights[1][_b] = b;}
export function sliderPosition_2(v) { Lights[1][_pos] = v; }
export function sliderFocus_2(v) {  Lights[1][_sharp] = 0.004 + (focusMax * v * v); }

export function rgbPicker_3(r, g, b) { Lights[2][_r] = r; Lights[2][_g] = g; Lights[2][_b] = b;}
export function sliderPosition_3(v) { Lights[2][_pos] = v; }
export function sliderFocus_3(v) {  Lights[2][_sharp] = 0.004 + (focusMax * v * v); }

export function rgbPicker_4(r, g, b) { Lights[3][_r] = r; Lights[3][_g] = g; Lights[3][_b] = b;}
export function sliderPosition_4(v) { Lights[3][_pos] = v; }
export function sliderFocus_4(v) {  Lights[3][_sharp] = 0.004 + (focusMax * v * v); }

export function rgbPicker_5(r, g, b) { Lights[4][_r] = r; Lights[3][_g] = g; Lights[3][_b] = b;}
export function sliderPosition_5(v) { Lights[4][_pos] = v; }
export function sliderFocus_5(v) {  Lights[4][_sharp] = 0.004 + (focusMax * v * v); }

// background color
export function rgbPickerBackground (r, g, b) {
  
  // adjust for bug in rgb picker -- it won't let you select
  // full black.  NOTE: Remove this code when it's fixed in firmware
  if ((r < 0.01) && (g < 0.01) && (b < 0.01)) {
    r = g = b = 0;
  }
  
  bg_r = r; bg_g = g; bg_b = b;
}

initLightInfo();

export function render(index) {
  var r = bg_r;
  var g = bg_g;
  var b = bg_b;
  var c = index/pixelCount
  
  for (i = 0; i < nLights; i++) {
    var k = Lights[i];
    var d = abs(c-k[_pos]) / k[_sharp]
    
    if (d < 1) {
      d = 1-d; d = d * d * d;
      r += k[_r]*d;
      g += k[_g]*d;
      b += k[_b]*d;
    }
  }
  
  rgb(r,g,b);
}
