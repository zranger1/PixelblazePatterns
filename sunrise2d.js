/* 2D Sunrise/solar activity simulator

 Move the slider to see the sunrise again!

 Requires a 2D LED array and appropriate pixel mapper.
 
 MIT License
 
 Version  Author        Date      
 1.0.0    JEM(ZRanger1) 04/04/2021
*/ 

// display size - enter the dimensions of your matrix here
var width = 16;
var height = 16;
var centerX = (width-1) / 2;
var centerY = (width-1) / 2;

// Global variables for rendering
var sunDiameter = 5.79
var sunMask = array(pixelCount);  // holds precalculated brightness data for sun
var frameBuffer = array(height);  // main drawing surface
var frameTimer = 9999;            // accumulator for simulation timer

// Indices for particle data array
var _x = 0;   
var _y = 1;
var _dx = 2;
var _dy = 3;
var _hue = 4;

// particle system parameters
var MAX_PARTICLES = 32;     
var numParticles = 26;
var gravity = -155;       // gravitational acceleration constant
var drift;                // allows the center of gravity to "wobble" slightly
var sunRise = (height - 1);
var speed = 80;           // milliseconds between simulation frames
var C = 3.25;             // local speed of light. 
var r1,r2,t1;             // timers and waves for animation
 
// we need two particle buffers so we can calculate every particle's
// instantaneous effect on every other particle. Instead of copying,
// we swap pointers on each frame.
var pb1 = array(MAX_PARTICLES);  
var pb2 = array(MAX_PARTICLES);
var particles,work_particles;

// we "stage manage" the sunrise by switching between several
// different beforeRender functions during the run.
var preRender = doSunrise;

// Moving this slider makes the sun rise!
export function sliderMakeTheSunRise(v) {
  preRender = doFadeout;
}

// precompute brightness mask for the sun.  This
// saves us from having to compute distance for all
// the sun's pixels on every frame
function initSunMask() {
  for (var i = 0; i < pixelCount; i++) {
    var x = i % width;
    var y = floor(i / width);
    x = centerX - x; y = centerY - y;
    var dx = sqrt(x*x + y*y);
    dx = (dx < sunDiameter) * (1-(dx / sunDiameter)); 
    sunMask[i] = dx;
  }
}

// draws the sun on the frame buffer, modeling surface activity
// with an additive sine wave plasma.  This function also
// manages "sunrise" by allowing you to offset the sun's
// position in the Y direction.
function renderSunMask() {
  for (var y1 = 0;y1 < height; y1++) {
    if ((y1+sunRise) >= height) break;    
    for (var x1 = 0; x1 < width; x1++) {
      var v2 = sunMask[x1 + (y1 * width)];
      if (v2) {
        var x = x1 / width; var y = y1 / height;
        var v1 = wave(x*r1 + y) + triangle(x - y*r2) + wave(v2);
        v1 = v1/3; 
        v1 = (v1*v1*v1);   
        frameBuffer[x1][y1+sunRise] = floor((0.2*v1) * 1000) + (v2*v1*4);
      }
    }
  }
}

function allocateFrameBuffer() {
  for (var i = 0; i < height; i ++) {
    frameBuffer[i] = array(width);
  }
}

// gradually reduce brightness of all colored pixels
function coolFrameBuffer() {
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var n = frameBuffer[x][y] % 1;
      if (!n) continue;      
      frameBuffer[x][y] = floor(frameBuffer[x][y])+max(0,n - 0.081);
    }
  } 
}

// allocate memory for particle tables
function allocateParticleLists() {
  for (var i = 0; i < MAX_PARTICLES; i ++) {
    pb1[i] = array(5);
    pb2[i] = array(5); 
  }
}

// set particles to random positions, 0 initial velocity
// all movement is generated by gravity!
function initParticles() {
  particles = pb1;
  work_particles = pb2;
  var sunRadius = -sunDiameter / 2

  for (var i = 0; i < MAX_PARTICLES; i ++) {
    particles[i][_x] = centerX + sunRadius + random(sunDiameter);
    particles[i][_y] = centerY + sunRadius + random(sunDiameter);
    particles[i][_dx] = 0;
    particles[i][_dy] = 0;
    particles[i][_hue] = random(0.06);
  }  
}

