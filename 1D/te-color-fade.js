// Animated Palette cross fade in Titanic's End colors
// 8/2023 ZRanger1

var TE_Cyan_Blue_Purple = [
  0.0, 0.1326, 0.0038, 0.16,  
  0.1666, 0.1059, .0055, 0.4818, 
  0.3333, 0.061, 0.0246, 0.5610, 
  0.5, 0.4086, 0.25196, 0.9006,   
  0.6667, 0.1964, 0.6029, 1.0,        
  1.0, 0.1246, 0.6275, 0.8277,      
  ]

var TE_Pink_Purple = [
    0.0, 0.1059, 0.0055, 0.4818,    
    0.3333, 0.1059, 0.02977, 0.5610, 
    0.6667, 0.3986, 0.0246, 0.2034, 
    1.0, 0.9006, 0.2105, 0.4603,
]

var TE_Cyan_Green = [
    0.0, 0.0038, 0.3888, 0.2214,    
    0.3333, 0.0055, 0.7924, 0.346,
    0.6667, 0.1273, 0.9006, 0.7924, 
    1.0, 0.1569, 0.609, 0.8277, 
]

var TE_Orange_Green = [
    0.0, 0.1301, 0.9231, 0.0015,    
    0.5, 0.5206, 0.9156, 0.0339, 
    1.0, 0.9231, 0.5206, 0.0629,
]

var TE_Cyan_Ice = [
    0.0, 0.0024, 0.1164, 0.9006,    
    0.1667, 0.0465, 0.2599, 0.9006, 
    0.3333, 0.0517, 0.4982, 0.8277, 
    0.5, 0.1963, 0.6029, 1.0,       
    0.6667, 0.1246, 0.6275, 0.8277,  
    1.0, 0.6275, 0.7108, 1.0,      
]

var pal = TE_Cyan_Blue_Purple;

var palettes = [TE_Cyan_Blue_Purple,TE_Pink_Purple,TE_Cyan_Green,TE_Orange_Green,TE_Cyan_Ice]
export var repeats = 4;
var speed = 1.25;
var freeze = 0;

var pal = TE_Cyan_Blue_Purple;

var palettes = [TE_Cyan_Blue_Purple,TE_Pink_Purple,TE_Cyan_Green,TE_Orange_Green,TE_Cyan_Ice]
// control variables for palette switch timing (these are in seconds)
export var PALETTE_HOLD_TIME = 1
export var PALETTE_TRANSITION_TIME = 1;
var PALETTE_HOLD = 0;

// internal variables used by the palette manager.
// Usually not necessary to change these.
export var currentIndex = 0;
var nextIndex = (currentIndex + 1) % palettes.length;

// arrays to hold rgb interpolation results
var pixel1 = array(3);
var pixel2 = array(3);

// array to hold calculated blended palette
var PALETTE_SIZE = 16;
var currentPalette = array(4 * PALETTE_SIZE)

// timing related variables
var inTransition = 0;
var blendValue = 0;
runTime = 0

// Startup initialization for palette manager
setPalette(currentPalette);
buildBlendedPalette(palettes[currentIndex],palettes[nextIndex],blendValue)  

// UI Controls
export function sliderSpeed(v) {
  speed = clamp(-2 + 4 * v,-2,2);
}

export function sliderRepeats(v) {
  repeats = clamp(v * 8,1,8);
}

// how long we stick with a palette before transitioning to
// the next one
export function sliderHoldTime(v) {
  PALETTE_HOLD_TIME = 20 * v * v;
}

// time to cross-blend between palettes when switching
export function sliderTransitionTime(v) {
  PALETTE_TRANSITION_TIME = 10 * v * v;
}

// stay  with the current palette
export function togglePaletteHold(v) {
  PALETTE_HOLD = v;
}

// stop animation
export function toggleFreeze(v) {
  freeze = v; 
}

// user space version of Pixelblaze's paint function. Stores
// interpolated rgb color in rgbArray
function paint2(v, rgbArray, pal) {
  var k,u,l;
  var rows = pal.length / 4;

  // find the top bounding palette row
  for (i = 0; i < rows;i++) {
    k = pal[i * 4];
    if (k >= v) break;
  }

  // fast path for special cases
  if ((i == 0) || (i >= rows) || (k == v)) {
    i = 4 * min(rows - 1, i);
    rgbArray[0] = pal[i+1];
    rgbArray[1] = pal[i+2];
    rgbArray[2] = pal[i+3];    
  }
  else {
    i = 4 * (i-1);
    l = pal[i]   // lower bound    
    u = pal[i+4]; // upper bound

    pct = 1 -(u - v) / (u-l);
    
    rgbArray[0] = mix(pal[i+1],pal[i+5],pct);
    rgbArray[1] = mix(pal[i+2],pal[i+6],pct);
    rgbArray[2] = mix(pal[i+3],pal[i+7],pct);    
  }
}

// utility function:
// interpolate colors within and between two palettes
// and set the LEDs directly with the result.  To be
// used in render() functions
function paletteMix(pal1, pal2, colorPct,palettePct) {
  paint2(colorPct,pixel1,pal1);
  paint2(colorPct,pixel2,pal2);  
  
  rgb(mix(pixel1[0],pixel2[0],palettePct),
      mix(pixel1[1],pixel2[1],palettePct),
      mix(pixel1[2],pixel2[2],palettePct)
   )
}

// construct a new palette in the currentPalette array by blending 
// between pal1 and pal2 in proportion specified by blend
function buildBlendedPalette(pal1, pal2, blend) {
  var entry = 0;
  
  for (var i = 0; i < PALETTE_SIZE;i++) {
    var v = i / (PALETTE_SIZE - 1);
    
    paint2(v,pixel1,pal1);
    paint2(v,pixel2,pal2);  
    
    // build new palette at currrent blend level
    currentPalette[entry++] = v;
    currentPalette[entry++] = mix(pixel1[0],pixel2[0],blend)
    currentPalette[entry++] = mix(pixel1[1],pixel2[1],blend)
    currentPalette[entry++] = mix(pixel1[2],pixel2[2],blend)    
  }
}
  
export function beforeRender(delta) {
  runTime = (runTime + delta / 1000) % 3600;

  // Palette Manager - handle palette switching and blending with a 
  // tiny state machine  
  if (inTransition) {
    if (runTime >= PALETTE_TRANSITION_TIME) {
      // at the end of a palette transition, switch to the 
      // next set of palettes and reset everything for the
      // normal hold period.
      runTime = 0;
      inTransition = 0
      blendValue = 0
      currentIndex = (currentIndex + 1) % palettes.length
      nextIndex = (nextIndex + 1) % palettes.length   

    }
    else {
      // evaluate blend level during transition
      blendValue = runTime / PALETTE_TRANSITION_TIME
    }
    
    // blended palette is only recalculated during transition times. The rest of 
    // the time, we run with the current palette at full speed.
    buildBlendedPalette(palettes[currentIndex],palettes[nextIndex],blendValue)          
  }
  else if (runTime >= PALETTE_HOLD_TIME) {
    // when hold period ends, switch to palette transition
    if (!PALETTE_HOLD) {
      runTime = 0
      inTransition = 1
    }
  }
  
  // pattern-specific code below this line
  timebase = (timebase + ((delta * speed) / 1000)) % 3600;  
  t1 = (freeze) ? 0: timebase;
}

export function render(index) {
  var k = frac(t1 + triangle(repeats * index/pixelCount));
  k = k * k;
  paint(k,k);
}