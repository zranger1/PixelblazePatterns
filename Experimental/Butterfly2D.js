// Procedural Butterfly v1
// May 2024 - ZRanger1
//
// MIT License
// Take this code and make cool things!
//

var wingShapeSeed;
var wingTextureSeed;
var wingNoiseScale = 100;
var textureFlapScale;
var timebase = 0;
var flap = 0;
var flapSpeed;
var yOffs = 0;
var theta = 0;
var hue = random(1);

// returns sine wave w/frequency that varies smoothly over time
function frequencyAtTime(t,period,fmin,fmax) {
  return fmin + ((fmax - fmin) / 2) * (1 + sin(PI2/period * t))
}

// basic butterfly wing SDF adapted from https://www.shadertoy.com/view/ttKBzz
var t,r
function butterfly(x,y) {
    y *= -1.5;
    x *= 2.25 * (1 - sin(4 * y) * 0.1);
    xp = x * 20;
    yp = y * 20;

	  t = atan2(yp, xp);
	  r = hypot(xp,yp);
	  
    wing = 
        11. - .5*sin(1.* t) 
           + 2.5*sin(3.* t) 
           + 2.0*sin(5.* t) 
           - 1.7*sin(7.* t) 
           + 3.0*cos(2.* t) 
           - 2.0*cos(4.* t) 
           - 0.4*cos(16.*t)
           - r;

    // add a little perlin noise to create different wing variations.
    wing += 3.5 * perlin(xp,yp,wingShapeSeed,wingTextureSeed);
    return smoothstep(-2, 0, wing); 
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
  
  flapSpeed = frequencyAtTime(timebase,6,0,11)  
  flap = 0.65 + 1.42 * wave(flapSpeed);  
  
  // change wing shape and color pattern when the butterfly is still;
  if (flapSpeed <= 0.0004) {
    wingShapeSeed = random(255);
    wingColorSeed = random(255);
    yOffs = 0;
    theta = 0.675 * (random(PI) - (PI/2));
    hue += 0.618
  }
  // when flapping get fast enough, we fly away!
  else if (flapSpeed >= 6) {
    yOffs = yOffs+0.01
  }

  resetTransform()
  
// center origin and rotate to departure angle
  translate(-0.5,-0.5);
  rotate(theta)
}

export function render2D(index,x,y) {
  // mirror x across Y origin so we get both wings
  x = abs(x);
  y += yOffs;
  
  // draw basic butterfly shape
  bri = butterfly(x*flap,y);
  
  // noise texture for color/brightness pattern on wings
  p =  0.5 * (1 + perlin(flap * x * 6, y * 6,PI,wingColorSeed));

  // color wing texture in up to 5 complementary hues
  c = hue + 0.618 * floor(p / 0.2) * 0.2;

  // draw butterfly shape and noise texture
  hsv(c,1.55-p, bri * max(0.025,p * p * p));
}