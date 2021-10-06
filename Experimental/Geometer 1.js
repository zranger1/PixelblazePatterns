
// Global Variables
var maxObjects = 4;
var numObjects = 4;
export var objectSize = 0.21;
export var speed = 0.18;
var numShapes = 5;
var shapeSdf = array(numShapes)
var shapeCompare = array(2);
var filled = 1;
export var lineWidth = 0.04;

var theta;

shapeCompare[0] = (f) => (abs(f) > lineWidth); // unfilled shapes
shapeCompare[1] = (f) => (f > lineWidth);      // filled shapes

shapeSdf[0] = circle;
shapeSdf[1] = square;
shapeSdf[2] = triangle;
shapeSdf[3] = hexagon;
shapeSdf[4] = hexStar;

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
  x = abs(x*2); y = abs(y*2); 
  dot = 2 * min(-0.5*x + 0.866025 * y,0);
  x -= dot * -0.5; y -= dot * 0.866025;
  
  dot = 2 * min(0.866025*x + -0.5 * y,0);
  x -= dot * 0.866025; y -= dot * -0.5;
  
  x -= clamp(x, r * 0.5773502692, r * 1.7320508076);
  y -= r;
  result = hypot(x,y);
  return (y > 0) ? result : -result;
}

// array of object vectors
var objects = array(maxObjects);

// UI
export function sliderSize(v) {
  objectSize = 0.4 * v;
}

export function sliderSpeed(v) {
  speed = v;
}

export function sliderFilled(v) {
  filled = (v >= 0.5);
}

export function sliderLineWidth(v){
  lineWidth = 0.25 * v * v;
}

// allocate memory for object vectors
function createObjects() {
  for (var i = 0; i < maxObjects; i++) { 
    objects[i] = array(8);
  }
}

// create object vector with a random position, direction, speed, color
function initObjects() {
  var hue = random(1);
  for (var i = 0; i < numObjects; i++) {
    var b = objects[i];  
    
    b[0] = random(1);     // x pos
    b[1] = random(1);     // y pos

    b[2] = random(0.2);  // x velocity
    b[3] = random(0.2);  // y velocity

    b[4] = hue;           // color
    b[5] = i % numShapes; // shape
    hue += 0.619033
  }
}

// move objects and bounce them off "walls"
function bounce() {
  for (var i = 0; i < numObjects; i++) {
    var b = objects[i];
    
// move object
    b[0] += b[2] * speed;
    b[1] += b[3] * speed;

// bounce off walls by flipping vector element sign when we hit.
    if (b[0] < 0) { b[0] = 0; b[2] = -b[2]; continue; } 
    if (b[1] < 0) { b[1] = 0; b[3] = -b[3]; continue; }

    if (b[0] > 1) { b[0] = 1; b[2] = -b[2]; continue; }
    if (b[1] > 1) { b[1] = 1; b[3] = -b[3]; continue; }
  }
}

createObjects();
initObjects();

export function beforeRender(delta) {
  bounce();
  theta = PI2 * time(0.1);

/*
  resetTransform();
  translate(-0.5,-0.5);  
  rotate(theta);  
  translate(0.5,0.5);
*/  
}

export function render2D(index,x,y) {
  var d;
  var v = 0;

  for (var i = 0; i < numObjects; i++) {
    d = shapeSdf[objects[i][5]](x-objects[i][0],y-objects[i][1],objectSize);
    if (shapeCompare[filled](d)) continue;
    
    v = 1-(d/0.04);
    s = 1.5-abs(d)/objectSize
    h = objects[i][4]-d;      
    break;
  }
     
  hsv(h, s, v*v*v)
}

