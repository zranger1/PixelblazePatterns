/*
 Perlin Kaleidoscope 2D
 
 Uses Pixelblaze's noise functions to generate an "interesting" base
 texture of RGB lines, then generates kaleidoscopic reflections.
 
 Try with Reflections slider set to minimum to see the noise lines!
 
 MIT License
 
 Take this code and use it to make cool things!
 
 12/29/2022 ZRanger1
*/

export var lineWidth = 0.075;
export var speed = 0.5;
export var nSides = 3;
var slice = PI/nSides;  
var outx,outy;

// movement speed
export function sliderSpeed(v) {
  speed = 0.25 + 2 * v * v;
}

// width of base texture lines
export function sliderLineWidth(v) {
  lineWidth = 0.02 + (v * 0.3);
}

// number of kaleidoscope "slices"
export function sliderReflections(v) {
  nSides = 1+floor(6*v);
  slice = PI2 / nSides;
}

// sets up a kaleidoscope effect - makes the image repeat over evenly divided
// rotated "slices" about the center.
function kal(x,y,r,theta) {
  // convert to radial coords, repeat image over each
  // angular "slice" and rotate the slices over time
  var angle = abs(theta + mod(atan2(y,x), slice)-slice);

  // map new rotated coordinates back to original image space
  outx = r * cos(angle);  outy = r * sin(angle);
}

var timebase = 0;
var t1,theta;
export function beforeRender(delta) {
  timebase = (timebase + delta / 1000)  % 3600;
  t1 = timebase * speed;
  theta = PI * t1;
}

translate (-0.5,-0.5)
export function render2D(index, x, y) {
  r = hypot(x,y);  
  if (nSides > 1) { 
    kal(x,y,r,theta); x = outx; y = outy;
  }  
  
  lr = perlinFbm(x,y,t1,1.15,0.15,3);
  lg = perlinFbm(y,x,t1,0.5,0.1,3);
  lb = perlinFbm(t1,x,y,0.25,0.15,3);
  
  r = 2-abs(y - lr) / lineWidth;
  g = 2-abs(y - lg) / lineWidth;
  b = 2-abs(y - lb) / lineWidth;

  rgb(r, g, b);
}