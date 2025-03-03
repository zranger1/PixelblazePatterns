export var testSwitch = 0
export var virtualSwitch = 0

export var prevState = 0
export function toggleGo(isOn) {
  prevSwitchState = testSwitch
  testSwitch = isOn
}

// data from sensors comes in here...
var activationTime = -1

export var switchBri;


// time, in seconds, that it takes to "fade in" on sensor activation
var FADE_IN_TIME = 2

// time it takes to fade out after sensor deactivation, once 
// hold time expires
var FADE_OUT_TIME = 2

// minimum time the pixel block will be lit following sensors
// activation.  Can be zero
var MIN_HOLD_TIME = 1

function getBrightness(delta) {
   fadeIn = fadeOut = 1;

   if (virtualSwitch) {
     // if the switch is on, run the fade in 'till we reach full brightness        
     switchBri += delta/(FADE_IN_TIME * 1000)
   }
   else {
     // if it's off, run fade out 'till we reach zero.
     switchBri -= delta/(FADE_OUT_TIME * 1000)
   }
   switchBri = clamp(switchBri,0,1)
}

var timebase = 0
export function beforeRender(delta) {
  // time in seconds, wraps about every 4 hours of continuous 
  // run time.
  timebase = (timebase + delta/1000) % 14400
  
  // when switch changes state start the minimum hold timer
  // (can also act as a debouncer)
  if (testSwitch != prevSwitchState) {
    if (testSwitch) {
      activationTime = timebase
      virtualSwitch = 1
    }
  }

  virtualSwitch = testSwitch || ((timebase - activationTime) <= MIN_HOLD_TIME)

  
  
  getBrightness(delta)
  
  t1 = time(.1)
}

export function render(index) {
  h = t1 + index/pixelCount
  s = 1
  v = 1
  hsv(h, s, switchBri)
}