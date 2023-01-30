/*
 Lava/Surface of the Sun pattern for Lux Lavalier (but also works
 fine on other 2D Pixelblaze displays!)
 
 Uses multiple layers of perlin fbm to create a swirling lava 
 effect.  
 
 MIT License
 
 Take this code and make cool things!
 
 12/15/2022 ZRanger1
*/

export var lineWidth = 1;
export var fill = 0;
export var speed = 0.04;
export var frequency = 1;


// controls wave movement speed
export function sliderSpeed(v) {
  speed = 0.01 + v*v;
}

// returns fbm noise value scaled to the range we need
function fbm(x,y) {
  return 0.5+0.5*perlinFbm(x,y,PI,1.5,0.5,2);
}

// create two noise fields, and use a third to mix them together.
// (this is "normal" in shader land, but probably overkill here)
function pattern(px,py) {
  qx = fbm(px + t1 * .2,py + t1 * .2 + 0.4);
  qy = fbm(px + t1 * .3 + 2.4, py + t1 * 0.3 + 4.8);
  
  rx = fbm(qx - t1 * .3 + 4. * qx + 3,qy - t1 * .3 + 4. * qy + 9);
  ry = fbm(qx + t1 * .2 + 8. * qx + 2.4,qy + t1 * .3 + 4. * qy + 9);
  return fbm(px + rx * 2. - t1 * .09,py + ry * 2. - t1 * .09);
}

function quantize(c, low, hi) {
  c = c - low;
  return c*c*c/(hi-low); 
}

var timebase = 0;
var t1;
export function beforeRender(delta) {
  timebase = (timebase + delta / 1000)  % 3600;
  t1 = timebase * speed;
}

translate (-0.5,-0.5)
export function render2D(index, x, y) {
  var f = pattern(x,y);
  
  r = quantize(f,0,0.35);
  g = quantize(f,0.3,0.55);
  b = quantize(f,0.5,0.8);

  rgb(r,g,b)
}