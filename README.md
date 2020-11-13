# PixelblazePatterns
Patterns for Pixelblaze LED controller

## bouncer3D.js
 Says "3D", but works on both 2D and 3D displays!

 Bounces from 1 to 20 balls around a 2D or 3D display. Sliders let
 you set object count, size and speed.  In 3D, it looks best on 
 volumetric objects.

 This started as a proof-of-concept for a set of vector utilities, 
 but it turned out interesting enough to stand on its own as a pattern.   

 Because of the way it is optimized, performance goes down, as you'd expect
 with number of objects. But it can go back up as you increase object size.
 There's some fun to be had playing with these parameters to maximize frame
 rate for a given number of objects.

## oasis.js
 Peaceful light dances on waves of green and blue.
 
 A quiet space to rest and reflect on what we've 
 lost in this strangest of years, and to remember
 the beauty that remains, and the tasks that 
 must still be begun and finished...
 
 Inspired by FASTLed's Pacifica effect

## linesplash.js
Creates "waves", drawn as a line on a 2D LED matrix, by randomly dropping objects
from random heights into a linear "pond".

This pattern is fallout from an experiment in using easy-to=compute parts to create a
complex, chaotic-seeming result.  For performance reasons, it's actually built using a simple 
system of virtual "springs", rather than actual fluid dynamics.

Requires a 2D display and appropriate pixel mapper.  Note that you **MUST** set your display 
dimensions in the pattern code for things to work correctly.

## gpiosynchronizer.js
 A set of utility functions that let you use the Pixelblaze's GPIO capability to
 synchronize patterns between two Pixelblazes.  It requires a only small amount of soldering,
 and minor changes to your pattern.  No external hardware or software are needed.
 
 **CAUTION:**  Soldering and basic electronic skills required! To use this, you must connect
 two GPIO pins on each Pixelblaze -- one pin for reading, the other for writing. Be very sure that your
 Pixelblazes are connected to a common ground, or this will almost certainly not work.

 I used GPIO4 and GPIO5 because they were easy to solder, and easy to use. The software lets you choose
 which pin is used for reading and which for writing, software you can wire your pins crossing 4-5, 5-4 
 if you want to use the same pattern on both Pixelblazes, or you can wire them straight across 4-4, 5-5, and cross
 in software by using initGPIO(4,5) on one Pixelblaze and initGPIO(5,4) on the other. 
 
 To use te software, wire up your Pixelblazes, copy the utility code into your pattern and: 
 - Call initGPIO(inPin,outPin) to set up your GPIO pins
 - Call synchronize(delta) from your beforeRender() function
 - Call syncTime() instead of time() for things that need to
   be synchronized.
 - To manually initiate synchronization, call requestSync()
 
 That's it -- your Pixelblazes will synchronize as soon as both are running a gpiosynchronizer-equipped pattern. If
 sync drifts over time, or because of user action, you can add calls to requestSync() as needed. 

## darkbolt.js
Fires an accelerating bolt of darkness down a colored strip. A nice effect on long linear strips. 
There are sliders to control background color, bolt size, speed and direction.

## badfluorescent.js
A Totally Accurate Simulation of a failing fluorescent tube.  Features dim, flickering ends, periodic arc failure,
odd color changes... Will remind you why LEDs are better!  This is part of my complete technological overkill bathroom
mirror lighting system, which reproduces the colors of several different light sources.  It um, sorta snuck in there, and
insists on running every April 1.

## multisegment.js
Allows you to subdivide an LED strip into multiple, independently
controllable segments.  For each segment, you can control on/off state,
color and brightness, and size.  You can also set per-segment effects and
control their speed. 

The slider UI allows you to play with all the settings.  You can also control
each segment via json from an external progam -- it exports an array per segment
with each segment's current settings.

**New:** If you're using multisegment with a home automation system, the sliders may interfere with
setup.  So as of v1.0.2, there is a variable in the pattern that allows you to completely
disable the sliders once you've got things set up.  It's ```useSliderUI``` around line
80.  Set it to 0 to disable sliders, to 1 to enable them.

If you are using ```<n>``` segments, the arrays will be named ```z_0 - z_<n-1>```. The number 
of segments is also exported to json in the variable ```__n_segments```.  Checking for this
variable with ```getVars``` is one way for an external program to reliably determine that 
the multisegment pattern is running on the Pixelblaze.  The pattern code has a description
of the layout of each array.

Multisegment comes configured for four segments, but there is no absolute limit to the number
of segments you can run. To add segments, edit the code to allocate more ```z_<n>``` arrays,
add them to ```segTable``` in the function ```initialize()``` and update the ```__n_segments``` 
variable.  That's it... everything else will just work, though each segment adds a little 
additional overhead.  I'd guess 8 to 10 segments to be the practical limit.

Twelve effects are built in.  They are:

0. **Default** - render the currently selected solid color
1. **Glitter** - fast random sparkles in the current color
2. **Rainbow Bounce** - the default "New Pattern" effect.
3. **KITT** - because KITT is essential. 
4. **Breathe** - brightness slowly "breathes" up and down
5. **Slow Color** - slowly changes hue
6. **Snow** - Occasional icy "sparkles" over current color background.
7. **Chaser Up** - light moves "up" from start of strip.
8. **Chaser Down** - light moves "down" from end of strip.
9. **Strobe** - hideous, but you never known when a rave may occur. Be prepared.
10. **Random Wipe** - random color wipe
11. **Springy Theater** - theater style chaser lights that also change distance.

## cellularautomata1d.js
Renders elementary cellular automata as described by https://mathworld.wolfram.com/ElementaryCellularAutomaton.html
Looks good on a linear LED strip, great on a strip rolled around a pipe or tube!  Can give Star Trek style blinky
computer lights that must be calculating Something Very Important, or more flowing visuals, depending on
parameters.

## midpointdisplacement1d.js
Very fast, organic looking "plasma" patterns!

Uses the recursive midpoint displacement algorithm to create a 1d heightmap of
fractal-ish dimension, then animates by sweeping colors up and down the map. Allows
control of many parameters, and can produce effects ranging from complete chaos to
very smooth moving blends.

## hypersnow.js
Inspired by a pattern in the ws2812fx arduino library.  Flashes a random number of random
pixels on a colored background at random intervals.  Despite all the randomness,
this is actually a cool and relaxing effect. Flash duration (spark hold) and maximum time
between flashes (Max Delay) are controlled by sliders.

## randomdissolve.js
Another pattern that is more relaxing than it sounds.  Random colors dissolve and
reform, randomly.

## springytheater.js
Traditional "theater marquee" style chaser lights, with constantly
changing intervals between the lights.

## randomcolorwipe.js
Wipe transition between random colors.

## july4bounce.js
An example of blending patterns by letting the eye do the 
mixing and averaging.  Red, and blue bouncing pattern,
with illusory white created by the eye averaging at high frame rate.

** CAUTION:** What's actually happening here is that it's rendering
the red part and the blue part on alternate frames.  There actually 
is no white in the pattern at all. Super cool if your strip is running 
around 120 fps or above.  It's a chaotic, blinking mess otherwise.
