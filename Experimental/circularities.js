// Circularities, or the Rolling Donut  
// MIT License
//
// 3/5/2022 ZRanger1

var width = 0.05;

function smoothstep(l,h,v) {
    var t = clamp((v - l) / (h - l), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}

function circle(u,v,radius,cx,cy) {
    var r = hypot(u-cx,v-cy);
    r = abs(r-radius);
    r = smoothstep(width+width,0, r);
    return r;
}

function ringer(u,v) {
  var a = 0;
  var radius = 0.8;
  cx = 0; cy = 0;
  var dec = radius * 0.25;
  
  for (var i = 1; i < 5;i++) {
    cx = dec * sin(2 * timebase + i);
    cy = dec * cos(timebase+i);
    a += circle(u,v,radius,cx,cy);
    radius -= dec;
  }
  return a;
}


var bri;
var timebase = 0;
var t1;
export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
  t1 = time(0.1);
}

translate(-0.5,-0.5);
export function render2D(index,x,y) {
  hue = hypot(x,y);
  bri = ringer(x,y);
  hsv(hue-t1,1,bri);
}