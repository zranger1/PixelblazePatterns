// analog clock using distance function (no backing buffer) for
// drawing.
// MIT License
// 7/2021 ZRanger1

// allocate arrays for hand description vectors
var hourX,hourY,hourLen = 0.4, hourHue = 0.333;
var minuteX,minuteY,minuteLen = 0.5, minuteHue = 0;
var secondX,secondY, secondLen = 0.56, secondHue = 0.6667
var milliX, milliY, milliLen = 0.22, milliHue = 0.22;

var hour, minute, second, milli;
var lastSecond = -1;
var hue;
export var tolerance = 0.055;

// move origin to center and rotate so 0 radians is at the top of
// the display.
translate(-0.5,-0.5);
rotate(PI/2);

//export function sliderWidth(v) {
  //tolerance = v * v;
//}

// rotate 2d vector around origin,
var outX,outY;  // icky hack to return two values
function rotateVector2D(px,py, angle) {
    var c1,s1;
    c1 = cos(angle); s1 = sin(angle);
    outX = (c1 * px) - (s1 * py);
    outY = (s1 * px) + (c1 * py);
}

// distance from point to specified radial hand (really a line segment
// defined by the origin and one point)
function pointOnHand(x1,y1,px,py,plen,pcol) {
  
  // see if point is inside this hand's radius, then   
  // compare normalized vectors and make sure they're headed in the 
  // same direction
  if (r > plen) return 0;
  if ((x1 * px + y1 * py) < 0) return 0;
  
  // calculate distance between point and line defined by segment
  z = abs(px * (py - y1) - (px - x1) * py) / plen;
  if (z > tolerance) return 0;
  
  hue = pcol;
  return 1.1-(z/tolerance)
}

export function beforeRender(delta) {
  
  // retrieve the system time
  hour = clockHour();
  minute = clockMinute();
  second = clockSecond();

  // do the continuous second hand movement thing...    
  if (second != lastSecond) {
    milli = 0;
    lastSecond = second;
  } else {
    milli = (milli + delta) % 1000;    
  }

  // set up hand lengths and rotate hands into proper position
  rotateVector2D(hourLen,0,-PI2 * ((hour + minute/60) % 12 ) / 12)
  hourX = outX; hourY = outY;
  
  rotateVector2D(minuteLen,0,-PI2 * ((minute + second/60) % 60) / 60);;
  minuteX = outX; minuteY = outY;
  
  rotateVector2D(secondLen,0,-PI2 * ((second + milli/1000) % 60) / 60);
  secondX = outX; secondY = outY;
  
  rotateVector2D(milliLen,0,-PI2 * milli / 1000);
  milliX = outX; milliY = outY;
}

var r,nx,ny;
export function render2D(index,x,y) {
  // precalculate distance from center for current pixel since we
  // use it for each hand
  r = hypot(x,y); 

  v = pointOnHand(x,y,milliX,milliY,milliLen,milliHue);
  v += pointOnHand(x,y,secondX,secondY,secondLen,secondHue);  
  v += pointOnHand(x,y,minuteX,minuteY,minuteLen,minuteHue);    
  v += pointOnHand(x,y,hourX,hourY,hourLen,hourHue);  

  hsv(hue, 1, v*v*v)   
}