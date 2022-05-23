// Experiment - Yet another way to make fire!
// Candle flame using distorted circles
//
// MIT License
// 5/20/2022 ZRanger1

function mix(start,end,val) {
  return start * (1-val) + end * val;
}

function smoothstep(l,h,v) {
    var t = clamp((v - l) / (h - l), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}

var t1,s2,t2;
translate(-0.5,-0.5);
scale(1.65,-1);
export function beforeRender(delta) {
  // generate sketchy 3 octave sine wave noise for flame movement
  t1 = -0.875+(wave(time(0.06)) + wave(time(0.03))/2 + wave(time(0.015))/4);
}

export function render2D(index,x,y) {
  // un-translate y so we can make the "flame" move more at top, less at base
  var ny = y + 0.5;
  
  // calculate x displacement value for this y coord
  var s1 = (-0.5+wave(6*y * t1)*ny) * 0.125;
  
  // inner (blue) circle
  x += s1;
  d = abs(hypot(x,y)-0.1)
  s = smoothstep(0.17,0,d);
  
  // outer (orange) circle
  x += s1;  
  d = abs(hypot(x,y)-0.35)
  h = smoothstep(0.0775,0,d);

  r = s * 0.2 + h * 0.9;
  g = s * 0.5 + (h * 0.5 * ny);
  b = s;

  rgb(r,g,b);
}