// adds per shape rotation 

// Global Variables
var maxObjects = 8;
export var numObjects = 4;
export var objectSize = 0.21;
export var speed = 0.18;
var numShapes = 4;
var shapeSdf = array(numShapes)
var shapeCompare = array(2);
var filled = 1;
var lineWidth = 0.04;
var diameter = 2 * objectSize;

shapeCompare[0] = (f) => (abs(f) > lineWidth); // unfilled shapes
shapeCompare[1] = (f) => (f > lineWidth);      // filled shapes

shapeSdf[0] = circle;
shapeSdf[1] = square;
shapeSdf[2] = triangle;
shapeSdf[3] = hexagon;

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

// array of object vectors
var objects = array(maxObjects);

// UI

export function sliderNumObjects(v) {
  numObjects = floor(v * maxObjects);
}

export function sliderSize(v) {
  objectSize = 0.4 * v;
  diameter = 2 * objectSize;
}

export function sliderSpeed(v) {
  speed = v;
}

export function sliderFilled(v) {
  filled = (v >= 0.5);
}

// allocate memory for object vectors
function createObjects() {
  for (var i = 0; i < maxObjects; i++) {  
    objects[i] = array(10);
  }
}

// create object vector with a random position, direction, speed, color
function initObjects() {
  var hue = random(1);
  for (var i = 0; i < maxObjects; i++) {
    var b = objects[i];  
    
    b[0] = random(1);     // x pos
    b[1] = random(1);     // y pos

    b[2] = random(0.2);  // x velocity
    b[3] = random(0.2);  // y velocity

    b[4] = hue;           // color
    b[5] = i % numShapes; // shape
    b[6] = (-1+random(2))*PI2  // rotation rate (radians/sec)
    b[7] = 0;             // current rotation angle
    // b[9] is sin(b[7]);
    // b[10] is cos(b[7]);
    
    hue += 0.619033
  }
}

// move objects and bounce them off "walls"
function bounce(delta) {
  var theta;
  delta = delta / 1000;  // convert to seconds;
  
  for (var i = 0; i < numObjects; i++) {
    var b = objects[i];
    
// move object
    b[0] += b[2] * speed;
    b[1] += b[3] * speed;
    
// handle object rotation
   b[7] = (b[7] + b[6] * delta) % PI2;
   b[8] = sin(b[7]); b[9] = cos(b[7]);

// bounce off walls by flipping vector element sign when we hit.
    if (b[0] < 0) { b[0] = 0; b[2] = -b[2]; continue; } 
    if (b[1] < 0) { b[1] = 0; b[3] = -b[3]; continue; }

    if (b[0] > 1) { b[0] = 1; b[2] = -b[2]; continue; }
    if (b[1] > 1) { b[1] = 1; b[3] = -b[3]; continue; }
  }
}

createObjects();
initObjects();

var t1;
export function beforeRender(delta) {
  bounce(delta);
}

export function render2D(index,x,y) {
  var d,x1,y1,px,py;
  var v = 0;

  for (var i = 0; i < numObjects; i++) {
    obj = objects[i];  
    x1 = x - obj[0]; y1 = y - obj[1];

    px = obj[9] * x1 - obj[8] * y1;
    if (abs(px) > objectSize) continue;
    py = obj[8] * x1 + obj[9] * y1;
    if (abs(py) > objectSize) continue;    
    
    d = shapeSdf[obj[5]](px,py,objectSize);
    if (shapeCompare[filled](d)) continue;
    
    v = abs(d)/objectSize;
    s = 1.4-v;        
    v = diameter+d    
    h = d+obj[4];      

    break;
  }
     
  hsv(h, s, v)
}