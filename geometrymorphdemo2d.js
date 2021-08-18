/* Geometry Morphing Demo 2D

 Smooth transitions between animated geometric shapes.  
 
 This pattern shows how to draw and dynamically modify geometric
 objects using a pixel shader and signed distance functions.  Since this 
 method scales automatically with the number of available processors, it 
 is most often used on GPU-based systems.  It's also very well suited to
 the Pixelblaze's architecture.
 
 For more information, see:
   Basic tutorial on this style of rendering:
     https://www.shadertoy.com/view/Xl2XWt
   Distance functions for many 2D shapes:
     https://iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm

 MIT License
 Take this code and use it to make cool things!
 
 Version  Author        Date      
 1.0.0    ZRanger1 08/09/2021
*/ 

// UI control variables
export var objectSize = 0.4;
export var lineWidth = 0.05;
var filled = 1;

// shape function selection 
var numShapes = 6;
var shapeSdf = array(numShapes)
var shapeCompare = array(2);

// animation control
var shape = 0;
var nextShape = 1;
var hue = 0;
var morphClock = 0;
var wait = 0; 
var lerpPct = 0;

shapeCompare[0] = (f) => (abs(f) > lineWidth); // unfilled shapes
shapeCompare[1] = (f) => (f > lineWidth);      // filled shapes

shapeSdf[0] = circle;
shapeSdf[1] = cross;
shapeSdf[2] = hexStar;
shapeSdf[3] = square;
shapeSdf[4] = triangle;
shapeSdf[5] = hexagon;

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

// UI
export function sliderSize(v) {
  objectSize = 0.4 * v;
}

export function sliderFilled(v) {
  filled = (v >= 0.5);
}

export function sliderLineWidth(v){
  lineWidth = 0.25 * v * v;
}

export function beforeRender(delta) {
  morphClock += delta

// morph to a new shape every other second...
  if (morphClock > 1000) {
    if (!wait) {
      shape = nextShape;                      // set to next shape
      nextShape = (nextShape+1) % numShapes;  
    }
    morphClock = 0;    
    wait = !wait;
  }

  lerpPct = morphClock / 1000;

// rotate entire scene
  theta = PI2 * time(0.1);
  resetTransform();
  translate(-0.5,-0.5);  
  rotate(theta);  
}

export function render2D(index,x,y) {
  var d;
  var v = 0;

  // draw one our shapes, interpolating between two SDFs when switching shapes
  if (wait) {
    d = shapeSdf[shape](x,y,objectSize);
  } else {
    d = shapeSdf[shape](x,y,objectSize) * (1-lerpPct) + shapeSdf[nextShape](x,y,objectSize) * lerpPct;
  }
  
  // fill or just draw boundary based on UI seting.  
  if (!shapeCompare[filled](d)) {;
    v = 1-(d/lineWidth);
    s = 1.5-abs(d)/objectSize
    h = d + time(0.1);      
  }

  hsv(h, s, v*v)
}

