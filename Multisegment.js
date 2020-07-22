/*
 Divide an LED strip into multiple segments or "zones", each
 with independent RGB settings and effects. Designed for easy JSON access
 to allow control from home automation hubs and the like.
 
 Version 1.0.0 JEM(ZRanger1) 07/20/2020 
*/

// CONSTANTS 
// field indices for segment control array
var __state = 0;         // on/off state
var __hue = 1;           // hue (0-1 fixed point)
var __sat = 2;           // saturation (0-1 fixed point)
var __bri = 3;           // brightness (0-1 fixed point)
var __effect = 4;        // effect number
var __size = 5;          // number of pixels in segment
var __speed = 6;         // effect speed (for effects that support it)

// dimensions of various data arrays
export var __n_segments = 4;    // number of segments
var __dataCols = 7;      // columns in segment control array
var __n_effects = 12;    // number of available effects
var __n_locals = 3;      // max number of per-segment local variables 

// GLOBAL VARIABLES 
// per-zone color/pattern control constants and data array declaration
export var activeSeg = 0;

// vars for mild hack to isolate sliders from one another
var lastColor = 0;
var lastEffect = 0;
var lastSpeed = 0;
var lastSize = 0;

// Per segment data array.  There is no hardcoded limit to the 
// number of segments.  To add more, define z_<n> arrays for each
// new segment, following the naming convention used below. Then
// add your new arrays to segTable in the Initialize() function and
// set the __n_segments variable to reflect the new number of zones. 
// That's it - everything else adapts automatically.
//
// The arrays are coded one per segment to reduce the amount of data that
// an external program has to track per segment, as well as to
// reduce the amount json needed to send a command to a single segment.
export var z_0 = array(__dataCols);
export var z_1 = array(__dataCols);
export var z_2 = array(__dataCols);
export var z_3 = array(__dataCols);

var segTable = array(__n_segments);

// function tables for effects
// two pointers per effect -- prerender and render
// the last table entry is reserved for the "off" effect,
// which cannot be selected by user input
var segPreRender = array(__n_effects)
var segRender = array(__n_effects);

// current starting pixel index for each segment
var segStart = array (__n_segments + 1);
segStart[__n_segments] = 32765; // sentinel - do not change;

// for fast checking during render -- is the segment
// (1) turned on, (2) of non=zero size, and 
// (3) not pushed off the end by resizing.
var segEnabled = array(__n_segments);

// per-segment scratch variable storage, used by effects
var localStore = array(__n_locals * __n_segments); 

// UI 
export function sliderActiveSegment(v) {
  lastSeg = activeSeg;
  activeSeg = ceil(v * (__n_segments - 1));
}

export function sliderEffect(v) {
  v = floor(v * (__n_effects - 1));
  if (lastEffect != v){
    segTable[activeSeg][__effect] = v;
    lastEffect = v;
  }
}

export function sliderSpeed(v) {
// set up so the default speed for a pattern falls in the 
// middle of the slider range, and moving right makes
// things faster.
  if (lastSpeed != v) {
    segTable[activeSeg][__speed] = 2 * (1-v);
    lastSpeed = v;
  }  
}

export function sliderSize(v) {
// can't directly change last segment from UI
  if (activeSeg >= -1 + __n_segments) return;
  
  v = floor(v * (pixelCount - 1)); 
  if (lastSize != v){
    segTable[activeSeg][__size] = v;
    lastSize = v;
  }
}

export function hsvPickerColor(h, s, v) {
  if (lastColor != (h+s+v)) {
    segTable[activeSeg][__hue] = h;
    segTable[activeSeg][__sat] = s;
    segTable[activeSeg][__bri] = v;  
    lastColor = h+s+v;;
  }
}

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

// Set size of zone, in pixels.  Zero is the minimum size,
// pixelCount the maximum.  If you change the size of a zone,
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
	segTable[z][__bri] = b;      // brightness
}	

// set on/off state of specified zone
function SetSegState(z, state) {
	segTable[z][__state] = state;
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
  SetRenderer(10,preWipe,renderWipe);
  SetRenderer(11,preSpringyTheater,renderSpringyTheater);

// set up table of segment status arrays 
  segTable[0] = z_0;
  segTable[1] = z_1;
  segTable[2] = z_2;
  segTable[3] = z_3;	

// start with all zones on, equal in size, and set to random colors.
//
// IMPORTANT NOTE:
// To customize your starting segment sizes and colors, you can 
// move the setup function calls (like SetSegSize and SetSegHSB)
// from this loop and call them with the setup you want.
   var i;
   for (i = 0; i < __n_segments; i++) {
      SetSegState(i,true);     
	    SetSegEffect(i,0)
      SetSegHSB(i,random(1),1,0.60)
      SetSegSpeed(i,1);
      SetSegSize(i,floor(pixelCount / __n_segments));
   }
// TBD - add custom calls to zone setup functions here!

} 

