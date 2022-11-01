/*
 Sine Wave Demo 2D
 
 Shows one way of displaying a moving sine wave on a 2D display
 
 09/15/2022 ZRanger1
*/

export var lineWidth = 0.05;
export var fill = 0;
export var speed = 0.04;
export var frequency = 1;


// controls wave movement speed
export function sliderSpeed(v) {
  speed = 0.1 * (1-v);
}

// frequency of sine wave
export function sliderFrequency(v) {
  frequency = 0.5+(2*v);
}

// line width on display
export function sliderLineWidth(v) {
  lineWidth = 0.02 + (v * 0.3);
}

// fill below waveform, or not
export function sliderFill(v) {
  fill = (v >= 0.5);
}

// slowly modulate amplitude up and down
export function beforeRender(delta) {
  amplitude = wave(time(0.1));
}

// most of the work happens here
export function render2D(index, x, y) {

  // flip y axis so "base" of wave is at the bottom of the
  // display.
  y = 1-y;
  
  // calculate current value of our traveling wave and center it
  // on the display
  yWave = 0.5+amplitude * (-0.5+wave(frequency*x+time(speed)));
  
  // just for decoration, draw the wave tops in white...
  if (abs(y-yWave) < lineWidth) {
    rgb(1, 1, 1)
    
  // and fill in area under the wave in color gradient
  } else if (fill && y < yWave) {
    hsv((yWave - y) * 0.5, 1, 1) 
  } 
  
  // pixels not in our region of interest will just be set to black for now
  else rgb(0,0,0)
}