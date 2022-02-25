/*
  Stairmaster 2D - a ball bouncing on an escalator

  Best on square matrix displays, but you can use scale(x,y) to adjust
  aspect ratio as necessary for other 2D shapes.
  
  MIT License
  
  2022 ZRanger1
*/

var numSteps = 4;
var ballRadius = 0.125;
var masterClock = 0.08;
var stairTimer,ballTimer;

translate(0,-0.25); // shift display downward a hair for better visibility

// calculate how quickly the stairs move and how far up and down
// the ball bounces.  This will be constant through each frame.
export function beforeRender(delta) {
  stairTimer = time(masterClock);
  ballTimer = -0.1+wave(time(masterClock/numSteps)) * 0.32;
}

export function render2D(index,x,y) {

  // to build stairs, we quantize y on a diagonal line
  var stairs = (y+stairTimer)-floor((stairTimer+x) * numSteps) / numSteps;   

  // the bouncing ball is controlled by the wave built in
  // beforeRender.  Here, we figure out if the current LED is in the ball
  // and display it if it is.
  var ball = hypot(x-0.5,y - ballTimer);
  ball = (ball > ballRadius) ? 0 : 1-(ball/ballRadius);
  
  // combine ball and stairs for display.
  b = max(stairs,ball);
  
  // add a little color, and desaturate the base of the stairs.
  hsv(x,1.25-y,b);
}