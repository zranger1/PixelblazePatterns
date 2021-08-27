/* Cyclic Cellular Automata 2D

 Displays a cyclic cellular automaton, and a variant of the Greenberg-Hastings CCA: 
 
 https://en.wikipedia.org/wiki/Greenberg%E2%80%93Hastings_cellular_automaton
 
 This flavor of CA is used to model "excitable" systems -- a system that can 
 activate, and support the passage of a wave of some sort, after which it
 must "rest" for some period of time before another wave can pass.  
 
 A forest fire is the canonical example of this kind of system...
 
 Requires a 2D LED array and appropriate pixel mapper.
 
 UI Sliders: 
 Speed:      Controls number of milliseconds per frame
 Lifetime:   How long a given pattern runs before being re-randomized
             A lifetime of 0 means "forever"
 Threshold:  Number of correctly valued neighbors required to advance to
             the next state.
 States:     Number of allowed states for each cell.              
 Excited:    Percentage of cells to initialize to the excited state
 Refractory: Percentage of cells to initialize to a random refractory level
 Mode:       Switches between Greenberg-Hastings and "normal" cyclic CA.  Flipping
             the mode switch restores default values for the more sensitive
             parameters.
 
 Cells are randomly initialized according to the current mode and parameter set.
 Some initial condition sets may "fizzle" and die out.  If this occurs, the 
 pattern will automatically re-initialize.
 
 The default settings produce mostly "good" results, but this pattern rewards
 experimentation and a bit of patient watching.  It can produce beautiful visuals
 that would be near impossible to make any other way!

 MIT License
 
 Version  Author        Date      
 1.0.0    JEM(ZRanger1) 05/03/2021
*/ 

// display size - enter the dimensions of your matrix here
var width = 16;
var height = 16;


// Global variables for rendering.  Buffers are purposely allocated
// oversize so we have a bounding region that saves us from clipping
// and wrapping issues.
var buffer1 = array(height);   // main drawing surface
var buffer2 = array(height);   // secondary drawing surface
var pb1, pb2;                  // buffer pointers for swapping
export var numStates = 24;
export var speed = 60;         // milliseconds per frame
export var lifetime = 10000;   // how long between reinitializations
export var excited = 0.03;     // % cells initialized to "excited" state
export var refractory = 0.64;  // % cells initialized to random refractory level
export var threshold = 1;      // minimum activation level
var mode = 0;                  // 0 = Greenberg-Hastings, 1 = Cyclic CA
var calcNextGen = doGenerationGH;
var nextVal = 1;
var frameTimer = 9999;         // accumulator for simulation timer
var patternTimer = 9999;       // accumulator for pattern lifetime

// UI
export function sliderSpeed(v) {
  speed = 1000 * v * v;
}

// lifetime of pattern in milliseconds.  0 == forever
export function sliderLifetime(v) {
  lifetime = v * 30000;
}

// Set operating mode: 0 == GBH, 1 = CCA
export function sliderMode(v) {
  mode = (v > 0.5);
  
  calcNextGen = mode ? doGenerationCCA : doGenerationGH;
  
  if (mode == 0) {
    threshold = 1;
    numStates = 24;
    excited = 0.03;
    refractory = 0.64;
  }
  else {
    threshold = 3;
    numStates = 3;
  }
}

// Advanced UI Controls
// Uncomment the block below if you want to play with more parameters.
// Enabling these sliders breaks the Mode slider's automatic setting of 
// reasonable defaults for the more sensitive parameters, so if you like
// your settings, take note of them before you do this.  And remember
// 
// "With great power comes great responsibility" - Spider-man
/*
export function sliderThreshold(v) {
  threshold = 1+floor(v * 3);
}

export function sliderStates(v) {
  numStates = floor(v * 32);
}

// allows a maximum of 20% of cells to be initially excited
export function sliderExcited(v) {
  excited = 0.20 * v * v;
}

// allows a maximum of 80% of cells to be initialied to the
// refractory state
export function sliderRefractory(v) {
  refractory = 0.8 * v * v;
}
*/

// Master CA Initializer
// init the array to a random(ish) state appropriate for the
// current mode.
function seedCA() {
  if (mode) {
    seedCCA()
  } else { 
    seedGH(excited,refractory);
  }
}

