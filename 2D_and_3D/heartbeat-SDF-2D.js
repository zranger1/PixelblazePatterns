// SDF Heartbeat 2D
//
// Another anti-aliased beating heart using 2D signed distance functions from
// https://github.com/zranger1/SDF-LED
//
// Inspired by @geekmomproject's heartbeat pattern:
// https://forum.electromage.com/t/beating-heart-pattern/2418
//
// 12/2022 ZRanger1

var heartSize;

// alternate heart sdf. A little better defined than the standard 
// one on some LED displays
function heart2(x,y,r) {
    // tweak x a little to adjust the aspect ratio of the 
	// final heart
    x = x / r * 0.75;
    
    // signed distance from 1/2 heart, mirrored about x axis
    y = -y / r + 0.5 - sqrt(abs(x));    
    r = hypot(x,y); 
    
    // invert and return distance
    return 1-r;
}

export function beforeRender(delta) {
  
  // heart size, beat amplitude and speed 
  t1 = time(0.012);
  heartSize = 0.35 - 0.1 * wave(t1);
  
  // move the heart around the around in a circle (by moving
  // the coordinate center)
  var offset = PI2 * time(0.1)
  
  resetTransform();  
  translate(-0.5+0.2 * sin(offset),-0.5+0.2 * cos(offset));
}

// render object, color determined by distance from boundary
export function render2D(index,x,y) {
  
  // get normalized signed distance from beating heart figure and
  // flip it so the distance value is 1 at the center, and drops as
  // you move outward.  This gives a rough antialiasing effect.
  d = heart2(x,y,heartSize)/heartSize;
  
  // make a pulsing wave effect moving outward from the center
  d *= 0.15+triangle(t1+d/4)

  // coloring this way counts on the pixelblaze converting negative
  // brightness to 0. Try using d*d as the brightness to see what's really
  // going on here.
  hsv(.9+0.1*d,1,d);
}
