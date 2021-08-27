/* Infinity Flower

 Creates a colorful new flower species every couple of seconds!
 
 Requires a 2D display and appropriate mapping function.

 MIT License
 
 Version  Author        Date      
 1.0.0    JEM(ZRanger1) 05/07/2021
*/ 
var radius = array(pixelCount);   // holds every pixel's distance from center
var angle = array(pixelCount);    // every pixel's positive radial angle from center

var lifespan = 1500;              // how long we display each flower
var transitionLength = 1000;      // how long the spin/generate phase lasts
var speciesTimer = 9999;          // accumulator for frame timing

var drawFrame = renderFirstPass;  // on first pass, calculate per-pixel stats
var prerender = beforeNormal;     // normal renderer

var tolerance;                    // comparison tolerance for angles

var maxPetals = 12;               // this seems like plenty...
var numPetals;                    // petals in current species
var petalShape;                   // rough width of petal
var petalLength;                  // radius of each petal   
var centerHue;                    // color of flower center
var centerSize;                   // radius of flower center
var centerBri;                    // max brightness of flower center
var colorVariant;                 // enables additional petal coloring
var petals = array(maxPetals);    // holds information on each petal
var p1 = array(2);                // scratch x,y point array for calculation

// allocate space for petal information. Fields are, in order:
// x,y,angle,hue.  
function allocate() {
  for (i = 0; i < maxPetals;i++) {
    petals[i] = array(4);
  }
}

// Create a new flower species with (constrained) randomized parameters.
function initialize() {
  numPetals = max(2,floor(random(maxPetals)));
  petalLength = 0.35 + random(0.3);
  petalShape = 3+random(4);
  petalHue = random(1);
  centerHue = petalHue + 0.61803;  // golden ratio conjugate makes good contrasting colors
  centerSize = (random(1) < 0.7) ? 0.11 : 0.1;
  colorVariant = random(1) > 0.5;
  
  var hueVariance = (0.1 * (-0.5 + random(1)))
  var petalAngle = 2.39996;        // golden angle separates petals
  
  p1[0] = 0.5; p1[1] = petalLength + 0.5;

  for (i = 0; i < numPetals;i++) {
    petals[i][3] = petalHue + ((i % 2) * hueVariance);
    
    setRotationAngle(petalAngle);      
    rotateVector2D(p1,petals[i]);
    petals[i][2] = petalAngle;  
    
    petalAngle += 2.39996;
  }  
  
  setRotationAngle(0);
}

// wrapper for atan2 that returns positive angle 0-PI2
function positiveAtan2(x,y) {
  var rad = atan2(x,y);
  return (rad >= 0) ? rad : rad + PI2;
}

// set angle for subsequent 2D rotation calls
function setRotationAngle(angle) {
  cosT = cos(angle); sinT = sin(angle);
}

var cosT = 0;  var sinT = 0;
function rotateVector2D(vIn, vOut) {
    var x = vIn[0] - 0.5;  var y = vIn[1] - 0.5;
    vOut[0] = (cosT * x) - (sinT * y) + 0.5;
    vOut[1] = (sinT * x) + (cosT * y) + 0.5;
}

function renderFirstPass(index,x,y) {
  x -= 0.5; y -= 0.5;
  radius[index] = hypot((x),(y));
  angle[index] = positiveAtan2(x,y);
  if (index == (pixelCount - 1)) drawFrame = renderNormal;
}


function renderNormal(index,x,y) {
  var h,v,pWidth;

// if pixel is outside max radius, nothing to do  
  if (radius[index] > petalLength) {
    rgb(0,0,0);
    return;
  }
  
// color and shade flower center pixels
  if (radius[index] < centerSize) {
    hsv(centerHue,1,centerBri * wave(-0.25+(radius[index]/centerSize*0.9)));
    return;
  }
  
  // determine for the width of petal at a given radius.
  // angular comparison tolerance has to decrease with radius to compensate for
  // fixed pixel pitch in display.  
  tolerance = 0.06*(0.707/radius[index])
  pWidth = tolerance * petalShape * (wave(-0.25+(radius[index]/petalLength)));

// color pixel if it lies on a petal.
  for (i = 0; i < numPetals; i++) {
    v = PI-abs(PI - abs(angle[index] - petals[i][2]));    
    v = (v <= pWidth) ? max(0.01,v) : 0;
    if (v > 0) {
      h = petals[i][3] + (colorVariant * radius[index] * 0.7);
      break;
    }
  }

  hsv(h, 1-(v*0.33), v) 

}

// beforeRender() function that runs when we're building a new flower
function beforeTransition(delta) {
  speciesTimer += delta;
  
// when transition is done, stop spinning and switch back to the
// normal display beforeRender function.
  if (speciesTimer >= transitionLength) {
    initialize();
    speciesTimer = 0;
    centerBri = 1;
    prerender = beforeNormal;
  }
  
  centerBri = 1-(speciesTimer / transitionLength);

  for (i = 0; i < numPetals; i++) {
    rotateVector2D(petals[i],petals[i]);   
    petals[i][2] = positiveAtan2(petals[i][0]-0.5,petals[i][1]-0.5);
  }  
}

// beforeRender() function that displays the current flower species.
function beforeNormal(delta) {
  speciesTimer += delta;
  
// when we're ready to build a new species, start the spinning effect
// and set the beforeRender function to the transition 
// generator.
  if (speciesTimer >= lifespan) {
    prerender = beforeTransition;
    setRotationAngle((random(1) < 50) ? 1 : -1);
    speciesTimer = 0;
  }
}

// main entry point
allocate();
initialize();

// system callbacks
export function beforeRender(delta) {
  prerender(delta);
}

export function render2D(index,x,y) {
  drawFrame(index,x,y);
}