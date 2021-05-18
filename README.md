# PixelblazePatterns
Patterns for Pixelblaze LED controller

## doomfire2d.js

Realistic 2D Fire effect, with "enhanced" dragon's breath mode. Looks best with a diffuser,
but quite in any case. Uses a convolution algorithm inspired by the low-res fire in the
prehistoric PSX port of DOOM!   See code comments for details.
 
Requires a 2D display and appropriate mapping function.

## cycliccellularautomata2d.js
 Displays a cyclic cellular automaton, and a variant of the Greenberg-Hastings CCA: 
 
 https://en.wikipedia.org/wiki/Greenberg%E2%80%93Hastings_cellular_automaton
 
 This flavor of CA is used to model "excitable" systems -- a system that can 
 activate, and support the passage of a wave of some sort, after which it
 must "rest" for some period of time before another wave can pass.  
 
 A forest fire is the canonical example of this kind of system...
 
 Requires a 2D LED array and appropriate pixel mapper.
 
 Cells are randomly initialized according to the current mode and parameter set.
 Some initial condition sets may "fizzle" and die out.  If this occurs, the 
 pattern will automatically re-initialize.
 
 The default settings produce mostly "good" results, but this pattern rewards
 experimentation and a bit of patient watching.  It can produce beautiful visuals
 that would be near impossible to make any other way!
 
## infinityflower.js
Generates and displays a new flower species every couple of seconds. 

Requires a 2D LED array and appropriate pixel mapper.
 
## raindrops2d.js
Top down view of rain falling on a pool.  You control the rain intensity
via Web UI.  Very relaxing to watch, best viewed from a few feet away from your
display.  

Requires a 2D LED array and appropriate (2D) pixel mapper.
 
## sunrise2d.js
2D sunrise/solar activity simulator - an animated sun rises and
shines.  Plenty of surface activity, plus dynamic, particle-system
based corona and solar flares. 

Move the UI slider to see the sunrise again!

Requires a 2D LED array and appropriate (2D) pixel mapper.
 
## nbodygravity2D.js
A 2D n-body gravity simulator. As you'd expect, large numbers of particles at high gravity tend to
collapse and merge.  Lower the gravity a bit, and they'll fly free again.
 
Requires a 2D LED array and appropriate (2D) pixel mapper.

## conwaysllife2d.js
Conway's classic "Game of Life" cellular automaton.  

Requires a 2D LED array and appropriate (2D) pixel mapper.
 
## multisegmentforautomation.js
"Industrial Strength" version of the multisegment pattern that only works
with home automation controllers. All setup and control is done via the 
websockets interface. There is no Web UI.  **If you have a home automation
system that supports it, like the Hubitat Elevation, this is the multisegment
pattern you want.**  See the setup guide, [MULTISEG_HA.md](https://github.com/zranger1/PixelblazePatterns/blob/master/MULTISEG_HA.md) for full instructions
and lists of settings and effects.

## multisegmentdemo.js
Demonstration/testbed for the multisegment pattern, with Pixelblaze Web UI
controls.  If you don't have a home automation system and/or just want
to see what the multisegment pattern can do, this is the one to try! Again,
See the setup guide, [MULTISEG_HA.md](https://github.com/zranger1/PixelblazePatterns/blob/master/MULTISEG_HA.md)
for full instructions and lists of
settings and effects.

## voronoimix2D.js
Draws a bunch of colorful, animated Voronoi distance related patterns.
Lots of UI controls -- this one is an experimental testbed, meant for
exploration and play.

## rule30flasher.js
A computational toy.  Demonstrates how to use the center column of a 
cellular automaton running Wolfram's Rule 30 to generate a high
quality stream of random bits.  Makes pretty blinking lights too.   

## mandelbrot2D.js
Displays an animated view into the Mandelbrot set on a 2D display.
This is very much a work-in-progress.  I'll be optimizing and 
improving for a while, but it's reached the point where it's fun
to watch, so here it is! 

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
 
 (updated to 1.0.2 on 11/30/2020 --Better wavelength adjustment to strip size,
  and additional UI controls) 

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

# Donation
If this project saves you time and effort, please consider donating to help support further development.  Every donut or cup of coffee helps!  :-)

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/donate/?hosted_button_id=YM9DKUT5V34G8)
