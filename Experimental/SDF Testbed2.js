// Signed Distance Function Testbed
// Paste in your distance function and call it in render2D()

// UI control variables
export var objectSize = 0.4;
export var lineWidth = 0.05;
export var sides = 4;

// Signed distance function goes here...
function signum(a) {
  return (a > 0) - (a < 0)
}

function nSidedPolygon(x,y,r,sides) {
  var x1,y1,bn,he;  
  var an = PI2/sides;
  r -= (sides == 3) * r / 3;
  he = r * tan(0.5*an);

  tmp = -x; x = y; y = tmp;
  var bn = an * floor((atan2(y,x) + 0.5*an)/an);
  c = cos(bn); s = sin(bn);
  x1 = (c * x) + (s * y);
  y1 = (c * y) - (s * x);
  
  return hypot(x1 - r, y1 - clamp(y1,-he,he)) * signum(x1 - r)
}

// UI
export function sliderSize(v) {
  objectSize = 0.4 * v;
}

export function sliderLineWidth(v){
  lineWidth = 0.25 * v * v;
}

export function sliderSides(v) {
  sides = 3+floor(5*v);
}

translate(-0.5,-0.5); 

// set up a timer for a little color shifting
export function beforeRender(delta) {
  t1 = time(0.1);
}

// render object, color determined by distance from boundary
export function render2D(index,x,y) {
  var d = nSidedPolygon(x,y,objectSize,sides);
  hsv(t1-(lineWidth-d), 1, (d <= lineWidth));
}

