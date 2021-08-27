/*
 Metaballs - blobs of fire that combine and split as
 they move around the display.  
 
 Requires 2D display and appropriate mapping function.

 Version  Author        Date        Comment
 1.0.0    JEM(ZRanger1) 07/30/2021  MIT License

*/ 

// array of vectors for each point
var maxPoints = 8;
var Points = array(maxPoints);

// current settings
export var numPoints = 5;
export var speed = 0.05;
export var splatter = 1.75;

// UI
export function sliderNumberOfPoints(v) {
  var n;
  n = floor(4 + (v * (maxPoints - 4)));
  if (n != numPoints) {
    numPoints = n;
    splatter = 1.5+(numPoints - 4)/7.8;
    initPoints();
  }
}

export function sliderSpeed(v) {
  speed = 0.15 * v;
}

// create control point vectors with random position,
// direction and speed
function initPoints() {
  for (var i = 0; i < numPoints; i++) {
    var b = Points[i];  
    
    b[0] = random(1);   // x position 
    b[1] = random(1);   // y position

    b[2] = -0.5+random(1);   // x velocity
    b[3] = -0.5+random(1);   // y velocity
  }
}

// allocate and initialize control point descriptors
function createPoints() {
  for (var i = 0; i < maxPoints; i++) {  
    Points[i] = array(4);
  }
  
  initPoints();
}

// move points, bouncing them off the "walls" of the display.
function bounce() {
  for (var i = 0; i < numPoints; i++) {
    var b = Points[i];
    
// move point according to velocity component of its vector 
    b[0] += b[2] * speed;
    b[1] += b[3] * speed;

// bounce off walls by flipping vector element sign when we hit.
// If we hit a wall, we exit early, trading precision in
// corners for speed.  We'll catch it in a frame or two anyway
    if (b[0] < 0) { b[0] = 0; b[2] = -b[2]; continue; } 
    if (b[1] < 0) { b[1] = 0; b[3] = -b[3]; continue; }

    if (b[0] > 1) { b[0] = 1; b[2] = -b[2]; continue; }
    if (b[1] > 1) { b[1] = 1; b[3] = -b[3]; continue; }
  }
}

// initialize animated points
createPoints();

// move the control points around the display.
export function beforeRender(delta) {
  bounce();
}

// calculate voronoi distance field -- for every pixel, find the distance
// to the nearest control point, and choose to color (or not) based on the
// minimum distances. 
export function render2D(index,x,y) {
  var minDistance,i,r,h,v;
  
  minDistance = 1;   
  for (i = 0; i < numPoints; i++) {
    r = minDistance * hypot(Points[i][0] - x,Points[i][1] - y) * splatter;
    minDistance = min(r,minDistance);
  }
  
  if (minDistance >= 0.082) {
    rgb(0,0,0);
  } else {
    hsv(0.082-minDistance,1,1.2-(wave(5*minDistance)));
  }
}
