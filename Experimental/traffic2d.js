// Time-lapse video of traffic moving around city blocks...
//
// Playing around with coordinate distortion, and fractals related to
// the Minsky circle algorithm, I found this by accident.  It's hard to 
// describe, hard to photograph, but hypnotic as heck.
//
// Here's the conversation that got me started in this direction:
//     https://forum.electromage.com/t/minsky-circle-algorithm/1532
//
//  MIT LICENSE
//
// 7/16/2022 ZRanger1

export var repeats = 4
export var lineWidth = 0.007;
export var distortion = 0.006;
var xWeight = 0;
var yWeight = 1;
var t1;

// UI 
export function sliderLineWidth(v) {
  lineWidth = mix(0.004,0.02,v*v);
}

export function sliderRepeats(v) {
  repeats = 2+floor(v * 4);
}

export function sliderTimeDistortion(v) {
   distortion = 0.05 * v*v;
}

// linear interpolator
function mix(start,end,val) {
  return start * (1-val) + end * val;
}

export function beforeRender(delta) {
  t1 = 10 * time(0.8);
  hue = time(0.08);
  yWeight = distortion*wave(t1);
  xWeight = 1-yWeight;
}

export function render2D(index,x,y) {
  x = x * xWeight + y * yWeight;
  y = y * xWeight - x * yWeight;
  x = (abs(mod(x * repeats,2) - 1)) << 2;
  y = (abs(mod(y * repeats,2) - 1)) << 2;

  c = lineWidth/sin(t1 * (x+y-1));
  hsv(hue+c* 0.2,1,abs(c))
}
