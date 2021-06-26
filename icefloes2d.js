/* Ice Floes 2D

 A river filled with floating ice!  Uses Voronoi distance to simulate
 blocks of ice drifting and turning in the current.
 
 Requires a 2D display and appropriate mapping function.

 Version  Author        Date        Comment
 1.0.0    JEM(ZRanger1) 6/17/2021   MIT License
*/ 

// array of vectors for each point
var crackWidth = 0.12;
var maxPoints = 8;
var Points = array(maxPoints);

var frameTimer = 9999;
var simulationSpeed = 60;  

// current settings
var numPoints = 4;
export var speed = 0.7;

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

    b[2] = random(0.02) - 0.05;  // x velocity
    b[3] = random(.02) - random(0.02);   // y velocity

    b[4] = 0.55 // hue
  }
}

// allocate and initialize point descriptors
function createPoints() {
  for (var i = 0; i < maxPoints; i++) {  
    Points[i] = array(5);
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
  crackWidth = .08 + (.12 * triangle(time(.3)));
  
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
  
  minDistance = 32765;   

  for (i = 0; i < numPoints; i++) {
    // calculate euclidean distance to nearest control point
    r = wrappedEuclid(abs(Points[i][0] - x),abs(Points[i][1] - y));

    if (r <= minDistance) {
        // if distances are very similar, mark boundary pixels.
      if (abs(r - minDistance) < crackWidth) {
        h = 0.6667;  // tag pixel as a potential "crack"
      } else {
        h = Points[i][4];
      }
      minDistance = r;
    }
  }
  
// draw pixel  
    var bri = 1-minDistance; bri = bri*bri*bri;   
    hsv(h,(h == 0.6667) ? 1 : bri,bri)

}
