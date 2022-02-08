/*
 Multisegment Pattern for Home Automation Systems
 Divide an LED strip into multiple segments or "zones", each
 with independent RGB settings and effects. Designed for easy JSON access
 to allow control from home automation hubs.
 
 This version of the pattern is made to be controlled via websockets, so
 it does not support the Pixelblaze Web UI. 
 
 2020-2021 ZRanger1
 
 MIT License
 
 Version Date        Comment
 2.0.0   02/02/2021  v2 release
 2.0.1   02/03/2021  fixed __state/__switch bug
 2.0.2   02/07/2021  fix unable to set color in glitter effect 
 3.0.0   02/08/2022  brightness transitions
*/

// CONSTANTS 
// field indices for segment control array
var __switch = 0;        // on/off state
var __hue = 1;           // hue 
var __sat = 2;           // saturation 
var __briTgt = 3;        // target brightness 
var __effect = 4;        // effect number
var __size = 5;          // number of pixels in segment
var __speed = 6;         // effect speed (for effects that support it)
var __bri  = 7;          // current actual brightness

// dimensions of various data arrays
var __max_segments = 12;
var __dataCols = 8;      // columns in segment control array
var __n_effects = 19;    // number of available effects
var __n_locals = 3;      // max number of per-segment local variables

// Variables visible to websockets
export var __ver = 2      // used to identify pattern version to automation driver
export var __n_segments = 4;  // number of segments (range 1-__max_segments)
export var __boot = 1;    // set to 0 by automation driver after setting segment data
export var __state = 0;   // currently running on/off fade state. 

// GLOBAL VARIABLES 
var fadeLength = 2.0     // transition length in seconds (NOT MS!)
var fadeTime = 0         // accumulator for timing on/off fades
var segBri = array(__max_segments)   // final segment brightness after all adjustments
var fadeTarget = array(__max_segments)
var fadeStepsize = array(__max_segments) 

// beforeRender processing for fade in/fade out transitions
// driver can invoke fades by setting the __state var w/websockets
var states = array(3)                 
states[0] = fadeIn;                  
states[1] = normalRun;
states[2] = fadeOut;

/*
 Per segment data array. Twelve arrays are initially configured. The
 number of active segments is controlled by the variable __n_segments.

 If you need more than 12,define a new "z_nn" array for each new segment,
 add your new arrays to segTable in the Initialize() function and set the
 __max_segments and __n_segments variables to reflect the new number of 
 segments you want. That's it - everything else adapts automatically.

 The arrays are coded one per segment to reduce the amount of data that
 an external program has to track per segment, as well as to
 reduce the amount json needed to send a command to a single segment.
*/
export var z_0 = array(__dataCols);
export var z_1 = array(__dataCols);
export var z_2 = array(__dataCols);
export var z_3 = array(__dataCols);
export var z_4 = array(__dataCols);
export var z_5 = array(__dataCols);
export var z_6 = array(__dataCols);
export var z_7 = array(__dataCols);
export var z_8 = array(__dataCols);
export var z_9 = array(__dataCols);
export var z_10 = array(__dataCols);
export var z_11 = array(__dataCols);

var segTable = array(__max_segments);

/*
 Function tables for effects
 Each effect requires two functions -- prerender and render
 the last table entry is reserved for the "off" effect,
 and cannot be selected by user input.
*/
var segPreRender = array(__n_effects)
var segRender = array(__n_effects);

// current starting pixel index for each segment
var segStart = array (__max_segments + 1);
segStart[__max_segments] = 32765; // end of list sentinel - do not change;

// for fast checking during render -- is the segment
// (1) turned on, (2) of non=zero size, and 
// (3) not pushed off the end by resizing.
var segEnabled = array(__max_segments);

// per-segment local variable storage, used by effects
var localStore = array(__n_locals * __max_segments); 

// HELPER FUNCTIONS
function SetRenderer(n,pre,rend) {
  segPreRender[n] = pre;
  segRender[n] = rend;
} 

function GetVar(z,index) {
  return localStore[(__n_locals * z)+index];
}

function SetVar(z,index,v) {
  localStore[(__n_locals * z)+index] = v;
}

// Set zone size in pixels.  Zero is the minimum size,
// pixelCount the max.  If you change the size of a zone,
// the zones that follow it will have their sizes adjusted 
// as well. By definition, the first zone always starts at the
// first pixel, and the last zone ends at the last pixel.
function SetSegSize(z,nPixels) {
  var usedPixels = 0;
  
  for (var i = 0; i < __n_segments; i++) {
    var a = segTable[i];
    if (i == z) { 
      a[__size] = nPixels;
    }
    else {
      a[__size] = clamp(a[__size], 0, pixelCount - usedPixels);
    }  
    usedPixels += a[__size];
  }	  
}

