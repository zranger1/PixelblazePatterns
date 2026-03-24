
/*
 Scary Pumpkin 2D
 
 10/25/2025 ZRanger1
*/

translate(-0.5,-0.5);
var timebase = 0;
export var speed = .15;

// rotate point around origin by by <angle> radians
// place result in globals outx, outy
var outx,outy
function rotate2D(inx,iny,angle) {
   var cosT = cos(angle);
   var sinT = sin(angle);  
  
    var x = inx - 0.5;  var y = iny - 0.5;
    outx = (cosT * x) - (sinT * y) + 0.5;
    outy = (sinT * x) + (cosT * y) + 0.5;
}

// Pixelblaze signed distance functions from 
// https://github.com/zranger1/SDF-LED
function moon(x,y,radius,cutoutRadius,cutoutPos) {
  var c2,a,b;
  y = abs(y); x =-x;
  c2 = cutoutPos * cutoutPos;
  a = (radius*radius - cutoutRadius*cutoutRadius + c2) / (2*cutoutPos);
  b = sqrt(max(radius*radius-a*a,0));
  if ((cutoutPos*(x*b-y*a)) > (c2*max(b-y,0.0))) {
    return hypot(x - a,y - b);
  }
  return max(hypot(x,y) - radius,-(hypot(x - cutoutPos, y)-cutoutRadius));
}

function triangle(x,y,r) {
	return max((abs(x) * 0.866025) - (y * 0.5), y) - r / 2;
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
  
  // per-frame animation timers
  noiseTime = timebase * speed;
  noiseYTime = timebase * speed  / 2;
  
  // tan is a nice way to get "organized" random flashing
  flash =  tan(cos(timebase * 2+sin(30*timebase)))
}

export function render2D(index, x, y) {
  
  // make a simple tunnel effect by rotating every pixel a little according to how far it is
  // from the center.  You can make a tunnel out of anything this way!
  r = hypot(x,y)
  
  // fast exit for things outside the pumkin's radius
  if (abs(r) > 0.55) {
    rgb(0,0,0)
    return
  }

  // build mask for face
  eyel = triangle(x - 0.24, y + 0.25 , 0.17)
  eyer = triangle(x + 0.24, y + 0.25, 0.17)
  nose = triangle(x,y - 0.08,0.172)  
  smile = moon(y,x, 0.4, .4, .1)
  isFace = (nose < 0 || eyel < 0 || eyer < 0 || smile < 0)
  
  // draw face, or animated pumpkin noise background
  if (isFace) {
    h = 0.33333
    v = flash 
    s = 1
  }
  else {
    dist = 2/r;
    rotate2D(x,y,dist);    
    v = max(0.025,abs(perlinFbm(outx + noiseTime,outy + noiseYTime,noiseTime, 1,0.8, 3)) / 3.5)
    h = 0.02*v+v*.25
    s = 1-v*0.15
  }

  hsv(h,s,v);
}

