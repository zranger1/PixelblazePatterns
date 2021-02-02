# Setting up and Using the Multisegment for Automation pattern
This pattern allows you to divide an LED strip into up to 12 independently
controllable segments.  Each segment acts as an independent RGB color bulb. 
You can control on/off state, color and brightness, and size. You can also set per-segment effects and
control their speed. 
## Setup for Hubitat Elevation
 - Install the Pixelblaze device handler to your Hubitat and create a Hub device for it
 - Confirm that you're able to connect and control your Pixelblaze from the Hub.
 - Copy multisegmentforautomation.js to your Pixelblaze, either by pasting the code from this repository into the Web UI's editor, or by
downloading and importing the .epe version from the hubitatpixelblazedriver repository.

Once the pattern is saved on your Pixelblaze, you're ready to configure segments. If everything is working, you will see... nothing.  All 
LEDs will be off at this point.
## Configuring Segments
#### Set Preferences
In the preferences on your Hub's Devices page for the Pixelblaze:
- Enable "Use multisegment pattern"
- Set the number of segments you wish to use (1-12)
- Press "Save Preferences".
#### Create Child Devices 
Back at the top of the Devices page:
- Press the "Initialize" button, then press "On" to be sure
your Pixelblaze device is turned on.
- Switch to the multisegment pattern if you're not already running it.
- Press "Reset Segments" to create the child devices for each of your segments.
- Check the hub's device list. Your child devices should now be listed under the main device, ready to go.
#### Configure Child Devices
This is the slightly tedious part, but it only has to be done once.
- Go to the Device page for each child and set its size and other parameters as necessary.  You can change these settings, including size, at any time. Your
settings for each segment will automatically be saved as you change them. They will be preserved through Pixelblaze
and/or Hub reboots.
#### Changing Segment Setup
At any point, you can change the number of segments. Size/color/effect settings for segments you have already
configured will be preserved.  To increase or decrease the number of segments:
- Set the number you want in preferences and save it.
- Select the multisegment pattern on your Pixelblaze.
- Press the "Reset Segments" button.  
- Repeat the "Configure Child Devices" process for any segments you need to set up.

To clear all segments, just set the number of segments to 0 or disable "Use multisegment pattern" and press
"Reset Segments".   All existing segments will be deleted.
## Effects
Eighteen effects are built in.  They are:

0. **Default** - render the currently selected solid color
1. **Glitter** - fast random sparkles in the current color
2. **Rainbow Bounce** - a rainbow bounces from one end of the segment to the other
3. **KITT** - because KITT is essential. 
4. **Breathe** - brightness slowly "breathes" up and down
5. **Slow Color** - slowly changes hue
6. **Snow** - Occasional icy "sparkles" over current color background.
7. **Chaser Up** - light moves "up" from start of segment.
8. **Chaser Down** - light moves "down" from end of segment.
9. **Strobe** - hideous, but you never known when a rave may occur. Be prepared.
10. **Random Wipe Up** - random color wipe from start of segment to end
11. **Random Wipe Down** - random color wipe from end to start
12. **Springy Theater** - theater style chaser lights that also change distance.
13. **Color Twinkles** - twinkling holiday light effect.
14. **Plasma** - bright ball of "plasma" moves back and forth on segment
15. **Ripples** - relaxing waves... kind of a mini-Oasis.
16. **Spin Cycle** - bright colors move and spin
17. **Rainbow Up** - rainbow moves from segment start to end
18. **Rainbow Down** - rainbow moves from end to start of segment.


