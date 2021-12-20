// Quick and dirty white balancing for hsv patterns
//
// 11/29/2021  ZRanger1

// call this function at pattern initialization with the RGB values
// that produce the best white on your display.
// Input values should be in the range 0.0 to 1.0 or very
// strange things will happen.
export var rBal = 1;
export var gBal = 1;
export var bBal = 1;
function setWhite(r,g,b) {
  rBal = 1-r;
  gBal = 1-g;
  bBal = 1-b;
}

// call this in your pattern instead of the default hsv()
// simple, quick HSV to RGB algorithm adapted from random GLSL
function hsv_balanced(h,s,v) {
  var r,g,b,cv,k;

  h *= 6;
  k = v * s;
  cv = 1-s; cv *=cv;
  
  r = (h+5) % 6;
  r = v - k * max(min(min(r,4-r),1),0);
  
  g = (h+3) % 6;
  g = v - k * max(min(min(g,4-g),1),0);
  
  b = (h+1) % 6;
  b = v - k * max(min(min(b,4-b),1),0);
  
  r -= (rBal * cv); 
  g -= (gBal * cv);
  b -= (bBal * cv)
  
  rgb(r,g,b);
}

// change the values in the call to setWhite to
// what looks best on your system.
setWhite(0.5,1,1)

export function beforeRender() {
  ;
}

// shows full LED white on first half of display,
// "balanced" white on second half.
export function render(index) {
  p = index/pixelCount;
  h = 0
  s = 0
  v = 1
  if (p < 0.5) {
    hsv(h, s, v)
  }
  else {
    hsv_balanced(h,s,v);
  }
}