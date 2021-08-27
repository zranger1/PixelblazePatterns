/* Conway's Life 2D

 Straightforward implementation of Conway's Life for 2D matrices.
 https://en.wikipedia.org/wiki/Conway%27s_life
 
 Requires a 2D display and appropriate mapping function. 

 MIT License
 
 Version  Author        Date      
 1.0.0    JEM(ZRanger1) 05/02/2021
*/ 

// display size - enter the dimensions of your matrix here
var width = 16;
var height = 16;

// Global variables for rendering
var buffer1 = array(height);   // main drawing surface
var buffer2 = array(height);   // secondary drawing surface
var pb1, pb2;                  // buffer pointers for swapping

// Variables for animation control
export var speed = 100;        // milliseconds per frame
export var lifetime = 9000;    // how long (in milliseconds) do we let each "pattern" run
var frameTimer = 9999;         // accumulator for simulation frame timer
var patternTimer = 9999;       // accumulator for pattern life timer.
var t1;                        // color modulation timer

// UI
export function sliderSpeed(v) {
  v = 1-v;
  speed = 1000 * v * v;
}

// most Life patterns are not very long lived, so to keep the display
// interesting, we'll have to restart periodically. This slider controls
// how long the pattern runs before reinitializing, from 1 to 30 seconds.
export function sliderLifetime(v) {
  lifetime = 1000 + (v * 29000)
}

// initialize by randomly seeding a specified percentage of cells
function seedCA(prob) {
  for (var y = 1; y < height; y++) {
    for (var x = 1; x < width; x++) {
        pb2[x][y] = (random(1) < prob);
    }
  }
}

// create 2 x 2D buffers for calculation
function allocateFrameBuffers() {
  for (var i = 0; i < height; i ++) {
    buffer1[i] = array(width);
    buffer2[i] = array(width);
  }
  pb1 = buffer1;
  pb2 = buffer2;
}

function swapBuffers()  {
  var tmp = pb1; pb1 = pb2; pb2 = tmp;  
}

function sumNeighborhood8(x,y,buffer) {
// precalculate wrapped neighbor indices.  
  xm = (x > 0) ? x - 1 : width - 1;
  ym = (y > 0) ? y - 1 : height - 1;
  xp = (x + 1) % width;
  yp = (y + 1) % height;
  
// return number of living neighbor cells  
  return buffer[x][ym] + buffer[x][yp] + buffer[xm][y] + buffer[xp][y] +
       buffer[xm][ym] + buffer[xp][ym] + buffer[xm][yp] + buffer[xp][yp];
}

function doGeneration() {
  swapBuffers();    

// implement the rules of Life:  If a cell has fewer than two living neighbors,
// it dies of lonliness, if more than three, it dies of overcrowding.
// if an empty cell has exactly three neighbords, it spawns new life
// otherwise, with 2 or 3 neighbors, the cell lives on to the next generation
  for (var y = 1; y < height; y++) {
    for (var x = 1; x < width; x++) {
      var sum = sumNeighborhood8(x,y,pb1);
      if (sum < 2 || sum > 3) { pb2[x][y] = 0; }  
      else if (sum == 3) { pb2[x][y] = 1; }  
      else { pb2[x][y] = pb1[x][y]; } 
    }
  }
}

// Initialization
allocateFrameBuffers();

export function beforeRender(delta) {
  frameTimer += delta; 
  patternTimer += delta;
  
  // timer to give us a little color change
  t1 = time(0.08);
  
  // if we've reached the end of a pattern's allotted lifespan
  // start a new one
  if (patternTimer > lifetime) {
    seedCA(0.3);
    patternTimer = 0;
  }

  // if it's time for a new frame, calculate the next generation
  if (frameTimer > speed) {
    doGeneration();  
    frameTimer = 0;  
  }
}

export function render2D(index, x, y) {
  // convert x and y to array indices
  x = floor(x * width);  
  y = floor(y * height);
  hsv(t1,1,(pb2[x][y] > 0) * 0.6);
}