// Set hsb color of the specified zone
function SetSegHSB(z,h,s,b) {
	segTable[z][__hue] = h;      // hue
	segTable[z][__sat] = s;      // saturation
	segTable[z][__briTgt] = b;   // brightness
  segTable[z][__bri] = b;      // no transition
  fadeTarget[z] = b; 
  fadeStepsize[z] = 0;
}	

// set on/off state of specified zone
function SetSegState(z, state) {
	segTable[z][__switch] = state;
}

// set special effect for zone
function SetSegEffect(z, effect) {
	segTable[z][__effect] = effect;
}

// set effect speed for zone 
function SetSegSpeed(z,speed) {
  segTable[z][__speed]=speed;
}  

function Initialize() {	

// initialize rendering function table  
  SetRenderer(0,preDefault,renderDefault);
  SetRenderer(1,preGlitter,renderGlitter);
  SetRenderer(2,preRBounce,renderRBounce);
  SetRenderer(3,preKITT,renderKITT);
  SetRenderer(4,preBreathe,renderBreathe);
  SetRenderer(5,preSlowColor,renderSlowColor);
  SetRenderer(6,preSnow,renderSnow);
  SetRenderer(7,preChaserUp,renderChaser);
  SetRenderer(8,preChaserDn,renderChaser);  
  SetRenderer(9,preStrobe,renderStrobe);
  SetRenderer(10,preWipeUp,renderWipe);
  SetRenderer(11,preWipeDown,renderWipe)
  SetRenderer(12,preSpringyTheater,renderSpringyTheater);
  SetRenderer(13,preColorTwinkles,renderColorTwinkles);
  SetRenderer(14,prePlasma,renderPlasma)
  SetRenderer(15,preRipples,renderRipples)
  SetRenderer(16,preSpinCycle,renderSpinCycle)
  SetRenderer(17,preRainbowUp,renderRainbow)
  SetRenderer(18,preRainbowDown,renderRainbow)

// set up table of segment status arrays 
  segTable[0] = z_0;
  segTable[1] = z_1;
  segTable[2] = z_2;
  segTable[3] = z_3;	
  segTable[4] = z_4;
  segTable[5] = z_5;
  segTable[6] = z_6;
  segTable[7] = z_7;  
  segTable[8] = z_8; 
  segTable[9] = z_9; 
  segTable[10] = z_10; 
  segTable[11] = z_11;   

// For the Home Automation version of this pattern, we depend on the
// automation controller to save and restore persistent segment data, so at initialization
// time, all segments are simply set to equal length and a dimmed warm white.  
  var def_segsize = floor(pixelCount/__max_segments);
  for (var i = 0; i < __max_segments; i++) {
    SetSegState(i,true);     
    SetSegEffect(i,0);
    SetSegHSB(i,0,1,0)
    SetSegSpeed(i,1);
    SetSegSize(i,def_segsize);      
  }
} 

// EFFECTS FUNCTIONS
// parameters for preXXX(z,a,delta) fns are:
// z = seg index, a = ptr to segment data array, delta = ms since last frame
// parameters for renderXXX(z,a,index) fns are:
// z = seg index, a=ptr to segment data array, index=pixel index
// Each effect can use up to 3 per segment local variables, accessed via
// the GetVar/SetVar functions. 

// EFFECT: default -- all pixels set to current color
function preDefault(z,a,delta) {
}

function renderDefault(z,a,index) {
  hsv(a[__hue],a[__sat],segBri[z]);     
}
  
// EFFECT - random pixel "glitter"

// xorshift* -- fast "random enough" PRNG 
var rngState = random(32761)
function xorShift() {
  rngState ^= (rngState>>7);
  rngState ^= (rngState<<9);
  rngState ^= (rngState>>8)
  return rngState;
}

function pRandom(seed) {
  rngState = seed;
  return xorShift() / 100 % 1
}

function preGlitter(z,a,delta) {
  var delay = delta + GetVar(z,0);
  
  if (delay > (250 * a[__speed])) {
    SetVar(z,1,random(32765));
    delay = 0;
  }
  
  SetVar(z,0,delay);  
}

function renderGlitter(z,a,index) {
  b = pRandom(GetVar(z,1) * index) 
  hsv(a[__hue],1-(b*0.03),b*b*b);
}

// EFFECT: rainbow bounce 
function preRBounce(z,a,delta) {
  SetVar(z,0,wave(time(0.2 * a[__speed])));
}

function renderRBounce(z,a,index) {
  var h = GetVar(z,0) + ((index - segStart[z])/a[__size]);
  hsv(h, 1, segBri[z]); 
}

