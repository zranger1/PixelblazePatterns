#!/usr/bin/env python3
"""
 multisegtest.py
 
 Utility for testing the Multisegment for Automation Pixelblaze pattern
 Requires the pixelblaze-client library, available from pypi, or via pip
 
 Copyright 2020-2022 JEM (ZRanger1)

 Permission is hereby granted, free of charge, to any person obtaining a copy of this
 software and associated documentation files (the "Software"), to deal in the Software
 without restriction, including without limitation the rights to use, copy, modify, merge,
 publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
 to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or
 substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
 AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

"""
import sys
import json
import random
import math
from pixelblaze import *

# segment parameter indices
seg_state  = 0  # on/off switch
seg_hue    = 1  # hue 
seg_sat    = 2  # saturation
seg_bri    = 3  # brightness
seg_effect = 4  # effect number
seg_size   = 5  # segment size
seg_speed  = 6  # effect speed
seg_tfade  = 7  # fade time

if __name__ == "__main__":
    # TODO - grab first Pixelblaze in enumerator list
    
    pixelblazeIP = "192.168.1.19"     # insert your own IP address here
    segments = 12                     # number of segments to create for test
    
    # create a Pixelblaze object.
    pb = Pixelblaze(pixelblazeIP)   # use your own IP address here
    pb.stopSequencer()              # make sure the sequencer isn't running    
    print("Pixelblaze object created and connected!")
    
    print("Checking pattern and version number.")
    dat = pb.getVars()
    if not '__ver' in dat:
        print("Be sure your Pixelblaze is running the Multisegment for Automation pattern and restart.")
        pb.close()
        sys.exit(0)
        
    if (dat['__ver'] < 3):
        print("Version 3 of Multisegment for Automation is required.")
        pb.close()
        sys.exit(0)    
        
    pixelCount = pb.getPixelCount()
    print("Segments: %d  Pixel count: %d" % (segments,pixelCount))
   
    # TODO - check data for proper pattern and version number.    
    print("Starting test. Press <Ctrl-C> to exit.")
       
    # set number of segments 
    pb.setVariable('__n_segments',segments)
     
    # initial segment configuration
    v = {}
    i = 0
    hue = random.random()
    while (i < segments):
        # create segment record with default values
        segName = f'z_{i}'
        v[segName] = [1,0,1,0,0,1,1,0]  # default values for new segment
        
        # set up segment for test
        v[segName][seg_state] = 1  # on
        v[segName][seg_hue] = math.floor(hue * 1000) / 1000 
        v[segName][seg_sat] = 1  
        v[segName][seg_bri] = 1 
        v[segName][seg_effect] = 0  
        v[segName][seg_size] = math.floor(pixelCount/segments) 
        v[segName][seg_speed] = 0.33
        v[segName][seg_tfade] = 0;  
        
        i = i + 1
        hue = (hue + 0.618) % 1
    pb.setVars(v)
    time.sleep(1)
    
    # Thrash the Pixelblaze
    while True:
        i = 0
        while (i < segments):
            segName = f"z_{i}"
                      
            # change things when segments are on an "off" cycle.
            if (v[segName][seg_bri] == 1):
                # generate random effect but make sure that at least 20% of segments are 
                # solid colors
                n = math.floor(19 * random.random())
                if (0 == (n % 4)):
                    n = 0           
                v[segName][seg_effect] = n
                
                # random fade time from 0 - 5 seconds.
                v[segName][seg_tfade] = 5*random.random()
                
            # if segment is off, switch on.  If on, switch off
            if (v[segName][seg_bri] == 0):
                n = 1
            else:
                n = 0
                
            v[segName][seg_bri] = n                
            i = i + 1
    
    # send command to change all segments at once, then
    # pause long enough to give fades time to complete.  
        pb.setVars(v)    
        time.sleep(5)
                   
    pb.close()
    print("Testing: Complete!")
        
        
        
        