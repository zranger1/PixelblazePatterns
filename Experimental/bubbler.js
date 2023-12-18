numSparks = 7
timebase = 0;

ISEM = 0.8        
ISER = 0.35;      

friction = 1 / 600

velocity = array(numSparks)
position = array(numSparks)
pixels = array(pixelCount)

for (i = 0; i < numSparks; i++) {
  velocity[i] = random(pixelCount)
  position[i] = randomSpeed();
}

function randomSpeed() {
  return ISEM + random(ISER) - ISER / 2
}


export function beforeRender(delta) {
  timebase = (timebase + delta / 1000) % 3600;
  delta *= 0.1
  lump = perlin(timebase / 2,delta,PI,PI);
  
  for (i = 0; i < pixelCount; i++)
    pixels[i] *= min(0.1 / delta, 0.99)
  
  // Examining each spark...
  for (i = 0; i < numSparks; i++) {

    if (velocity[i] <= 0) {
      if (lump > 0.1) {
        velocity[i] = randomSpeed();
        position[i] = 0
      }
      continue
    }
    
    // Slow it down (lose some energy) with friction, which is proportional to 
    // the time that's passed
    velocity[i] += friction * delta
    
    position[i] += velocity[i]  * velocity[i] * delta / 8

    if (position[i] >= 70) {
      position[i] = 0
      velocity[i] = 0
    }
    
    pixels[position[i]] += 0.99
  }
}

export function render(index) {
  if (index >=70) {
    rgb(0,0,0);
    return;
  }
  k = index/pixelCount;
  a = 0.165*perlin(15*(k - timebase / 10),0.666,0.333,PI2) 
  v = pixels[index]
  v = v * v;
   
  if (v <= 0.08) {
    hsv(.64+a, 1, 0.08)    
  }
  else {
    hsv(.64+a, 0.5 , v)
  }
}
