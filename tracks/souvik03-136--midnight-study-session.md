# Midnight Study Session

**Author:** [@souvik03-136](https://github.com/souvik03-136)  
**Genre:** lofi-hiphop  
**BPM:** 72  
**Key:** Am  
**Mood:** late night / focused / rainy  
**Tags:** `lofi` `rhodes` `vinyl` `rain` `walking-bass`

## Description

The default SLAPT track. Classic lo-fi structure - dusty drums with vinyl crackle, jazzy chord progression on a rhodes, walking bass following the roots, rain in the background.

## Code

```
@genre lofi-hiphop
@tempo 72 bpm
@key Am

atmosphere:
  vinyl crackle at 20% volume
  rain sounds softly in background

drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  snare velocity random(0.7 to 0.9)
  hihat closed 8 times
  apply bitcrush(10bit)
  compress heavily

chords using rhodes piano:
  progression Am7 -> Fmaj7 -> Dm7 -> E7
  voicing spread
  rhythm whole notes with slight anticipation
  reverb(medium, dreamy)
  tremolo(gentle, 4Hz)

bass walking the roots:
  follow chord progression
  sound mellow
  filter warm

section intro:
  only drums and atmosphere
  fade in over 4 bars

section verse:
  add chords after 4 bars
  add bass after 4 bars

section outro:
  fade out everything over 8 bars
  keep vinyl crackle till end

make it dusty
```

## Notes

The `kick pattern [1, 2.75, 3]` is the key to the lo-fi syncopation - that 2.75 landing on the "and" of beat 2 is what makes it groove instead of march. Try swapping to `[1, 3]` and you'll immediately hear the difference.