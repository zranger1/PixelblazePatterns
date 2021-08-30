// RADAR 2D
// 2021 ZRanger1

var dishAngle;
export var beamWidth = 0.225;

export function sliderRadarWidth(v) {
  beamWidth = .02+0.5*v;
}

export function beforeRender(delta) {
  // create a position for our spinning "radar dish" with
  // angle that revolves from 0 to 1.
  dishAngle = time(.03)
  
  // use another timer for the current radius of an
  // expanding circle.
  circleRadius = time(0.015);
}

export function render2D(index, x, y) {
  // center coordinates in matrix
  x -= 0.5; y -=0.5;             
  
  // calculate angle to (x,y) and convert radians to 0..1 percentage
  // of full circle
  v = (PI + atan2(x, y))/PI2;
  
  // calculate absolute distance between angle to (x,y) and
  // the "dish angle" currently indicated by the sawtooth
  // wave we made in beforeRender
  d =  0.5-abs(0.5 - abs(dishAngle - v));
  
  // use the angular distance to mask off the parts of the
  // display we don't need
  v = (d < beamWidth) ? 1-(d/beamWidth) : 0;
  
  // calculate radius at this point, and use it
  // to set the pixel hue
  h = sqrt(x*x + y*y);  

  // if radius is near our expanding circle radius,
  // desaturate the point so it's white, and allow
  // it to be drawn around the entire circle.
  if (abs(h-circleRadius) < 0.05) {
    s = 0;
    v = 0.5
  }
  else {
    s = 1;
  }

  hsv(h, s, v*v*v*v)
}