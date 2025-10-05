// 1D Firelight glow for LED strips
// 10/2025 ZRanger1


export var speed = 0.0125;
export var complexity = 5.6;


// controls movement speed
export function sliderSpeed(v) {
  speed = mix(0.005,0.2,v*v)
}

// controls the complexity of the pattern
export function sliderComplexity(v) {
  complexity = 0.5 + v * 8
}

// generate a single layer of our noise field
function fbm(x,y) {
  return perlinFbm(x,y,PI,complexity,0.8,3);
}

// build slow moving fire-like pattern from layers of noise
function pattern(px,py) {
  k = sin(PI2 * px + t1)
  
  r = fbm(k,py + t1);
  r -= fbm(py - t1,k);
  
  return 0.5 + r / 2;
}

var timebase = 0;
var t1;
export function beforeRender(delta) {
  timebase = (timebase + delta / 1000)  % 3600;
  t1 = timebase * speed;
}

export function render(index) {
  // find value of noise field at this pixel
  pos = index/pixelCount;
  var f = pattern(pos, 1-pos);
  
  // compute fire color, saturation and brightness from noise field value
  
  // constrain hue to the yellow/orange range
  hue = 0.002 + f * 0.03;
  
  // desaturate the highest values just a little to make
  // it look hotter
  sat = 1.925 - f;
  
  // use gamma adjusted value for brightness
  bri = f * f;
  
  hsv(hue, sat, bri);
}