function swapParticleBuffers()  {
  var tmp = work_particles;
  work_particles = particles;
  particles = tmp;
}

// calculate new position and acceleration for each "solar flare" particle
// and draw them in the frame buffer.  In this particle system, only
// the sun's gravity matters.  We move the center of gravity around
// a little over time to keep things stirred up.
function moveParticles() {
  drift = random(2) - 1;    
  
  for (var i = 0; i < numParticles; i++) {
    var dx = (particles[i][_x] - (centerX+drift));
    var dy = (particles[i][_y] - (centerY+drift));

    // compute force of gravity based on distance from the center of the sun       
    r = sqrt(dx*dx + dy*dy);
    var f = (r > 1) ? gravity / r * r : gravity;
    accel_x = f * dx / r;   
    accel_y = f * dy / r;

    // calculate new velocity and limit it to C - the local speed of light
    work_particles[i][_dx] = clamp(particles[i][_dx] + (accel_x / 100),-C,C);
    work_particles[i][_dy] = clamp(particles[i][_dy] + (accel_y / 100),-C,C); 

    work_particles[i][_x] = particles[i][_x] + work_particles[i][_dx];
    work_particles[i][_y] = particles[i][_y] + work_particles[i][_dy];

    // clip to our drawing area  
    if ((work_particles[i][_x] < 0) || (work_particles[i][_x] >= width)) continue;
    if ((work_particles[i][_y] < 0) || (work_particles[i][_y] >= height)) continue;    
    
    // draw in the frame buffer, limiting the drawing area and matching brightness
    // so it looks like flares are erupting fro the surface.
    if (r >= (sunDiameter * 0.9)) {
      work_particles[i][_hue] = particles[i][_hue]; 
      var bri = frameBuffer[work_particles[i][_x]][work_particles[i][_y]] % 1;
      bri = (bri) ? bri : 0.5
      frameBuffer[work_particles[i][_x]][work_particles[i][_y]] = (floor((work_particles[i][_hue]+t1) * 1000)) + bri;
    }
  }
  swapParticleBuffers();
}

// Initialization
allocateFrameBuffer();
allocateParticleLists();
initSunMask();
initParticles();

// prerender function that fades the screen to black
// over a period of time, then triggers a sunrise
// and switches back to the normal beforeRender function.
var fadeTime = 0;
function doFadeout(delta) {
  frameTimer += delta;
  fadeTime += delta

  if (frameTimer > speed) {
    coolFrameBuffer();
    frameTimer = 0;
  }
  if (fadeTime > 1500) {
    fadeTime = 0;
    sunRise = (height - 1);
    preRender = doSunrise;
  }
}

// prerender function that implements the rising sun
// and pauses for a moment before starting full
// activity.
var sunrisePause = 0;
function doSunrise(delta) {
  frameTimer += delta;
  
  sunRise = max(0,sunRise - (delta * 0.007)); 
  if (sunRise == 0) sunrisePause += delta;
  
  r1 = wave(time(0.064));
  r2 = wave(time(0.035));
  t1 = 0.05 * time(0.08);
  
  if (frameTimer > speed) {
    coolFrameBuffer();
    renderSunMask();
    frameTimer = 0;
  }  
  if (sunrisePause > 2500) {
    sunrisePause = 0;
    preRender = doActiveSun;
  }
}

// prerender function for the sun in "normal" mode with
// sunspots, surface activity, solar flares and whatnot
function doActiveSun(delta) {
  frameTimer += delta;
  
  r1 = wave(time(0.064));
  r2 = wave(time(0.035));
  t1 = 0.05 * time(0.08);
  
  if (frameTimer > speed) {
    coolFrameBuffer();
    renderSunMask();
    moveParticles();
    frameTimer = 0;
  }  
}

export function beforeRender(delta) {
  preRender(delta);
}

export function render2D(index, x, y) {
  var x1,x2,v,h;
  x1 = floor(x * width) ; y1 = floor(y * height);
  v = frameBuffer[x1][y1];
  h = floor(v) / 1000;
  v = v % 1;
  hsv(h, 1, v);
}