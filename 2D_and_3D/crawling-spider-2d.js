// Creepy Crawling Spider 2D
// Requires a 2D display with mapping function
// 
// Demonstrates the (ab)use of symmetry and coordinate
// scaling to simplify drawing.
// We only draw two of the spider's 8 legs!
// 
// MIT License
// 9/24/2023 ZRanger1

var lineWidth = 0.15;
var baseHue = 0.022;
var abdomenDiameter = 0.112;
var webCrawl = 0;
var crawlAngle = 0;

// allocate arrays for leg descriptors
// leg1 and leg2 are original (pre-movement) leg segments
// l1 and l2 hold the current position after movement
var leg1 = [0.55,0.25,0.475];
var leg2 = [0.35,0.85,0.35];
var l1 = array(3);
var l2 = array(3);

// rotate a set of legs
function rotateLeg(inLeg,outLeg, angle) {
    var c1,s1;
    c1 = cos(angle); s1 = sin(angle);

    outLeg[0] = (c1 * inLeg[0]) - (s1 * inLeg[1]);
    outLeg[1] = (s1 * inLeg[0]) + (c1 * inLeg[1]);
    outLeg[2] = inLeg[2];
}

// draws a leg (really a line defined by distance from current
// pixel to the specified line segment.) Since spider legs all
// meet in the middle, we can symmetry to simplify the math --
// lines are defined by the origin and one point.
function drawLeg(r,x1,y1,px,py,plen,pcol) {
  
  // see if point is inside this leg's radius, then   
  // compare normalized vectors and make sure they're headed in the 
  // same direction
  if (r > plen) return 0;
  if ((x1 * px + y1 * py) < 0) return 0;
  
  // calculate distance between point and line defined by segment
  z = abs(px * (py - y1) - (px - x1) * py) / plen;

  return 1-(z/lineWidth)
}

var timebase = 0;
var lastPos = 0;
export function beforeRender(delta) {
  timebase = (timebase + delta / 1000) % 3600;
  crawlSpeed = (timebase/9 % 1)
  
  // position of the spider and legs as it crawls across the display
  legAngle = 0.1 * sin(timebase * 8);  
  webCrawl = -3*crawlSpeed + 1.5
  
  // choose random crawl angle after every complete pass
  // much creepier this way
  if (lastPos < webCrawl) {
    crawlAngle = random(PI2);
  }
  lastPos = webCrawl;
  
// move origin to center and rotate so 0 radians is at the top of
// the display, and add additional rotation/translation for
// crawling. Note that the spider moves from side to side a little as
// it crawls across the screen.
  resetTransform();
  translate(-0.5,-0.5);
  rotate(crawlAngle)
  translate(webCrawl,legAngle / 4);    

// move the spider's legs for crawling effect
  rotateLeg(leg1,l1,legAngle);
  rotateLeg(leg2,l2,-legAngle * 0.85);
}

export function render2D(index,x,y) {

  // precalculate distance from actual center (where the legs originate)
  // and from the abdomen.  We rescale the coords slightly to make the spider's
  // front legs longer than the back set.
  r = hypot(x,y) - x / 6; 
  r2 = hypot(x+0.12,y);
  
  // mirror on x and y so we only have to draw two legs. 
  x = abs(x); y = abs(y)

  // draw the legs
  v = drawLeg(r,x,y,l1[0],l1[1],l1[2]);
  v = max(v,drawLeg(r,x,y,l2[0],l2[1],l2[2])); 

  // draw the abdomen (a small circle at a slight offset from the origin)
  v = max(smoothstep(0.45,.8,v),(abdomenDiameter - r2)/abdomenDiameter);
  h = (r2 < abdomenDiameter) ? baseHue : baseHue + r2 / 2;
  
  hsv(h,1, v)   
}