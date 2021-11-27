// Ripple tank with two animated wave generators
//
// 10/31/2021 ZRanger1

var timebase = 0;
var x1 = y1 = x2 = y2 = 0;

export var speed = 6;
export var waveScale = 26;
export var attenuation = 0.08;
var theta = 0;

// Slider UI
export function sliderSpeed(v) {
  speed = 0.1+(15*v);
}

export function sliderWavelength(v) {
  waveScale = 1+(29*v);
}

// how quickly the waves die down
export function sliderAttenuation(v) {
  attenuation = (v * v *v);
}

// move coordinate origin to center of display.
translate(-0.5,-0.5);

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 1000;
  t1 = timebase * speed;
  
  // make two point wave sources that circle the edge of the 
  // display in opposite directions. 
  theta = (theta + 0.02) % PI2;
  x1 = 0.575 * cos(theta); y1 = 0.575 * sin(theta);
  t2 = PI2 - theta;
  x2 = 0.575 * cos(t2); y2 = 0.575 * sin(t2);  
}

export function render2D(index,x,y) {
  var nx,ny,nz;
  nx = 0; ny = 0;

  // source 1 (x1,y1)
  // TODO - using exp() to calculate wave decay actually doesn't slow us down too
  // much, but I should probably do something more efficient eventually.
  qx = (x- x1) * waveScale; qy = (y-y1) * waveScale;
  r = hypot(qx,qy);
  tmp = (sin(r-t1)*.02-cos(r-t1))*exp(-r*attenuation)/r
  nx += qx * tmp; ny += qy * tmp;
  
  // source 2 (x2,y2)
  qx = (x- x2) * waveScale; qy = (y-y2) * waveScale;
  r = hypot(qx,qy);
  tmp = (sin(r-t1)*.02-cos(r-t1))*exp(-r*attenuation)/r
  nx += qx * tmp; ny += qy * tmp;  

  // Lighting! Generate a little highlighting on the edges 
  // of the waves just because we can.
  // normalize n and modify brightness based on angle to light source
  tmp = hypot3(nx,ny,1);
  nx /= tmp; ny /= tmp; nz = 1/tmp;
  s = clamp(nx * -0.1826 + ny * 0.3651 + nz * 0.90218,0,1);

  // sssssssssss...  you'd think it's a snake!
  // but this is still way faster than pow(s,8)
  hsv(0.6667-(0.02*s),1.9-s,s * s * s * s * s * s * s * s);
}
