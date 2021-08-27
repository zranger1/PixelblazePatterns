/* Ice Floes 2D

 A river filled with floating ice!  Uses Voronoi distance to simulate
 blocks of ice drifting and turning in the current.
 
 Requires a 2D display and appropriate mapping function.

 Version  Author     Date        Comment
 1.0.1    ZRanger1   7/30/2021   Faster
*/ 

// animation control
var frameTimer = 9999;
var simulationSpeed = 60;  

// array of vectors for each point
var numPoints = 4;
var Points = array(numPoints);
export var speed = .575;

// UI
export function sliderSpeed(v) {
  speed =  2 * v;
}

// create vectors with random position, direction, speed and color. 
function initPoints() {
  for (var i = 0; i < numPoints; i++) {
    var b = Points[i];  
    
    b[0] = random(1);       // x position 
    b[1] = random(1);       // y position

    b[2] = random(0.02) - 0.05;       // x velocity
    b[3] = 0.015 * (random(1) - 0.5) ; // y velocity
  }
}

// allocate and initialize point descriptors
function createPoints() {
  for (var i = 0; i < numPoints; i++) {  
    Points[i] = array(4);
  }
  initPoints();
}

// move objects
function doRiver(delta) {
  for (var i = 0; i < numPoints; i++) {
    var b = Points[i];
    
// move point according to velocity component of its vector 
    b[0] = frac(b[0] + (b[2] * speed));
    b[1] = frac(b[1] + b[3]);

    // wrap around in the direction of the river's "current"
    if (b[0] < 0) { b[0] = 0.9998; } 
    else if (b[1] < 0) { b[1] = 0.9998;}
    
    // and bounce off the riverbank if we should hit.
    if (b[1] < 0) { b[1] = 0; b[3] = -b[3]; continue; }
    if (b[1] > 1) { b[1] = 1; b[3] = -b[3]; continue; }    
  }
}

function wrappedEuclid(dx,dy) {
  if (dx > 0.5) { dx = 1-dx; }
  if (dy > 0.5) { dy = 1-dy; }
  return hypot(dx,dy);
}

// initialize animated points
createPoints();

export function beforeRender(delta) {
  frameTimer += delta;

  if (frameTimer > simulationSpeed) {
    doRiver(frameTimer);
    frameTimer = 0;
  }  
}

// for each pixel, find the nearest point. We do this exhaustively with no
// attempt to optimize, because we also need to deal with the pixels that are
// about equally close to two or more points.  These pixels become the "cracks"
// in our ice floes.
export function render2D(index,x,y) {
  var minDistance,i,r,h,v;
  
  minDistance = 1;   

  for (i = 0; i < numPoints; i++) {
    // calculate euclidean distance to nearest control point
    r = wrappedEuclid(abs(Points[i][0] - x),abs(Points[i][1] - y));

    if (r <= minDistance) {
        // if distances are very similar, mark boundary pixels by coloring
        // them dark blue.  
      h = (abs(r - minDistance) < 0.12) ? 0.6667 : 0.55 + (r * .15);
      minDistance = r;
    }
  }
  
// draw pixel  
    var bri = 1-minDistance; bri = bri*bri*bri;   
    hsv(h,(h == 0.6667) ? 1 : 1.21-bri,bri)
}
