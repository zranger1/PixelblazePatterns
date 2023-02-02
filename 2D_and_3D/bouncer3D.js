/*
 Bouncer 2D/3D v2
 
 Bounces (up to 20) objects - spheres or square "tiles" - around a 2D or 3D display. 
 Use sliders to set object count, size and speed.  Updated so it can run on 3D objects
 driven by multiple Pixelblazes synchronized with Firestorm.  
 
 Requires a 2D or 3D LED array and appropriate pixel mapper.
 
 MIT LICENSE
 2021-2023 ZRanger1 

*/ 

// Global Variables
var maxBalls = 20;
export var numBalls = 6;
export var ballSize = 0.06;
export var speed = 25;
export var ballSize3D = ballSize * 4 ;
var t1;

var ballShape = 0;  // 0 - round, 1 = square

// array of ball vectors
var balls = array(maxBalls);

// UI
export function sliderBalls(v) {
  numBalls = floor(1 + (v * (maxBalls - 1)));
}

export function sliderSize(v) {
  ballSize = 0.2 * v;
  ballSize3D = ballSize * 4;
}

export function sliderSpeed(v) {
  speed = 100 * v;
  initBalls();
}

export function sliderShape(v) {
  ballShape = (v > 0.5);
}

// allocate memory for ball vectors
function createBalls() {
  for (var i = 0; i < maxBalls; i++) {  
    balls[i] = array(7);
  }
}

// create ball vector with a random position, direction, speed, color
function initBalls() {
  var hue = prng(1);
  for (var i = 0; i < numBalls; i++) {
    var b = balls[i];  
    
    b[0] = prng(1);     // x pos
    b[1] = prng(1);     // y pos
    b[2] = prng(1);     // z pos    
  
    b[3] = prng(speed); // x vec
    b[4] = prng(speed); // y vec
    b[5] = prng(speed); // z vec   
    
    b[6] = hue;
    hue += 0.619033
  }
}

// move balls and bounce them off "walls"
function bounce(delta) {
  for (var i = 0; i < numBalls; i++) {
    var b = balls[i];
    
// move ball    
    b[0] += b[3] * delta;
    b[1] += b[4] * delta;
    b[2] += b[5] * delta;
  
// bounce off walls by flipping vector element sign when we hit.
// If we do hit a wall, we exit early, trading precision
// in corners for speed.  We'll catch it in a frame or two anyway
    if (b[0] < 0) { b[0] = 0; b[3] = -b[3]; continue; } 
    if (b[1] < 0) { b[1] = 0; b[4] = -b[4]; continue; }
    if (b[2] < 0) { b[2] = 0; b[5] = -b[5]; continue; }
  
    if (b[0] > 1) { b[0] = 1; b[3] = -b[3]; continue; }
    if (b[1] > 1) { b[1] = 1; b[4] = -b[4]; continue; }
    if (b[2] > 1) { b[2] = 1; b[5] = -b[5]; continue; }
  }
}

prngSeed(PI2);
createBalls();
initBalls();

var lastTime = 0;
export function beforeRender(delta) {
  t1 = time(54.93) * 100
  delta = t1 - lastTime;
  lastTime = t1;
  bounce(delta);
}

export function render2D(index,x,y) {
  var dx,dy;  
  var s = 1;
  var v = 0;

  for (var i = 0; i < numBalls; i++) {
    if ((dx = abs(balls[i][0] - x)) > ballSize) continue;
    if ((dy = abs(balls[i][1] - y)) <= ballSize) { 
      if (ballShape) {
        v = 1;
      }
      else {
        v = hypot(dx,dy) / ballSize;  v = v * v;
        s = v * 6; 
        v = 1-v;
      }
      h = balls[i][6];      
      break;
    }  
  }
     
  hsv(h, s, v*v*v)
}

export function render3D(index,x,y,z) {
  var dx,dy,dz;  
  var s = 1;  
  var v = 0;

  for (var i = 0; i < numBalls; i++) {
    if ((dx = abs(balls[i][0] - x)) > ballSize3D) continue;
    if ((dy = abs(balls[i][1] - y)) > ballSize3D) continue;
    if ((dz = abs(balls[i][2] - z)) <= ballSize3D) {
      if (ballShape) {
        v = 1;
      }
      else {
        v = (dx + dy + dz) / ballSize3D;  v = v * v;
        s = v * 4; 
        v = 1-v;
      }
      h = balls[i][6];
      break;
    }
  }
     
  hsv(h, s, v)
}
