/*
 New Oasis -- peaceful light dances on water.
 
 Inspired by FASTLEd's Pacifica effect
 
 Use the color picker control to choose color, brightness
 and amount of "white water".
 
 Update of the original Oasis pattern:
   greatly simplified math for smoother performance
   allows you to slow things down to a complete standstill
   decouples wavelength and speed for better control
 
 Version  Author        Date      
 1.0.0    JEM(ZRanger1) 08/21/2021
*/ 

var k1,k2,k3,k4;  
var t1,t2,t3,t4;   
var baseHue = 0.6667;
var sat = 1;
var bri = 0.25;
var minBri = (bri + 0.02) / -2;
export var speed = 0.7;
export var waveLength = 0.43;
export var depth = 0.07;

export function hsvPickerHue(h,s,v) {
  baseHue = h
  sat = s * 2
  bri = v / 4
  minBri = (bri + 0.02) / -2;
}

export function sliderSpeed(v) {
  if (v == 0) {
    speed = 0;
  } else
    speed = max(0.04,1.5*(1-v));
}

export function sliderDepth(v) {
  depth = 0.1*(1-v);
}

export function sliderWavelength(v) {
  waveLength = 2*v*v;
}

export function beforeRender(delta) {
  k1 = waveLength * 11; 
  k2 = waveLength * 15; 
  k3 = waveLength * 7;  
  k4 = waveLength * 5;    
  
  t1 = time(speed *.16);
  t2 = time(speed *.1);
  t3 = time(speed *.14);
  t4 = time(speed *.11);
}

export function render(index) {
  var x,v;
  x = index/pixelCount;
  v =  (wave((k1 * x) - t1) - 0.5) << 1;
  v += (wave((k2 * x) + t2) - 0.5) << 1;
  v += (wave((k3 * x) + t3) - 0.5) << 1;
  v += (wave((k4 * x) - t4) - 0.5) << 1;
  v = v >> 2; 
  hsv(baseHue-(depth * triangle(x+v)), sat-v, max(minBri,v)+bri);
}