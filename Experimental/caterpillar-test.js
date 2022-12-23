// Caterpillar movement test
//
// Drives a multi-segment critter around the screen, using
// a sinusoid to play with the distance between segments.
//
// MIT License
// 12/2022 ZRanger1
//

var wormSize = 0.075;
var segSpacing = .34;
var segments = 5;
var speed = .61;

var timebase = 0;
var t1,t2,t3;
var xoffs = array(segments);
var yoffs = array(segments)

// center origin and scale coords so they range from -1 to 1
translate(-0.5,-0.5); 
scale(2,2)

export function beforeRender(delta) {
  timebase = (timebase + delta / 1000) % 3600;
  t1 = timebase * speed;  // movement speed
  t2 = time(0.1);         // color change speed
  
  // calculate segment distance stretch/squish
  t3 = 0.5+0.5*(1-wave(time(0.03)));

  // move the entire critter along a circular path
  for (i = 0;i < segments; i++ ) {
    var t = t1 + (segSpacing*t3 * (i+1));    
     xoffs[i] = 0.9 * sin(t)
     yoffs[i] = 0.9 * cos(t)
  }
}

export function render2D(index,x,y) {
  var b = 0;

  // Add the light contribution of each segment to the current pixel value
  for (i = 0; i < segments; i++) {
    var px = xoffs[i];
    var py = yoffs[i];

    b += wormSize / hypot(x-px,y-py) ;
  }
  
  b = smoothstep(0.5,5.4,b)  
  hsv(t2,1-b/6,b);
}