/*
 Color clouds - for helical spiral mapped trees (and other strips too!)
 
 Swirling clouds of fairly traditional tree light
 colors.  No mapping function required.
 
 ZRanger1 12/2022
*/ 

export var speed = 0.7;
export var waveLength = 1.31;
export var contrast = 0.07;

export function sliderSpeed(v) {
  if (v == 0) {
    speed = 0;
  } else
    speed = max(0.04,1.5*(1-v));
}

export function sliderContrast(v) {
  depth = v*v
}

export function sliderClouds(v) {
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
  r = g = b = 0;
  x = index/pixelCount;
  r = wave((k1 * x) - t1);
  g = wave((k2 * x) + t2);
  b = wave((k3 * x) + t3);
  v = depth * (-1+2*wave((k4 * x) - t4));
  r = (r + v)/2
  g = (g + v)/2
  b = (b + v)/2

  
  rgb(r,g,b)
}