/*
  Spinwheel 2D
  Colorful, flowerlike radial spinner.
  Yet another example of the complex and unpredictible things
  that happen when you combine a few simple functions...

   7/09/21 JEM(zranger1)
*/

var t1,t2;
var speed = 6;
translate(-0.5,-0.5);

export function beforeRender(delta) {
  t1 = time(.2) * (-PI * wave(time(0.1)));
  t2 = wave(time(.2)) * speed;
}

export function render2D(index,x,y) {

  var arX = (atan2(x,y)+t1*30);
  var arY = (hypot(x,y)+t2);
  
  var phi = floor(arY) / PI2;
  phi += (phi == 0) * 0.618;
  
  arX = frac(arX);
  arY = frac(arY);
  
  var h = (.1/(arX*arX+arY*arY) * .19) * phi; 
  hsv(t1+(x*y)+h, 1-h, h);
}