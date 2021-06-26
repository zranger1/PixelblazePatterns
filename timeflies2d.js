/* Time Flies 2D

 "Time flies like an arrow.  Fruit flies like a banana..."
 Many bugs with flapping wings -- food for Jeff's excellent Snake 2D:
 
    https://forum.electromage.com/t/task-8-serpentine-square/1088/7
 
 Uses a similar additive wave noise generator to control movement.
 Requires a 2D display and appropriate mapping function.

 MIT License
 
 Version  Author        Date      
 1.0.0    JEM(ZRanger1) 06/26/2021
*/ 

// fly vector array indices
var FLY_VECTOR_SIZE = 7;
var _x = 0;
var _y = 1;
var _heading = 2;
var _speed = 3;
var _noiseT = 4;
var _hue = 5;
var _size = 6;

// animation control variables
var t1,t2;
var frameTime = 9999;
var moveTime = 9999;
var numFlies = 7;
var maxTurn = 0.25;
var maxSpeed = 0.12;
var minSpeed = 0.002;

var flies = array(numFlies)

function initFlies() {
  for (var i = 0; i < numFlies; i++) {
     flies[i] = array(FLY_VECTOR_SIZE);
     flies[i][_x] = random(1);
     flies[i][_y] = random(1);
     flies[i][_heading] = random(1);
     flies[i][_speed] = 0;     
     flies[i][_noiseT] = random(1);
     flies[i][_hue] = i / numFlies;
  }
}

function moveFlies(headingChange) {
  for (var i = 0; i < numFlies; i++) {
    flies[i][_noiseT] = (t1 + flies[i][_noiseT]) % 1;    
    flies[i][_speed] = clamp(flies[i][_speed] + waveNoise1(flies[i][_noiseT]),minSpeed,maxSpeed);  
    flies[i][_x] = clamp(flies[i][_x] - (cos(flies[i][_heading] * PI2) * flies[i][_speed]),0,1);
    flies[i][_y] = clamp(flies[i][_y] - (sin(flies[i][_heading] * PI2) * flies[i][_speed]),0,1); 
    flies[i][_size] = 0.055 + t2;

    if (headingChange) {
     var dx = flies[i][_x] - 0.5; var dy = flies[i][_y] - 0.5;
     var t = hypot(dx,dy) // sqrt(dx * dx + dy * dy);  // for Pixelblaze 2
     var t = maxTurn * (6*t);
     flies[i][_heading] = frac(flies[i][_heading] + waveNoise1(flies[i][_noiseT]) * t);      
    }   
  }
}

// yet another additive sine based noise function.  Range is
// between (-1,1), with a fairly jagged profile, 
// as befits flying flies
var frequency = 4;
function waveNoise1(x) {
  var y = triangle(x * frequency);
  y += wave(x*frequency*2.1 )*4.5;
  y += wave(x*frequency*2.221 + 0.437)*5.0;
  y += wave(x*frequency*5.296+ 4.269)*2.5;
  y = (y * 0.19) - 1.25;
  return y;
}

initFlies();

// beforeRender
export function beforeRender(delta) {
  t1 = time(15/65.535);   // time to traverse the noise field
  t2 = 0.033*time(0.004); // wing flap timer
  
  frameTime += delta;
  moveTime += delta;
  
  if (moveTime > 60) {
    var headingChange = frameTime > 200;
    moveFlies(headingChange)
    moveTime = 0;
    if (headingChange) frameTime = 0;
  }
}

export function render(index) { ; }

export function render2D(index,x,y) {
  v = 0; h = 1;
  for (var i = 0; i < numFlies; i++) {
    dx = x - flies[i][_x]; dy = y - flies[i][_y];
    if (abs(dx+dy) > flies[i][_size]) continue;
    //h = sqrt(dx * dx + dy * dy);  // for Pixelblaze 2
    h = hypot(dx,dy);
    if (h < flies[i][_size]) {
      v = 1-(h<<3); v = v*v*v;
      h = flies[i][_hue];
      break;
    }
  }
  hsv(h,1,v);  
}
