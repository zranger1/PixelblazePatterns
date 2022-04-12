// Traffic moving around city blocks.
//
//  MIT LICENSE
//
// 4/2/2022 ZRanger1

export var repeats = 4
export var lineWidth = 0.0063;
export var distortion = 0.006;
var xWeight = 0;
var yWeight = 1;
var t1;

// UI 
export function sliderLineWidth(v) {
  lineWidth = mix(0.004,0.01,v*v);
}

export function sliderRepeats(v) {
  repeats = 2+floor(v * 4);
}

// Utilities
function mix(start,end,val) {
  return start * (1-val) + end * val;
}

function smoothstep(l,h,v) {
    var t = clamp((v - l) / (h - l), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}

export function beforeRender(delta) {
  t1 = 10 * time(0.8);
  hue = time(0.08);
  yWeight = distortion*wave(t1);
  xWeight = 1-yWeight;
}

export function render2D(index,x,y) {
  x = x * xWeight + y * yWeight;
  y = y * xWeight + -x * yWeight;
  x = (abs(mod(x * repeats,2) - 1)) << 2;
  y = (abs(mod(y * repeats,2) - 1)) << 2;

  c = lineWidth/sin(t1 * (x+y-1));
  hsv(hue+c* 0.2,1,abs(c))
}
