export var frequencyData
export var energyAverage
export var maxFrequencyMagnitude
export var maxFrequency

var WINDOWSIZE = 10;

// we're going to measure the average energy in the
// bands below about middle C.  This should give us
// all the instruments that normally drive the beat.
export var energy = array(7);
var avgTimeBetweenPeaks = array(7);
var lastPeak = array(7);

export function beforeRender(delta) {
  for (i = 0; i < 7; i++) {
    energy[i] = frequencyData[i]/energyAverage;
  }
}

export function render2D(index,x,y) {
  e = energy[x * 7]
  if ((energyAverage >= 0.002) && (e >= (1-y))) {
    hsv(x,1,1);
  }
  else {
    rgb(0,0,0);
  }
}