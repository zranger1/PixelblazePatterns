// Simple SDF Dancing Christmas Tree
//
// MIT License
// Take this code and use it to make cool things!
//
// 2021 ZRanger1

// UI control variables
export var objectSize = 0.4;
export var lineWidth = 0.1;
export var dance = 0;

export function sliderDance(v) {
  dance = (v >= 0.5);
}


function signum(a) {
  return (a > 0) - (a < 0)
}

// signed distance functions for various shapes, adapted for 2D. 
// Math from https://iquilezles.org/www/articles/distfunctions/distfunctions.htm
function circle(x,y,r) {
  return hypot(x,y) - r;
}

function square(x,y,size) {
  dx = abs(x) - size;  d1 = max(dx,0);
  dy = abs(y) - size;  d2 = max(dy,0);
	return min(max(dx, dy), 0.0) + hypot(d1,d2);
}

function triangle(x,y,r) {
	return max((abs(x) * 0.866025) - (y * 0.5), y) - r / 2;
}

function hexagon(x,y,r){
     x = abs(x); y = abs(y);
     return  max((x * 0.5 + y * 0.866025),x) - r;
}

function hexStar(x,y,r) {
  // rescale to pointy parts of star
  x = abs(x*1.73205); y = abs(y*1.73205); 
  dot = 2 * min(-0.5*x + 0.866025 * y,0);
  x -= dot * -0.5; y -= dot * 0.866025;
  
  dot = 2 * min(0.866025*x + -0.5 * y,0);
  x -= dot * 0.866025; y -= dot * -0.5;
  
  x -= clamp(x, r * 0.57735, r * 1.73205);
  y -= r;
  return signum(y) * hypot(x,y) / 1.73205;
}

// interior distance on this is slightly weird. Still
// looking for a reasonable fix.
function cross(x,y,size) {
  x = abs(x); y = abs(y);
  
  if (y > x) { tmp = x; x = y; y = tmp; }
  qx = x - size; qy = y - size / 5;
  k = max(qy,qx);
  if (k > 0) {
    wx = max(qx,0); wy = max(qy,0);
    return hypot(wx,wy);
  } else {
    wx = max(size - x,0); wy = max(-k,0);
    return -hypot(wx,wy);
  }
}

function tree(x,y,r) {
  var d = triangle(x,y+.225,r*0.175);
  d = min(triangle(x,y,r*0.3),d);
  d = min(triangle(x,y-.2,r*.5),d);
  d = min(square(x,y-0.47,r*0.01),d)
  return d;
}

translate(-0.5,-0.5);

var t1, timebase;
export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 1000;
  t1 = timebase * 10;
}

export function render2D(index,x,y) {
  var d,radius,th;
  var v = 0;
  
  // Introduce a sinewave "wiggle" along the x axis. 
  // Caution: This is neither subtle nor tasteful!
  if (dance) {
    radius = 1.2-hypot(x,y)*2.4;
    th = radius * radius * sin(radius + t1);
    x = (cos(th) * x) - (sin(th)* y);      
  }

  d = tree(x,y,objectSize);
  v = 1-(d/lineWidth);  
  h = (y < 0.41) ? 0.3333 : 0.0124;

  hsv(h, 1, v)
}

