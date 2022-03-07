// Sea Star 2D
// Under water, looking up at waves and strange sea creatures
// nearer the surface.   Makes a nice, atmospheric light panel.
//
// MIT License
// Take this code and use it to make cool things!
//
// 10/27/2021 ZRanger1

var timebase,t2,t3;
export var complexity = 1.5;
export var nSides = 7;
export var speed = .75;
var slice = PI / nSides;
var waveScale = 8;    // larger values == more complex waves
var contrast = 0.05;  // smaller values == higher contrast

translate(-0.5,-0.5)
scale(.5,.5)

export function sliderSpeed(v) {
  speed = (4 * v);
}

export function sliderComplexity(v) {
  complexity = 1+(1.5*v);
}

export function sliderReflections(v) {
  nSides = 1+floor(v * 15);
  slice = PI / nSides;  
}

function smoothstep(l,h,v) {
    var t = clamp((v - l) / (h - l), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
  t = timebase * speed; 
  t2 = t * 0.5 * complexity;
  t3 = 4 * sin(t2 * 0.5);
}

export function render2D(index,x,y) {
  var x1,y1,bri;
  var tmp;
  var r,g,b,s;


  // fold coordinate space across our slices
  var angle = atan2(y, x);
  angle = mod(angle, 2.0 * slice);
  
  // rotate image over time
  angle += t3;
  var d = hypot(x,y);
  x1 = 1-(d * cos(angle) * waveScale + t2);
  y1 = d * sin(angle);  
  
  // draw a few iterations of our wave function over a short time interval  
  for (i = 0; i < 3;i++) {
    y1 += sin(x1*(i*complexity) + (t + i/complexity)) * 0.9;
    bri += i * abs(contrast/y1);
  }
 
  bri = smoothstep(0.1,1,min(1,bri));
  hsv(0.55+(bri * 0.1),1,bri);

}