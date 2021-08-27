/*
 Animated Voronoi diagram 
 Moves several points around a 2D display, coloring each pixel
 on the display according to the nearest point, with "nearest"
 determined by one of a set of user-selectable methods via the
 "distance method" and "drawing mode" sliders.
 
 *** Yet Another Very Computationally Expensive Pattern! ***
 
 On large displays, be prepared to turn the number of points WAY down, and if you're
 using WS2812 LEDs, set the LED type on your pixelblaze to
 "Buffered (2x rate) WS2812/Neopixel" to avoid running out of time during frame 
 generation.

 Version  Author        Date        Comment
 1.0.0    JEM(ZRanger1) 12/31/2020  MIT License
 1.0.1    "             1/1/2021    Smooth slider operation, bug fixes
*/ 

// array of pointers to distance calculating functions
var numModes = 7;
var distance = array(numModes);

// Distance methods - each uses a different algorithm for calculating distance
// Comments in the actual functions explain how each method works.
// Here are details on the draw modes I think work best w/each method.
distance[0] = euclidean;    // all modes are good, but I like 3 and 5
distance[1] = wavedistance; // try draw modes 2 and 5
distance[2] = deviation;    // draw modes 2 and 5 again
distance[3] = chebyshev;    // draw modes 4 & 5 are interesting
distance[4] = eggcrate;     // recommend draw mode 4
distance[5] = manhattan;    // draw modes 4 and 5
distance[6] = squarewaves;  // draw modes 1 and 5

// array of pointers to pixel drawing functions with varying levels
// of color and brightness manipulation.  Note that not all 
// drawing modes work well with all distance calculators.
// Experiment!!
var numRenderers = 6;
var gamma = array(numRenderers)

gamma[0] = original;   // "plain" renderer
gamma[1] = originalG;  // plain color + gamma correction
gamma[2] = crispyC;    // enhanced color only
gamma[3] = crispyCI;   // color + inverted brightness
gamma[4] = crispyCG;   // color + gamma correction
gamma[5] = crispyCIG;  // color + inverted bri + gamma

// array of vectors for each point
var maxPoints = 8;
var Points = array(maxPoints);

// current settings
export var numPoints = 5;
export var speed = 0.035;
export var drawMode = 0;
export var distMethod = 0;

// UI
export function sliderNumberOfPoints(v) {
  var n;
  n = floor(1 + (v * (maxPoints - 1)));
  if (n != numPoints) {
    numPoints = n;
    initPoints();
  }
}

export function sliderDistanceMethod(v) {
  distMethod = floor((numModes-1) * v);
}

export function sliderDrawingMode(v) {
  drawMode = floor((numRenderers-1) * v);  
}

export function sliderSpeed(v) {
  speed = 0.15 * v;
}

// create vector with a random position, direction, speed and color. 
function initPoints() {

// point/region colors are spaced at equal intervals around the
// hsv circle.
  var h = 0;   
  
  for (var i = 0; i < numPoints; i++) {
    var b = Points[i];  
    
    b[0] = random(1);       // x position 
    b[1] = random(1);       // y position

    b[2] = random(1);   // x velocity
    b[3] = random(1);   // y velocity

    b[4] = h + i/numPoints; // hue
  }
}

// allocate and initialize point descriptors
function createPoints() {
  for (var i = 0; i < maxPoints; i++) {  
    Points[i] = array(5);
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

// straightforward 2D euclidean distance 
function euclidean(x,y) {
    return sqrt((x * x) + (y * y));  
}

// replacing using wave() treats the xy distance as
// an angle and effectively returns its sine as the distance.
function wavedistance(x,y) {
    return wave((x * x) + (y * y));  
}

// "chessboard" distance -- how many moves would it take a king
// to get from one point to the other?
function chebyshev(x,y) {
    return max(abs(x),abs(y));  
}

// distance from mean (0.5238 is calculated mean distance
// between normalized points for a rectangular matrix)
function deviation(x,y) {
    return abs(sqrt((x * x)+(y * y)) - 0.52038);  
}

// manhattan distance -- distance with no diagonals
function manhattan(x,y) {
    return abs(x)+abs(y);
}

// feed dx & dy into an oddly scaled eggcrate surface generator -- crazy!
function eggcrate(x,y) {
    return 1-(0.1*(cos(x * PI2) + sin (y * PI2)))
}

// square wave filter over manhattan distance makes interesting
// "city block" patterns.
function squarewaves(x,y) {
    return square(manhattan(x,y),.75);
}

// render hue with fixed sat and bri
function original(d,hue) {
  hsv(hue,1,1);
}

// render hue with gamma correction
function originalG(d,hue) {
  var bri = 1-d; bri = bri*bri*bri;
  hsv(hue,1,bri)
}

// render with extra color, but no gamma correction
function crispyC(d,hue) {
  hsv(hue+d,1,d)
}

// render with extra color, invert & gamma correct distance
function crispyCI(d,hue) {
  hsv(hue+d,1,1-d);
}

// render with extra color, invert & gamma correct distance
function crispyCIG(d,hue) {
  var bri = 1-d; bri = bri*bri*bri;
  hsv(hue+d,1,bri);
}

// render with extra color & gamma correction
function crispyCG(d,hue) {
  var bri = d * d * d * d;
  hsv(hue+d,1,bri);
}

// initialize animated points
createPoints();

// move the points around the display.
export function beforeRender(delta) {
  bounce();
}

// for every pixel, find the nearest ball by exhaustive search, using
// the distance measuring method specified by mode.
export function render2D(index,x,y) {
  var minDistance,i,r,h,v;
  
  minDistance = 32765;   
  for (i = 0; i < numPoints; i++) {
    r = distance[distMethod](Points[i][0] - x,Points[i][1] - y)
    if (r < minDistance) {
      h = Points[i][4];
      minDistance = r;
    }
  }
  
// draw pixel  
  gamma[drawMode](minDistance,h);
}
