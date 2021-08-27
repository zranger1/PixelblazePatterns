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

function dot2(x,y) {
  return (x * x + y * y);
}

// dot product of a 2 element vector w/itself
function dot2(x,y) {
  return (x * x + y * y);
}

function hexagon(x,y,r){
     x = abs(x); y = abs(y);
     return  max((x * 0.5 + y * 0.866025),x) - r;
}

function lineSegment(x,y,x1,y1,x2,y2) {
  ax = x - x1; ay = y - y1;
  bx = x2 - x1; by = y2 - y1;
  h = clamp((ax * bx + ay * by)/(bx * bx + by * by),0,1);
  return hypot(ax - bx * h,ay - by * h);
}

function heart(x,y,r) {
  var m;
  x = abs(x);
  y = r-y;
  r *= 2;
  if (x+y>r) {
    return (sqrt(dot2(x - r*0.25,y - r*0.75)) - (r*0.3536));
  } else {
    m = 0.5 * max(x + y,0);
    return sqrt(min(dot2(x,y-1),dot2(x-m,y-m)) * signum(x-y));
  }
}


function pentagon(x,y,r) {
  x = abs(x); 
  rtmp = r * 0.7265;
  
  var dotP = (-0.809 * x + 0.5878 * y) 
  x -= 2*min(dotP,0) * -0.809;
  y -= 2*min(dotP,0) * 0.5857;
  
  var dotP = (0.809 * x + 0.5878 * y)  
  x -= 2*min(dotP,0) * 0.809;
  y -= 2*min(dotP,0) * 0.5857;  
  
  x -= clamp(x,-rtmp,rtmp);
  y -= r;
  return hypot(x,y) * signum(y);
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

function diamond(x,y,r) {
  var tmp;
  x /= 1.414; y /= 1.414;
  tmp = abs(x + y);
  x = abs(x - y);
  y = tmp;
  return max(x,y)/r - 1
}

// parameters are:
// x,y - point being evaluated
// r - radius of gear
// tSize - gear tooth size in world coords
// nTeeth - number of gear teeth.
// Makes reasonably functional stars too!
function gear (x,y,r,tSize,nTeeth) {
  return hypot(x,y)/r + tSize * sin(nTeeth*atan2(y,x)) - 1;
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
//  var d = lineSegment(x,y,-0.2,0,0.41,.41,objectSize);
  d = heart(x,y,objectSize);
  hsv((lineWidth-d), 1, (d <= lineWidth));
}

