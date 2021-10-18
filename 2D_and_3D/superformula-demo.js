// From https://www.shadertoy.com/view/llsyz8
// Yet another implementation of the supershape / superformula, 2017 by JT.
// cycling through the examples given in the wikipedia-article.
// Ref: https://en.wikipedia.org/wiki/Superformula
// Pixelblaze port 2021 ZRanger1

var shape = array(24);
shape[0] = vec4(3, 5, 18, 18);
shape[1] = vec4(6, 20, 7, 18);
shape[2] = vec4(4, 2, 4, 13);
shape[3] = vec4(7, 3, 4, 17);
    
shape[4] = vec4(7, 3, 6, 6);
shape[5] = vec4(3, 3, 14, 2);
shape[6] = vec4(19, 9, 14, 11);
shape[7] = vec4(12, 15, 20, 3);
    
shape[8] = vec4(8, 1, 1, 8);
shape[9] = vec4(8, 1, 5, 8);
shape[10] = vec4(8, 3, 4, 3);
shape[11] = vec4(12, 15, 20, 3);
    
shape[12] = vec4(5, 2, 6, 6);
shape[13] = vec4(6, 1, 1, 6);
shape[14] = vec4(6, 1, 7, 8);
shape[15] = vec4(7, 2, 8, 4);
    
shape[16] = vec4(3, 2, 8, 3);
shape[17] = vec4(3, 6, 6, 6);
shape[18] = vec4(4, 1, 7, 8);
shape[19] = vec4(7, 2, 8, 4);
    
shape[20] = vec4(2, 2, 2, 2);
shape[21] = vec4(2, 1, 1, 1);
shape[22] = vec4(2, 1, 4, 8);
shape[23] = vec4(3, 2, 5, 7);

// place coordinate origin at zero;
translate(-0.5,-0.5);
scale(0.5,0.5);

var timebase = 0;

// variables used for rendering
var i,i2,stepVal;
var sx,sy,sz,sw;

// fake 4-element vector initializer
// (Yes, I know I could use the new literal array intializers,
// but not everybody has upgraded yet, so...)
function vec4(x,y,z,w) {
  var v = array(4);
  v[0] = x; v[1] = y; v[2] = z; v[3] = w;
  return v;
  
  // the new, simple way! Use this if you've got 3.20 or newer firmware 
  // return [x,y,z,w];
}

// linear interpolation between start and end using val to weight between them.
function mix(start,end,val) {
  return start * (1-val) + end * val;
}

//Threshold function with a smooth transition.  Interpolates with a sigmoidal
//curve 0 and 1 when l < v < h. 
function smoothstep(l,h,v) {
    var t = clamp((v - l) / (h - l), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}

// the actual superformula function
function superformula(phi,a,b,m, n1, n2, n3) {
    var tmp = m * phi / 4;
    var vx = abs(cos(tmp)/a);  var vy = abs(sin(tmp)/b);
    return pow(pow(vx, n2) + pow(vy, n3), -1/n1);
}

export function beforeRender(delta) {
  timebase = (timebase + delta / 1000) % 1000;
  
  // calculate indices for current and next shapes
  i = floor(mod(timebase,24));
  i2 = (i+1) % 24;  
  
  // how far into the morph we are at this time
  stepVal = smoothstep(0.2,0.8,frac(timebase)); 
  
  // interpolate parameters to morph between shapes
  sx = mix(shape[i][0],shape[i2][0],stepVal);
  sy = mix(shape[i][1],shape[i2][1],stepVal);
  sz = mix(shape[i][2],shape[i2][2],stepVal);
  sw = mix(shape[i][3],shape[i2][3],stepVal);    
}

export function render2D(index,x,y) {
  
  var r = superformula(atan2(y,x),1,1,sx,sy,sz,sw);
  r = smoothstep(0,1,r*0.2 - hypot(x,y));
  hsv(timebase+r, 1, r)
}