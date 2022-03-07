// Water Caustics 
// Bright patterns made by light bouncing around and through the
// curves made by ripples on the water's surface.  
//
// MIT License
// Take this code and use it to make cool things!
//
// 1/27/2022 ZRanger1

var timebase = 0;

export var contrast = 1/24;
export var whiteLevel = 1.125;
export var speed = 3.5;

export function sliderSpeed(v) {
  speed = 1 + 8*v;
}

export function sliderWhiteLevel(v) {
  whiteLevel = 0.8 + (1-v)
}

export function sliderContrast(v) {
  contrast = 1/(16+24*v);
}


export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 1000;
  t1 = timebase / 6;
}

export function render2D(index,x,y) {
  var px,py,ix,iy,c;
  
  // scale coords to work well as angles for sin/cos
  px = x * PI2 - 20;  py = y * PI2 - 20;
  ix = px; iy = py;
  c = 1;

  // build a couple of lumpy circular "waves"
  var t = t1 * (1-speed);
  tmp = px + cos(t - ix) + sin(t + iy); 
  iy = py + sin(t - iy) + cos(t + ix);
  ix = tmp;

  c += 1/hypot(px/sin(t + ix)*contrast, py/cos(t + iy)*contrast)

  var t = t1 * (1-speed/2);
  tmp = px + cos(t - ix) + sin(t + iy); 
  iy = py + sin(t - iy) + cos(t + ix);
  ix = tmp;

  c += 1/hypot(px/sin(t + ix)*contrast, py/cos(t + iy)*contrast)
  
  // scale, gamma correct and draw!
  c = 1.65-sqrt(c/2);
  c = c * c * c * c;
  c = clamp(c,0,1);
  
  hsv(0.6667- (0.3 * c),whiteLevel-c,c)
  
}