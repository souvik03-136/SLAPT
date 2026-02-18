# SLAPT Tutorials

## Tutorial 1 - Your First Beat (5 minutes)

Start here. No music theory required.

### Step 1: Open the editor

Run `docker-compose up --build` and open `http://localhost`. You will see the editor pre-loaded with an example track.

### Step 2: Clear the editor and write this

```
@genre lofi-hiphop
@tempo 75 bpm

drums:
  kick on 1 and 3
  snare on 2 and 4
  hihat 8 times
```

### Step 3: Hit Play

The green play button in the top bar. You should hear a basic beat.

**What each line does:**
- `@genre lofi-hiphop` - sets the vibe, applies genre-aware defaults
- `@tempo 75 bpm` - sets the speed
- `kick on 1 and 3` - bass drum hits on beat 1 and beat 3
- `snare on 2 and 4` - snare hits on the backbeats (this is what makes it groove)
- `hihat 8 times` - eighth-note hi-hats, divides the bar into 8 equal hits

**Important:** If you don't write a `snare` line, no snare plays. Instruments only
play when you explicitly write them.

---

## Tutorial 2 - Adding Swing (3 minutes)

Straight hi-hats sound robotic. Swing makes them human.

```
@genre lofi-hiphop
@tempo 75 bpm

drums with swing(60%):
  kick on 1 and 3
  snare on 2 and 4
  hihat 8 times
```

Change `swing(60%)` to `swing(30%)` and compare. Higher swing = more laid-back, shuffled feel. Lo-fi typically lives between 55-65%.

---

## Tutorial 3 - Off-Beat Kick (5 minutes)

The default `kick on 1 and 3` is a starting point. Real beats have character.

```
drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  hihat closed 8 times
```

`kick pattern [1, 2.75, 3]` places kicks at beat 1, beat 2.75 (the "and" of beat 2), and beat 3.
This is a classic lo-fi syncopation. The Timeline panel at the bottom shows you exactly where each kick lands.

You can also use `kick on` with more than two beats:

```
kick on 1 and 3 and 4
kick on 1 and 2 and 3 and 4
```

Try these patterns and compare:

```
kick pattern [1, 3]              <- basic
kick pattern [1, 2.75, 3]        <- lo-fi classic
kick pattern [1, 1.5, 3]         <- double-time feel
kick pattern [1, 3, 3.5]         <- tail on the 3
```

---

## Tutorial 4 - Chord Progressions (8 minutes)

A beat without harmony sounds empty. Add chords.

```
@genre lofi-hiphop
@tempo 75 bpm
@key Am

drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  hihat closed 8 times

chords using rhodes piano:
  progression Am7 -> Fmaj7 -> Dm7 -> E7
  voicing spread
  rhythm whole notes with slight anticipation
  reverb(medium, dreamy)
```

**What's happening:**
- `progression Am7 -> Fmaj7 -> Dm7 -> E7` - four chords, one per bar, looping
- `voicing spread` - wide chord voicing (notes spread across octaves)
- `rhythm whole notes with slight anticipation` - chord hits just before the bar
- `reverb(medium, dreamy)` - adds space and wash

The `@key Am` declaration enables scale validation. Try adding a note outside Am and watch the warning panel.

**Try these progressions:**

```
progression Am7 -> Fmaj7 -> Dm7 -> E7      <- classic lo-fi
progression Cmaj7 -> Am7 -> Fmaj7 -> Gmaj7  <- brighter feel
progression Dm7 -> Gmaj7 -> Cmaj7 -> Am7    <- jazzy movement
```

---

## Tutorial 5 - Bass Lines (5 minutes)

Bass glues drums and chords together.

```
@genre lofi-hiphop
@tempo 75 bpm
@key Am

drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  hihat closed 8 times

chords using rhodes piano:
  progression Am7 -> Fmaj7 -> Dm7 -> E7
  voicing spread
  reverb(medium, dreamy)

bass walking the roots:
  follow chord progression
  sound mellow
  filter warm
```

`bass walking the roots` means the bass plays the root note of each chord. `follow chord progression`
locks it to whatever progression is declared in the chords block. The bass will always be one
octave below the chord roots.

---

## Tutorial 6 - Atmosphere (5 minutes)

Lo-fi is defined by texture. Add the crackle.

