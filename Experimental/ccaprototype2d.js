/* Cyclical Cellular Automata 2D Prototype

 Version  Author        Date      
 1.0.0    JEM(ZRanger1) 04/09/2021
*/ 

// display size - enter the dimensions of your matrix here
var width = 16;
var height = 16;
var xSize = width + 2;
var ySize = height + 2;
var numStates = 24;

// Global variables for rendering.  Buffers are purposely allocated
// oversize so we have a bounding region that saves us from clipping
// and wrapping issues.
var buffer1 = array(ySize); // main drawing surface
var buffer2 = array(ySize); // secondary drawing surface
var pb1, pb2;                  // buffer pointers for swapping
export var speed = 60;         // milliseconds per frame
export var lifetime = 10000;   // how long between reinitializations
export var excited = 0.03;     // % cells initialized to "excited" state
export var refractory = 0.64;  // % cells initialized to random refractory level
export var threshold = 1;      // minimum activation level
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

// allows a maximum of 20% of cells to be initially excited
export function sliderExcited(v) {
  excited = 0.20 * v * v;
}

// allows a maximum of 80% of cells to be initialied to the
// refractory state
export function sliderRefractory(v) {
  refractory = 0.8 * v * v;
}

// initialize cells given probability of excited and refactory cells.  
function seedCA(probX,probR) {
  var x,y,i;
  
  pb1 = buffer1;
  pb2 = buffer2;
  
// zero array
  for (y = 0; y < ySize; y++) {
    for (x = 0; x < xSize; x++) {
      pb1[x][y] = 0;
      pb2[x][y] = 0;
    }
  }
  
// distribute excited cells  
  probX = floor(pixelCount * probX)
  for (i = 0; i < probX;) {
    x = 1+random(width+1); y = 1+random(height+1);
    if (pb2[x][y] == 0) {
      pb2[x][y] = 1
      i++;
    }
  }
  
// distribute refactory cells
  probR = floor(pixelCount * probR)
  for (i = 0; i < probR;) {
    x = 1+random(width); y = 1+random(height)
    if (pb2[x][y] == 0) {
      pb2[x][y] =  2+floor(random(numStates - 2))
      i++;
    }
  }
}

// initialize cells given probability of excited and refactory cells.  
function seedCA2(probX,probR) {
  pb1 = buffer1;
  pb2 = buffer2;
  
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
        var val = 0;
        if (random(1) < probR) { val = 2+floor(random(numStates - 2)); }
        else if (random(1) < probX) { val = 1; }
        
        pb2[x+1][y+1] = val;
    }
  }
}


// create 2 x 2D buffers for calculation
function allocateFrameBuffers() {
  for (var i = 0; i < ySize; i ++) {
    buffer1[i] = array(xSize);
    buffer2[i] = array(xSize);
  }
  pb1 = buffer1;
  pb2 = buffer2;
}

function swapBuffers()  {
  var tmp = pb1; pb1 = pb2; pb2 = tmp;  
}

// counts excited neighbors
function sumNeighborhood4(x,y,buffer) {
  return (buffer[x][y-1] == 1) + (buffer[x][y+1] == 1) + 
    (buffer[x-1][y] == 1) + (buffer[x+1][y] == 1); 
}

function sumNeighborhood8(x,y,buffer) {
  return (buffer[x][y-1] == 1) + (buffer[x][y+1] == 1) + (buffer[x-1][y] == 1) + 
         (buffer[x+1][y] == 1) + (buffer[x-1][y-1] == 1) + (buffer[x+1][y-1] == 1) +
         (buffer[x-1][y+1] == 1) + (buffer[x+1][y+1] == 1);
}

export var s;
function doGeneration() {
  swapBuffers();    

  for (var y = 1; y <= height; y++) {
    for (var x = 1; x <= width; x++) {
      if (pb1[x][y] == 0) {
        s = sumNeighborhood4(x,y,pb1);  
        pb2[x][y] = (s >= threshold);        
      }
      else {
        pb2[x][y] = (pb1[x][y] + 1) % numStates;
      }
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
     doGeneration();  
    frameTimer = 0;
  }
}

// The "sum" variable simply lets us know if we've drawn any non-zero pixels.  If
// the whole pattern is zero, it has died, and we need to make a new one, which we'll
// do the next time beforeRender() is called.
var sum = 0;
export function render2D(index, x, y) {
  // convert x and y to array indices
  x = 1+(x * width);  
  y = 1+(y * height);
  var cell = pb2[x][y];
  sum += cell;
  hsv(cell / numStates,1,(cell > 0) * 0.6);
}