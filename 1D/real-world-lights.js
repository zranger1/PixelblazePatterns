/*
 Real World Lights 
 
 Emulates the general color and look, if not the exact spectral characteristics
 of some interesting real-world light sources, selectable by UI slider.  The lights 
 are, in order:
 
   -Candlelight
   -Warm white incandescent 
   -Soft white incandescent
   -Cool white incandescent
   -Uranium glass fluorescence 
   -High pressure sodium lamp
   -Mercury Vapor lamp
   -Sodium vapor lamp
   -Warm fluorescent tube
   -Cool fluorescent tube
   -LED grow light (vegetative phase)
   -Ultraviolet (black light) tube
   -Cherenkov radiation
   
   Tested on APA102 and RGB WS2812b. Some colors may
   need adjustment on RGBW LEDs, depending on
   the particular shade of the 'W' LED. 

 MIT License
 ZRanger1 01/20/2022
*/ 

// light index definitions
  candle = 0
  warm_white = 1
  soft_white = 2
  cool_white = 3
  uranium_glass = 4
  hp_sodium = 5 
  mercury = 6
  sodium_vapor = 7
  warm_fl = 8
  cool_fl = 9
  fl_grow = 10 
  ultraviolet = 11
  cherenkov = 12

// arrays for light parameters
var nLights = 13;    
var preLight = array(nLights);
var renderLight = array(nLights);

// global color values for animation control and use in render
var speed,t1,t2,t3,t4;
export var r,g,b,h,s,v;

///////
// Tables of functions for the light sources
//////

preLight[cool_white] = (delta) => ctToRGB(66);   // Cool white incandescent
renderLight[cool_white] = (index) => rgb(r,g,b);

preLight[warm_white] = (delta) => ctToRGB(29);   // Warm White incandescent
renderLight[warm_white] = (index) => rgb(r,g,b);

preLight[soft_white] = (delta) => ctToRGB(40);   // Soft white incandescent
renderLight[soft_white] = (index) => rgb(r,g,b);

preLight[fl_grow] = (delta) => { ;};   // Fluorescent grow light
renderLight[fl_grow] = renderGrowLight;

preLight[warm_fl] = (delta) => {r=1;g=0.8;b=0.8;};   // Warm fluorescent tube
renderLight[warm_fl] = (index) => rgb(r,g,b);

preLight[cool_fl] = (delta) => {r=.831;g=0.922;b=1;};   // Cool fluorescent tube
renderLight[cool_fl] = (index) => rgb(r,g,b);

preLight[ultraviolet] = (delta) => {r=0.655;g=0;b=1;};  // black light tube
renderLight[ultraviolet] = (index) => rgb(r,g,b);

preLight[mercury] = (delta) => {r=0.55;g=1;b=.58;};   // mercury vapor lamp
renderLight[mercury] = (index) => rgb(r,g,b);

preLight[uranium_glass] = (delta) => {speed = 0.85;h = 0.2673;s = 1;v = 1};    
renderLight[uranium_glass] = renderUraniumGlass;

preLight[sodium_vapor] = (delta) => {h = 0.08;s=0.902};     // sodium vapor
renderLight[sodium_vapor] = (index) => hsv(h,s,1);

preLight[candle] = (delta) => {speed = 0.4;h = 0.05;s=0.98;v=1} // candlelight
renderLight[candle] = renderCandle;

preLight[hp_sodium] = (delta) => {h = 0.04;s=0.969;};   // high pressure sodium
renderLight[hp_sodium] = (index) => hsv(h,s,1);

preLight[cherenkov] = (delta) => {speed = 0.85;h = 0.591;s = 0.997;v = 1};     
renderLight[cherenkov] = renderCherenkov;

// UI controls
export var nCurrentLight = 0;
export function sliderLightType(v) {
    nCurrentLight = floor(v * (nLights - 1));
}

// smooth 1D noise (sum of sines). Returns value
// in the range -1 to 1
function noise(index) {
  var x,v;
  x = index/pixelCount;
  v =  (wave((33 * x) - t1) - 0.5) << 1;
  v += (wave((45 * x) + t2) - 0.5) << 1;
  v += (wave((21 * x) + t3) - 0.5) << 1;
  v += (wave((15 * x) - t4) - 0.5) << 1;
  return v >> 2;   
}

// candle renderer adds a little movement
function preCandle(delta) {
  speed = 0.5;
  h = 0.05;s=0.98; 
}

function renderCandle(index) {
  var v = noise(index);
  hsv(h-(0.01 * triangle(v+index/pixelCount)), s, max(0.35,v));
}

// grow light for vegetative phase plants...
function renderGrowLight(index) {
  var pct = wave(index/pixelCount*60); pct = 0.33 * pct * pct
  hsv(0.65+pct,1,1)
}

// add a little internal brightness variation for fluorescence
function renderUraniumGlass(index) {
  var v = noise(index);
  hsv(h, s, max(0.25,v));
}

// variation for radiation effects
function renderCherenkov(index) {
  var n = noise(index/3);
  hsv(h, 1, max(0.2,n));
}

// convert color temp in degrees K/100 to RGB color
function ctToRGB(ct){
    
    if( ct < 67 ){ 
        r = 1;
        g = 0.5313 * log(ct) - 1.2909;
        
        if( ct <= 19){
            b = 0;
        } else {
            b = 0.0223 * ct - 0.5063;
        }
    } else {
        r = 38.309 * pow(ct,-0.886);
        g = 10.771 * pow(ct,-0.588);
        b = 1;
    }
    
    r = clamp(r,0, 1);
    g = clamp(g,0, 1);
    b = clamp(b,0, 1);
}


export function beforeRender(delta) {

  // a few timers we can use for internal variation
  t1 = time(speed *.16);
  t2 = time(speed *.1);
  t3 = time(speed *.14);
  t4 = time(speed *.11);    
  
  preLight[nCurrentLight](delta);
}

export function render(index) {
  renderLight[nCurrentLight](index);
}