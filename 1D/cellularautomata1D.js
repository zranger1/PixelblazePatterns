/*
  Cellular Automata 1D
  Elementary cellular automata as described in
  https://mathworld.wolfram.com/ElementaryCellularAutomaton.html

  v1.0.0 7/22/20 JEM(zranger1) -- finally cleaned up for release
*/

// data arrays
var g0 = array(pixelCount);  
var g1 = array(pixelCount);
var hues = array(pixelCount);

// pointers to data arrays
var currState = g0;
var nextState = g1;  

/*
Wolfram number (0-255) -- the bit pattern of the rule number completely describes the rule,
making it super compact and very fast and easy to evaluate.  It's worth spending a little
time on Wolfram's site (above) to appreciate this crazy clever idea!  

Some "interesting" rules: 18,22,30,54,62,90,96,109,110,184,250...

(Odd numbered rules tend to flash in 1D because the rule for bit 0 causes empty cells with
no neighbors to be turned on, and they usually die from overcrowding in the next generation.)
*/
export var rule = 22;   

// animation and palette management 
export var palWidth = 1;
export var palOffset = 0;
export var lifetime = 15000;  // milliseconds, 0 == forever
export var startingCells = 1; 
var speed = 100;              // milliseconds, 80-100 looks about right.
var nGens = 0;
var life = 0;
var elapsedTime = 1;

// Color Mode
//  Mode 0 - color by cell age. Older cells are brightest. This can look very organic
//  and sparkly if the rule permits cells to survive for a while. It's also interesting
//  for the sharp monochrome or two color patterns when cells live only a generation or two.
//  Mode 1 - color by bit index of rule fired. 8 possible colors. Gives a bright,
//  digital look, like computer displays in Star Trek TOS. 
var colorMode = 0;

// UI
export function sliderStartingCells(v) {
  startingCells = 1+floor(v * (pixelCount /2));
  life = lifetime+1;  // restart pattern when any slider is touched.
}

export function sliderRule(v) {
  rule = floor(v * 255);
}

export function sliderLifetime(v) {
  lifetime = floor(30000 * v);  // 0 == forever
}

export function sliderColorMode(v) {
  colorMode = ceil(v);
}

export function sliderPaletteWidth(v) {
  palWidth = v;
}

export function sliderPaletteOffset(v) {
  palOffset = v;
}

// activate up to <n> random cells.  If n == 1, just set the center cell
function initialize(n) {

// reset pointers -- we reference state arrays through pointers to allow
// pointer swapping instead of copying during processing, and also so that
// we only have to zero the current state during (re-)initialization.
// 
  currState = g0;
  nextState = g1;  

// zero arrays
  for (var i = 0;i < pixelCount; i++) {
    currState[i] = 0;
    hues[i] = 0;
  }
  
// special case -- if only one starting cell, set the one in the center
  if (n == 1) {
    currState[pixelCount / 2] = 1;
    return;
  }

// seed a random number of cells across the array.  
// NOTE: the same random number may come up multiple times, so it's
// possible that slightly fewer than n cells may be set.  For the sake
// of expediency, that's ok for now.
  for (i = 0; i < n; i++ ) {
     currState[floor(pixelCount * random(1))] = 1;
  }
}

function calcNextGen() {
  nGens = 0;  

  var left,curr,right;
  var state;

// set up 8-bit representation of current cell state. Note that neighborhood
// wraps around the ends of the strip.
  for (var i = 0; i < pixelCount; i++) {
    left = currState[(i > 0) ? i - 1 : pixelCount - 1] << 2;
    curr = currState[i] << 1;
    right = currState[(i + 1) % pixelCount];
    
// apply transformation rule, color according to cell lifespan. Longest lived 
// cells are brightest. 
    nextState[i] = (rule & (1 << (left | curr | right))) != 0;
    
    if (colorMode) {  // color by rule fired to produce current cell
      hues[i] = (left | curr | right) / 7;
      nGens = 1;
    }
    else {   // color by age of cell
      hues[i] = nextState[i] * (hues[i] + 1);
      if (hues[i] > nGens) nGens = hues[i];
    }
  }

// swap state arrays
  var a;
  a = currState; currState = nextState; nextState = a;  
}

export function beforeRender(delta) {
  elapsedTime += delta;

  if (elapsedTime >= speed) {
    life += elapsedTime;    
    elapsedTime = 0;  

    calcNextGen();
    if (lifetime && (life > lifetime)) {
      life = 0;      
      initialize(startingCells);
    }
  }
}

// draw current generation
export function render(index) {
  x = hues[index] / nGens;
  hsv(palOffset+(x * palWidth),1,x * x);
}

initialize(startingCells);
