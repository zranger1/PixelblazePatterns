// todo - generate random new flowers

var radius = array(pixelCount);
var angle = array(pixelCount);
export var drawFrame = renderFirstPass; 

var tolerance = 0.1;   // minimum line width in % of display

var maxPetals = 12;
export var numPetals = 4;
var petals = array(maxPetals);
export var petalShape = 3;
export var petalLength = 0.5;
var rSpeed = 0.06;

export function sliderPetals(v) {
  var n = 1+floor(v * (maxPetals - 1))
  if (n != numPetals) {
    numPetals = n;
    initialize();
  }
}

export function sliderPetalShape(v) {
  petalShape = 1+(5 * v);
}

export function sliderPetalLength(v) {
  var n = 0.25 + (0.35 * v*v);
  if (n != petalLength) {
    petalLength = n;
    initialize();
  }
}

export function sliderRotation(v) {
  rSpeed = v * v;
}

// x,y,width,hue
function allocate() {
  for (i = 0; i < maxPetals;i++) {
    petals[i] = array(4);
  }
}

var p1 = array(2);  // scratch point array

// successive petals are separated by the golden angle
// 137.5077
function initialize() {
  p1[0] = 0.5; p1[1] = petalLength + 0.5;
  var petalAngle = 2.39996;
  for (i = 0; i < numPetals;i++) {
    setRotationAngle(petalAngle);
    rotateVector2D(p1,petals[i],petalAngle);
    petalAngle += 2.39996;
  }  
}

function positiveAtan2(x,y) {
  var rad = atan2(x,y);
  return (rad >= 0) ? rad : rad + PI2;
}

function setRotationAngle(angle) {
  cosT = cos(angle); sinT = sin(angle);
}

var cosT = 0;  var sinT = 0;
function rotateVector2D(vIn, vOut, angle) {
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

var pWidth
function renderNormal(index,x,y) {
  h = 0.65
  s = 0.9
  v = 0;
  
  if (radius[index] < 0.14) {
    hsv(0.08,1,0.6);
    return;
  }
  
  if (radius[index] > petalLength) {
    rgb(0,0,0);
    return;
  }
  
  // equation for the width of petal at a given radius.
  pWidth = tolerance * petalShape * (wave(-0.25+(radius[index]/petalLength)));
    
  for (i = 0; i < numPetals; i++) {
    var v1 = PI-abs(PI - abs(angle[index] - petals[i][3]));    
    v1 = (v1 <= pWidth) ? max(0.01,v1) : 0;
    if (v1 > v) { v = v1; h = i /numPetals; break;}
  }

  hsv(h, 1-(v*v), v*2) 
}

allocate();
initialize();

export function beforeRender(delta) {
  setRotationAngle(rSpeed);

  for (i = 0; i < numPetals; i++) {
    rotateVector2D(petals[i],petals[i],rSpeed);   
    petals[i][3] = positiveAtan2(petals[i][0]-0.5,petals[i][1]-0.5);
  }
}

export function render2D(index,x,y) {
  drawFrame(index,x,y);
}