// EFFECT: minimalist KITT scanner
function preKITT(z,a,delta) {
  SetVar(z,0,max(3,a[__size] / 5)); 
  SetVar(z,1,triangle(time(0.2 * a[__speed])) * a[__size]);
}

function renderKITT(z,a,index) {
  var bri;
  bri = 1 - clamp(abs((index - segStart[z]) - GetVar(z,1)) / GetVar(z,0), 0, 1);
  bri = bri * bri  * segBri[z];
  hsv(a[__hue],a[__sat],bri)
}

// EFFECT: pulse/flash
function preBreathe(z,a,delta) {
  SetVar(z,0,max(0.05,wave(time(.15 * a[__speed]))));
}

function renderBreathe(z,a,index) {
  hsv(a[__hue],a[__sat],GetVar(z,0) * segBri[z]);
}

// EFFECT: slow color change
function preSlowColor(z,a,delta) {
  SetVar(z,0,time(.2 * a[__speed]));
}

function renderSlowColor(z,a,index) {
  hsv(GetVar(z,0),a[__sat],segBri[z]);  
}

// EFFECT: light sparkling on snow!
function preSnow(z,a,delta) {
  var delay = delta + GetVar(z,0);
  
  if (delay > (350 * a[__speed])) {
    SetVar(z,1,random(32765));
    delay = 0;
  }
  
  SetVar(z,0,delay);  
}

function renderSnow(z,a,index) {
  b = pRandom(GetVar(z,1) * index)
  if (b > 0.94) { rgb(1,1,1); }
  else { hsv(a[__hue],a[__sat],segBri[z]); }
}

// EFFECT: Chaser up/down 
function preChaserUp(z,a,delta) {
  SetVar(z,0,time(0.44 * a[__speed]));
}

function preChaserDn(z,a,delta) {
  SetVar(z,0,1-time(0.44 * a[__speed]));
}

function renderChaser(z,a,index) {
   var bri = sin(GetVar(z,0) * a[__size] + (index - segStart[z])); 
   hsv(a[__hue],a[__sat],bri * segBri[z]); 
}

// EFFECT: strobe
function preStrobe(z,a,delta) {
  SetVar(z,0,square(time(.01 * a[__speed]),0.25));  
}

function renderStrobe(z,a,index) {
   hsv(a[__hue],a[__sat],segBri[z] * GetVar(z,0));   
}

// EFFECT: random color wipe Up/Down
function preWipeDown(z,a,delta) {
  var index2 = a[__size] - floor(time(0.035 * a[__speed]) * a[__size]);

  if (index2 > GetVar(z,0)) {
    SetVar(z,2,GetVar(z,1));
    SetVar(z,1,time(0.05));
  }
  SetVar(z,0,index2);
}

function preWipeUp(z,a,delta) {
  var index2 = floor(time(0.035 * a[__speed]) * a[__size]);

  if (index2 < GetVar(z,0)) {
    SetVar(z,1,GetVar(z,2));
    SetVar(z,2,time(0.05));
  }
  SetVar(z,0,index2);
}

function renderWipe(z,a,index) {
  var h = ((index - segStart[z]) <= GetVar(z,0)) ? GetVar(z,2) : GetVar(z,1);
  hsv(h, 1, segBri[z]);
}

function preSpringyTheater(z,a,delta) {
  SetVar(z,0,floor(time(0.4 * a[__speed]) * a[__size]));
  SetVar(z,1,max(2,floor(triangle(time(0.1 * a[__speed])) * 10)));
}

function renderSpringyTheater(z,a,index) {
  var v = ((GetVar(z,0) + (index-segStart[z])) % GetVar(z,1)) == 0;
  hsv(a[__hue],a[__sat],v * segBri[z]);
}

// EFFECT: Port of color twinkles pattern
function preColorTwinkles(z,a,delta) {
  SetVar(z,0,time(0.8 * a[__speed]) * PI2);
  SetVar(z,1,time(0.4 * a[__speed]) * PI2);
}

function renderColorTwinkles(z,a,index) {
  var i = (index-segStart[z]);
  var h = sin(i / 3 + PI2 *sin(i / 2 + GetVar(z,0)));
  var v = wave( i / 3 / PI2 + sin(i / 2 + GetVar(z,1)));
  v = v * v * v;
  v =  (v > 0.1) ? v * segBri[z]: 0;
  hsv(h,1,v);
}

// EFFECT: Port of Plasma pattern
function prePlasma(z,a,delta) {
  var t1 = time(0.2 * a[__speed]);
  SetVar(z,0,t1);  
  SetVar(z,1,2 * wave(t1));
}

