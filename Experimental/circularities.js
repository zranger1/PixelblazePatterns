// Circularity 2D
// Kind of like a Bond movie intro...
//
// MIT License
//
// 3/09/2022 ZRanger1

export var speed = 1;
var width = 0.05;
var bri;
var timebase = 0;
var t1;
var colorTime;

export function sliderSpeed(v) {
  speed = 0.5+v*3;
}

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
    cx = dec * sin(2 * t1 + i);
    cy = dec * cos(t1+i);
    a += circle(u,v,radius,cx,cy);
    radius -= dec;
  }
  return a;
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
  t1 = timebase * speed;
  colorTime = time(0.1);
}

translate(-0.5,-0.5);
export function render2D(index,x,y) {
  hue = hypot(x,y);
  bri = ringer(x,y);
  hsv(hue-colorTime,1,bri);
}