```
@genre lofi-hiphop
@tempo 75 bpm

atmosphere:
  vinyl crackle at 20% volume
  rain sounds softly in background
  tape wobble subtle

drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  hihat closed 8 times
```

`vinyl crackle at 20% volume` - the percentage controls how loud the crackle layer is relative
to the mix. Try values between 10-30%.

`tape wobble subtle` gives a slight pitch drift, like an old cassette.

---

## Tutorial 7 - Global Modifiers (3 minutes)

Modifiers are the fastest way to shift the entire vibe of a track. Add them at the end of
your file, after all blocks.

```
drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  hihat closed 8 times

make it dusty
```

**What each modifier does:**

`make it groovy` - increases swing to 60% minimum, adds humanization to velocity, adds ghost notes to snare

`make it dusty` - applies bitcrushing to drums, adds vinyl crackle to atmosphere at 20% minimum, rolls off high frequencies

`add some laziness` - increases swing to 40% minimum, pushes timing slightly behind the beat

`bring energy up` - increases velocity across all instruments, adds automatic fills every 4 bars

Modifiers stack. This is valid:

```
make it dusty
add some laziness
```

---

## Tutorial 8 - Sections and Arrangement (10 minutes)

Without sections, your track plays the same loop forever. Sections add structure.

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

chords using rhodes piano:
  progression Am7 -> Fmaj7 -> Dm7 -> E7
  voicing spread
  reverb(medium, dreamy)

bass walking the roots:
  follow chord progression
  sound mellow

section intro:
  only drums and atmosphere
  fade in over 4 bars

section verse:
  add chords after 4 bars
  add bass after 4 bars

section chorus:
  bring energy up

section outro:
  fade out everything over 8 bars
  keep vinyl crackle till end

make it dusty
```

Each section instructs the engine how to build up and break down the layers.

---

## Tutorial 9 - Error Messages (5 minutes)

SLAPT errors are designed to teach. Try deliberately breaking things.

**Trigger a beat error:**

```
kick on 5
```

The error panel shows: `Beat 5 doesn't exist in 4/4 time` with suggestions.

**Trigger a tempo warning:**

```
@genre lofi-hiphop
@tempo 180 bpm
```

The warning panel shows: `180 BPM feels off for lofi-hiphop` with the typical range and suggestions.

Warnings do not block playback. Errors do. The status dot in the editor header shows green (ok),
yellow (parsing), or red (error).

---

## Tutorial 10 - Velocity Humanization (3 minutes)

Machines are too precise. Humans aren't. This makes your snare feel played, not programmed.

```
snare on 2 and 4
snare velocity random(0.7 to 0.9)
```

`random(0.7 to 0.9)` randomizes the snare velocity between 70% and 90% on every hit.
The range is `0.0` (silent) to `1.0` (full velocity). For a more dynamic feel try `random(0.5 to 1.0)`.
For subtle variation try `random(0.8 to 0.95)`.

---

## Common Patterns Reference

### Basic Lo-fi Beat

```
@genre lofi-hiphop
@tempo 75 bpm
@key Am

drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  hihat closed 8 times

chords using rhodes piano:
  progression Am7 -> Fmaj7 -> Dm7 -> E7
  reverb(medium, dreamy)

bass walking the roots:
  follow chord progression
  sound mellow

make it dusty
```

### Boom-Bap

```
@genre boom-bap
@tempo 90 bpm
@key Dm

drums:
  kick on 1 and 3
  snare on 2 and 4
  snare velocity random(0.6 to 1.0)
  hihat closed 8 times
  hihat open occasionally

chords using rhodes piano:
  progression Dm7 -> Cmaj7 -> Am7 -> Gmaj7
  voicing spread

bass walking the roots:
  follow chord progression

bring energy up
```

### Chill House

```
@genre house
@tempo 122 bpm

drums:
  kick on 1 and 3
  snare on 2 and 4
  hihat 16 times

chords using rhodes piano:
  progression Am7 -> Fmaj7 -> Cmaj7 -> Gmaj7
  rhythm whole notes

bass walking the roots:
  follow chord progression
  sound mellow
```

### Kick Only (no snare)

```
@genre lofi-hiphop
@tempo 75 bpm

drums:
  kick on 1 and 3 and 4
  hihat closed 8 times
```

Note: writing no `snare` line means no snare will play. This is intentional and correct.