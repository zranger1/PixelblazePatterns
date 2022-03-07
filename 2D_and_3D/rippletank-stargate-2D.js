// Ripple tank/Stargate pool
// Ripple tank with two animated wave generators that can be rendered
// inside a user-controlled circle, making it useful for that stargate
// everybody's always wanted to build!
// 
// MIT License
// Take this code and use it to build cool things!
//
// 03/05/2022 ZRanger1

var timebase = 0;
var x1 = y1 = x2 = y2 = 0;

export var speed = 6;
export var waveScale = 26;
export var attenuation = 0.08;
export var poolRadius = 0.54;
var theta = 0;

// UI Sliderws
export function sliderSpeed(v) {
  speed = 0.1+(15*v);
}

export function sliderWavelength(v) {
  waveScale = 1+29*(1-v);
}

// how quickly the waves die down
export function sliderAttenuation(v) {
  attenuation = (v * v *v);
}

export function sliderRadius(v) {
  poolRadius = v;
}

// move coordinate origin to center of display.
translate(-0.5,-0.5);

function smoothstep(l,h,v) {
    var t = clamp((v - l) / (h - l), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 1000;
  t1 = timebase * speed;
  
  // make two point wave sources that circle the edge of the 
  // display in opposite directions. 
  theta = (theta + speed/500) % PI2;
  x1 = 0.575 * cos(theta); y1 = 0.575 * sin(theta);
  t2 = PI2 - theta;
  x2 = 0.25 * cos(t2); y2 = 0.25 * sin(t2);  
}

export var pr;
export function render2D(index,x,y) {
  var nx,ny,nz;

// early out for pixels outside our radius
  pr = poolRadius - hypot(x,y);
  if (pr < 0) {
    rgb(0,0,0);
    return;
  }
  
  nx = ny = 0;

  // wave source 1 (x1,y1)
  qx = (x-x1) * waveScale; qy = (y-y1) * waveScale;
  r = hypot(qx,qy);
  tmp = (sin(r-t1)*.02-cos(r-t1))*exp(-r*attenuation)/r
  nx += qx * tmp; ny += qy * tmp;
  
  // wave source 2 (x2,y2)
  qx = (x-x2) * waveScale; qy = (y-y2) * waveScale;
  r = hypot(qx,qy);
  tmp = (sin(r-t1)*.02-cos(r-t1))*exp(-r*attenuation)/r
  nx += qx * tmp; ny += qy * tmp;  

  // Generate a little highlighting on wave edges 
  // normalize n and modify brightness based on angle to light source
  tmp = hypot3(nx,ny,1);
  nx /= tmp; ny /= tmp; nz = 1/tmp;
  s = clamp(nx * -0.1826 + ny * 0.3651 + nz * 0.90218,0,1);

  // pick a blue/green gradient color based on "height", and draw the
  // region that's inside our radius.
  hsv(0.6667-(0.02*s),1.9-s,smoothstep(0,1,pr/poolRadius)*s*s*s*s);
}
