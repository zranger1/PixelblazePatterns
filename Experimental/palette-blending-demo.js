// Fast palette blending/switching demo.
// Switches between multiple palettes at a user-configurable interval, smoothly
// blending between old palette and new over a user-configurable transition time.
//
// The demo shows a super simple animation, while cycling through three palettes.
// You can add as many palettes as your Pixelblaze's memory allows.
//
// Also shows how to convert FastLED gradient palettes for use with Pixelblaze, which
// gives easy access to a large number of existing palettes and palette tools. 
//
// For example, two of the three palettes in this pattern were created with
// http://fastled.io/tools/paletteknife/ and http://soliton.vm.bytemark.co.uk/pub/cpt-city/index.html
//
// MIT License - Have fun!
//
// 6/03/2023 ZRanger1

// a bunch of fastled gradient palettes
var black_Blue_Magenta_White_gp = [
    0,   0,  0,  0,
   42,   0,  0, 45,
   84,   0,  0,255,
  127,  42,  0,255,
  170, 255,  0,255,
  212, 255, 55,255,
  255, 255,255,255]
// normalize palette to 0.0 to 1.0 range  
arrayMutate(black_Blue_Magenta_White_gp,(v, i ,a) => v / 255);  

var es_landscape_33_gp = [
    0,   1,  5,  0,
   19,  32, 23,  1,
   38, 161, 55,  1,
   63, 229,144,  1,
   66,  39,142, 74,
  255,   1,  4,  1]
// normalize palette to 0.0 to 1.0 range    
arrayMutate(es_landscape_33_gp,(v, i ,a) => v / 255);

var heatmap_gp = [
  0,     0,  0,  0,   
128,   255,  0,  0,   
224,   255,255,  0,   
255,   255,255,255 ];
// normalize palette to 0.0 to 1.0 range   
arrayMutate(heatmap_gp,(v, i ,a) => v / 255);

// list of the palettes we'll be using
var palettes = [black_Blue_Magenta_White_gp,es_landscape_33_gp,heatmap_gp]

// control variables for palette switch timing (these are in seconds)
export var PALETTE_HOLD_TIME = 5
export var PALETTE_TRANSITION_TIME = 2;

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

// transition to the next palette in the sequence
export function triggerNextPalette() {
  runTime = 0;
  inTransition = 1
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
    runTime = 0
    inTransition = 1
  }
  
  // beforeRender() code specific to your pattern can go below this line

}

// Add your pattern render() code here -- just use paint to get color
// from the current blended palette.
export function render(index) {
  pct = frac(wave(time(0.1))+ index/pixelCount)
  paint(pct);
}


