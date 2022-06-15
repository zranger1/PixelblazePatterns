// Follow that Star! 2D
//
// Still kind of experimental at this point.
//
// Started life as a frame buffer-less snake pattern, then 
// I started playing around with Minkowski distance using 
// fractional exponents and... Stars!
//
// MIT License
// Take this code and use it to make cool things!
// 6/12/2022 ZRanger1
//

var snakeSize = 0.7;
var segSpacing = 1;
var segments = 4;
var speed = 1.8;

var timebase = 0;
var t1,t2;
var xoffs = array(segments);
var yoffs = array(segments)


translate(-0.5,-0.5); 
scale(2,2)

export function beforeRender(delta) {
  timebase = (timebase + delta / 1000) % 3600;
  t1 = timebase * speed;
  t2 = time(0.1);
  
  // precalculate distance offsets for each segment
  for (i = 0;i < segments; i++ ) {
    var t = t1 - segSpacing * (i+1);     
     xoffs[i] = 0.92 * sin(t) + 0.05 * cos(t * 6);
     yoffs[i] = 0.65 * sin(t * 0.85) + 0.13 * sin(t * 2);     
  }
}

function minkowskiDistance(x1,y1,p) {
  return pow(pow(abs(x1), p) + pow(abs(y1), p),1.0 / p);
}

export function render2D(index,x,y) {
  var b = 0;

  // Add the light contribution of each star to the current pixel value
  for (i = 0; i < segments; i++) {
    var px = xoffs[i];
    var py = yoffs[i];

    // Division is so handy here, I almost feel like it's cheating -- as 
    // distance approaches 0, the value added to b approches infinity, which makes
    // it easy to brighten our stars towards the center.
    b += snakeSize / minkowskiDistance(x-px,y-py,0.375) / (i+1);
  }

  hsv(t2,2.5-b,b*b);
}