function renderPlasma(z,a,index) {
  var v = wave((GetVar(z,1) + (index-segStart[z])/a[__size]) % 1);
  v = v * v * v;
  hsv(GetVar(z,0),1.5-v,v * segBri[z])
}

// EFFECT: Ripples (kind of mini-oasis...)
var r1,r2,r3;
function preRipples(z,a,delta) {
  P10 = 10/a[__size];
  P6 = 6/a[__size];
  P3 = P6/2;
  
  r1 = time(0.24*a[__speed])
  r2 = time(0.4*a[__speed])  
  r3 = wave(time(.32*a[__speed]))
}

function renderRipples(z,a,index) {
  index = index-segStart[z]
  var w1 = 2*(wave(index*P10+ r1) - 0.5)
  w1 = w1 * w1 
  w2 = 2*(wave(index*P6 - r2) - 0.5)
  w3 = 2*(wave(index*P3 + r3) - 0.5)
  v = (w1+w2+w3)/3 ;
  v = v * v * segBri[z];

  hsv(a[__hue], a[__sat]-(v/2),v)
}

// EFFECT: Spin Cycle
function preSpinCycle(z,a,delta) {
  SetVar(z,0,time(0.5*a[__speed]))
  SetVar(z,1,wave(time(0.25*a[__speed]))* 2)   
}

function renderSpinCycle(z,a,index) {
  var i = index/pixelCount
  var t1 = GetVar(z,0)
  var h = i *(5+t1*5) + GetVar(z,1)
  h = (h %.5) + t1
  v = triangle(i*5 + t1*10)
  v = v*v*v*segBri[z];
  hsv(h,1,v)  
}

//EFFECT: Rainbow up/down
function preRainbowUp(z,a,delta) {
  SetVar(z,0,time(0.1*a[__speed]))
}

function preRainbowDown(z,a,delta) {
SetVar(z,0,-time(0.1*a[__speed]))  
}

function renderRainbow(z,a,index) {
  hsv(GetVar(z,0)+((index-segStart[z])/a[__size]),a[__sat],segBri[z])
}

// RENDER TIME FUNCTIONS

// wait for the automation driver to initialize segment
// data, then slowly fade in.
function fadeIn(delta) {
	if (__boot) {
	  fadeLevel = 0;
	  fadeTime = 0;
	  return
	}
	
	fadeTime += delta;
	if (fadeLevel < 1) {
	  fadeLevel = min(1,fadeTime / fadeLength);
	  fadeLevel = fadeLevel * fadeLevel * fadeLevel;
	}  
	else {
	  state = 2;  // set to normal run state
	  fadeTime = 0;
	}
}

function fadeOut(delta) {
	fadeTime += delta / 1000;
	if (fadeLevel > 0) {
	  fadeLevel = max(0,1-(2 * fadeTime / fadeLength));
	  fadeLevel = fadeLevel * fadeLevel * fadeLevel;
	}  
	else {
	  state = 0;  // set to wait/fadeIn state
	  fadeTime = 0;
	}
}

// once the fade is complete, do nothing as
// quickly as possible
function normalRun(delta) { ; }

// evaluate current segment layout and call prerender
// functions for active effects
export function beforeRender(delta) {
	var start = 0;
	var i,t;

	states[__state](delta);
	
  for (i = 0; i < __n_segments; i++) {
    var a = segTable[i];
    
    // handle smooth brightness fades
    t = a[__briTgt];
    if (t != fadeTarget[i]) {
      fadeTarget[i] = t;
      fadeStepsize[i] = (t - a[__bri]) / fadeLength;
    }    
    
    // check for end of fade
    if (abs(t - a[__bri]) <= 0.00125) {
       a[__bri] = a[__briTgt] = fadeTarget[i] = t;      
    } else {
       a[__bri] += fadeStepsize[i] * delta / 1000;      
    }
    
       
    segStart[i] = start;
    start += a[__size];   
    segEnabled[i] = a[__switch] && (segStart[i] < pixelCount) && (a[__size] > 0);
    segBri[i] = a[__bri] * fadeLevel;

    if (segEnabled[i]) segPreRender[a[__effect]](i,a,delta);
  }
  segStart[i] = 32765  // set sentinel value at end of list
  segNumber = 0;
}

// if segment is on, call rendering fn from table
// if off, set pixel off.  Segments of zero length
// are treated as "off".
var segNumber = 0;
export function render(index) {
  if (index >= segStart[segNumber+1]) segNumber++;

	  if (segEnabled[segNumber]) {
	      segRender[segTable[segNumber][__effect]](segNumber,segTable[segNumber],index)
  	}
  	else {
	  	  hsv(0,0,0);
    }
}

// main entry point
Initialize();