// init classic CCA
// Set all cells to random activation level 
function seedCCA() {
  var x,y,i;
  
  lastState = buffer1;
  currentState = buffer2;
  
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      currentState[x][y] = floor(random(numStates));
      lastState[x][y] = currentState[x][y];      
    }
  }
}

// Init Greenberg-Hastings CA
// Set cells given probability of excited and refactory levels. 
// TODO - rework this to shuffle instead of generating random coord pairs.
function seedGH(probX,probR) {
  var x,y,i;
  
  pb1 = buffer1;
  pb2 = buffer2;
  
// zero arrays
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      pb1[x][y] = 0;
      pb2[x][y] = 0;
    }
  }
  
// distribute excited cells  
  probX = floor(pixelCount * probX)
  for (i = 0; i < probX;) {
    x = random(width); y = random(height);
    if (pb2[x][y] == 0) {
      pb2[x][y] = 1
      i++;
    }
  }
  
// distribute refactory cells
  probR = floor(pixelCount * probR)
  for (i = 0; i < probR;) {
    x = random(width); y = random(height)
    if (pb2[x][y] == 0) {
      pb2[x][y] =  2+floor(random(numStates - 2))
      i++;
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

// counts excited neighbors
function sumNeighborhood4(x,y,buffer) {
  return (buffer[x][ym] == nextVal) + (buffer[x][yp] == nextVal) + 
    (buffer[xm][y] == nextVal) + (buffer[xp][y] == nextVal); 
}

function sumNeighborhood8(x,y,buffer) {
  return (buffer[x][ym] == nextVal) + (buffer[x][yp] == nextVal) + (buffer[xm][y] == nextVal) + 
         (buffer[xp][y] == nextVal) + (buffer[xm][ym] == nextVal) + (buffer[xp][ym] == nextVal) +
         (buffer[xm][yp] == nextVal) + (buffer[xp][yp] == nextVal);
}

var xm,xp,ym,yp;
function doGenerationGH() {
  swapBuffers();  
  nextVal = 1;

  for (var y = 0; y < height; y++) {
    yp = (y + 1) % height;      
    ym = (y > 0) ? y - 1 : height - 1;
    
    for (var x = 0; x < width; x++) {
      xm = (x > 0) ? x - 1: width - 1;
      xp = (x + 1) % width;      
      
      if (pb1[x][y] == 0) {
        pb2[x][y] = (sumNeighborhood4(x,y,pb1) >= threshold);        
      }
      else {
        pb2[x][y] = (pb1[x][y] + 1) % numStates;
      }
      sum += pb2[x][y];
    }
  }
}

function doGenerationCCA() {
  swapBuffers();  

  for (var y = 0; y < height; y++) {
    yp = (y + 1) % height;      
    ym = (y > 0) ? y - 1 : height - 1;
    
    for (var x = 0; x < width; x++) {
      xm = (x > 0) ? x - 1: width - 1;
      xp = (x + 1) % width;   
      
      nextVal = (pb1[x][y] + 1) % numStates;
      var s = sumNeighborhood8(x,y,pb1);  
      pb2[x][y] = (s >= threshold) ? nextVal : pb1[x][y]; 
      sum += (pb2[x][y] != pb1[x][y])
    }
  }
}

// Initialization
allocateFrameBuffers();

export function beforeRender(delta) {
  frameTimer += delta;
  patternTimer += delta;

// if the pattern hasn't died, and it's time for a new pattern,
// reinitialize the array.
  if ((sum == 0) || (lifetime && (patternTimer > lifetime))) {
    seedCA(excited,refractory);
    patternTimer = 0;
  }

  if (frameTimer > speed) {
    sum = 0;    
    calcNextGen();  
    frameTimer = 0;
  }
}

// The "sum" variable simply lets us know if any pixels have changed since the last
// frame.  If not, the CA has died, and we need to start a new one, which we'll
// do the next time beforeRender() is called.
var sum = 0;
export function render2D(index, x, y) {
  x = (x * width);  
  y = (y * height);
  var cell = pb2[x][y];
  var state = cell / numStates;
  hsv(state,1, wave(state));
}