// given a pixel index, return the number of the segment it is in.
// (This is the slow way -- if you're short on memory and/or have a large
// number of pixels, use this instead of indexing through segMap. This )
function GetSegNumber(pix) { 
  for (var i = __n_segments - 1; i >= 0; i--) {
    if (pix > segStart[i]) return i;
  }	 
  return 0;  
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
  hsv(a[__hue],a[__sat],a[__bri]);     
}
  
// EFFECT - random pixel "glitter"
function preGlitter(z,a,delta) {
}

function renderGlitter(z,a,index) {
  if (random(1) < 0.02) {
    hsv(a[__hue],a[__sat],a[__bri]);   
  }
  else {
    hsv(0,0,0)
  }
}

// EFFECT: rainbow bounce 
function preRBounce(z,a,delta) {
  SetVar(z,0,wave(time(.03 * a[__speed])));
}

function renderRBounce(z,a,index) {
  var h = GetVar(z,0) + ((index - segStart[z])/a[__size]);
  hsv(h, 1, a[__bri]); 
}

// EFFECT: minimalist KITT scanner
function preKITT(z,a,delta) {
  SetVar(z,0,max(3,a[__size] / 5)); 
  SetVar(z,1,triangle(time(.03 * a[__speed])) * a[__size]);
  
  g1 = GetVar(z,0)
  g2 = GetVar(z,1)
}

function renderKITT(z,a,index) {
  var bri;
  bri = 1 - clamp(abs((index - segStart[z]) - GetVar(z,1)) / GetVar(z,0), 0, 1);
  bri = bri * bri  * a[__bri];
  hsv(a[__hue],a[__sat],bri)
}

// EFFECT: pulse/flash
function preBreathe(z,a,delta) {
  SetVar(z,0,max(0.05,wave(time(.05 * a[__speed]))));
}

function renderBreathe(z,a,index) {
  hsv(a[__hue],a[__sat],GetVar(z,0));
}

// EFFECT: slow color change
function preSlowColor(z,a,delta) {
  SetVar(z,0,time(.2 * a[__speed]));
}

function renderSlowColor(z,a,index) {
  hsv(GetVar(z,0),a[__sat],a[__bri]);  
}

// EFFECT: light sparkling on snow!
function preSnow(z,a,delta) {
  var delay = delta + GetVar(z,0);

  if (GetVar(z,1) < 0) {
    if (delay > GetVar(z,2)) {
       delay = 0;
       SetVar(z,1,segStart[z] + floor(random(1) * a[__size])); 
       SetVar(z,2,random(750 * a[__speed])); 
    }
  }
  else if (delay > 80) {
    SetVar(z,1,-1); 
    delay = 0;
   }

  SetVar(z,0,delay);
}

function renderSnow(z,a,index) {
  if (index == GetVar(z,1)) { rgb(1,1,1); }
  else { hsv(a[__hue],a[__sat],a[__bri]); }
}

// EFFECT: chaser up/down 
function preChaserUp(z,a,delta) {
  SetVar(z,0,time(0.22 * a[__speed]));
}

function preChaserDn(z,a,delta) {
  SetVar(z,0,1-time(0.22 * a[__speed]));
}

function renderChaser(z,a,index) {
   var bri = sin(GetVar(z,0) * a[__size] + (index - segStart[z])); 
   hsv(a[__hue],a[__sat],bri); 
}

// EFFECT: strobe
function preStrobe(z,a,delta) {
  SetVar(z,0,square(time(.003 * a[__speed]),0.75));  
}

function renderStrobe(z,a,index) {
   hsv(a[__hue],a[__sat],a[__bri] * (1-GetVar(z,0)));   
}

// EFFECT: random color wipe
function preWipe(z,a,delta) {
  var index2 = floor(time(0.015 * a[__speed]) * a[__size]);

  if (index2 < GetVar(z,0)) {
    SetVar(z,1,GetVar(z,2));
    SetVar(z,2,time(0.05));
  }
  SetVar(z,0,index2);
}

function renderWipe(z,a,index) {
  var h = ((index - segStart[z]) <= GetVar(z,0)) ? GetVar(z,2) : GetVar(z,1);
  hsv(h, 1, a[__bri]);
}

function preSpringyTheater(z,a,delta) {
  SetVar(z,0,floor(time(0.3 * a[__speed]) * a[__size]));
  SetVar(z,1,max(2,floor(triangle(time(0.1 * a[__speed])) * 10)));
}

function renderSpringyTheater(z,a,index) {
  var v = ((GetVar(z,0) + (index-segStart[z])) % GetVar(z,1)) == 0;
  hsv(a[__hue],a[__sat],v);
}

// PIXELBLAZE
// evaluate current segment layout and call prerender
// functions for active effects

export function beforeRender(delta) {
	var start = 0;	

  for (var i = 0; i < __n_segments; i++) {
    var a = segTable[i];   
    
      segStart[i] = start;
      start += a[__size];   
      segEnabled[i] = a[__state] && (segStart[i] < pixelCount) && (a[__size] > 0);

    if (segEnabled[i]) segPreRender[a[__effect]](i,a,delta);
  }
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




