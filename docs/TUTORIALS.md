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
- `@genre lofi-hiphop` -> sets the vibe, applies genre-aware defaults
- `@tempo 75 bpm` -> sets the speed
- `kick on 1 and 3` -> bass drum hits on beat 1 and beat 3
- `snare on 2 and 4` -> snare hits on the backbeats (this is what makes it groove)
- `hihat 8 times` -> eighth-note hi-hats, divides the bar into 8 equal hits

**Important:** If you don't write a `snare` line, no snare plays. If you don't write a `hihat` line, no hihat plays. Instruments only appear when you explicitly write them.

**Your code is auto-saved.** Every keystroke writes to `localStorage`. If you refresh or close the tab and come back, your code is still there.

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

Change `swing(60%)` to `swing(30%)` and compare. Higher swing = more laid-back, shuffled feel. Lo-fi typically lives between 55–65%.

---

## Tutorial 3 - Off-Beat Kick (5 minutes)

The default `kick on 1 and 3` is a starting point. Real beats have character.

```
drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  hihat closed 8 times
```

`kick pattern [1, 2.75, 3]` places kicks at beat 1, beat 2.75 (the "and" of beat 2), and beat 3. This is a classic lo-fi syncopation. The Timeline panel at the bottom shows you exactly where each kick lands.

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

**Beat validation:** SLAPT checks every beat in your pattern array. If you write `kick pattern [1, 2.75, 5]`, you'll get a `BEAT_OUT_OF_RANGE` error on the `5` specifically. The same applies to `snare on` and `hihat open on` beats.

---

## Tutorial 4 - Open Hihat On Specific Beats (5 minutes)

A closed hihat grid sounds tight. An open hihat on beat 4 breathes. This is one of the most-used techniques in boom-bap and lo-fi.

```
drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  hihat closed 8 times
  hihat open on 4
```

`hihat open on 4` places an open hihat hit on beat 4. The closed grid automatically skips that position — you won't get a double-hit.

**Multiple open hihat beats:**

```
hihat open on 2 and 4
hihat open on 1 and 3
```

**What "open" sounds like vs "closed":** The open hihat fires with a longer gate (`8n` instead of `16n`) and slightly higher velocity, giving it that sustained, washy sound. The closed hit is tight and punchy.

**Beat validation works here too.** If your time signature is 3/4 (see Tutorial 11), `hihat open on 4` will trigger a `BEAT_OUT_OF_RANGE` error — beat 4 doesn't exist in 3/4.

**Compare these patterns:**

```
hihat closed 8 times                       <- all closed, machine feel
hihat closed 8 times + hihat open on 4    <- classic backbeat open
hihat closed 8 times + hihat open on 2 and 4  <- double open, jazz feel
```

---

## Tutorial 5 - Chord Progressions (8 minutes)

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
- `progression Am7 -> Fmaj7 -> Dm7 -> E7` -> four chords, one per bar, looping
- `->` is two characters you can type on any keyboard
- `voicing spread` -> wide chord voicing (notes spread across octaves)
- `reverb(medium, dreamy)` -> adds space and wash

**Try these progressions:**

```
progression Am7 -> Fmaj7 -> Dm7 -> E7       <- classic lo-fi
progression Cmaj7 -> Am7 -> Fmaj7 -> Gmaj7  <- brighter feel
progression Dm7 -> Gmaj7 -> Cmaj7 -> Am7    <- jazzy movement
```

---

## Tutorial 6 - Bass Lines (5 minutes)

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

`bass walking the roots` plays the root note of each chord, one octave below. `follow chord progression` locks it to whatever progression is declared above.

---

## Tutorial 7 - Atmosphere (5 minutes)

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

**How each layer sounds:**

`vinyl crackle at 20% volume` -> two synthesised layers: a quiet brown noise surface hum and random pop bursts that fire at irregular intervals, simulating an actual record. The percentage controls the overall level. Try 10–30%; above 30% it becomes very noticeable.

`rain sounds softly in background` -> three brown/pink noise layers filtered to different frequency bands, blending into a rain-in-a-room texture. It should sit well under the mix and add a sense of space.

`tape wobble subtle` -> a 0.3Hz sine curve that nudges the BPM ±0.8%, simulating cassette flutter. You feel it more than hear it.

**Important:** Atmosphere layers only play while the transport is running. They stop when you hit stop, and resume when you hit play again.

**If you just hear white noise:** you're probably hearing rain or crackle at too high a volume with nothing else playing. Add drums and chords -> the atmosphere is designed to sit under a full mix, not play alone.

---

## Tutorial 8 - Global Modifiers (3 minutes)

Modifiers are the fastest way to shift the entire vibe. Add them at the end of your file.

```
drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  hihat closed 8 times

make it dusty
```

**What each modifier does:**

`make it groovy` -> increases swing to 60% minimum, adds humanization to velocity, adds ghost notes to snare

`make it dusty` -> applies bitcrushing to drums, adds vinyl crackle to atmosphere at 20% minimum (creates an atmosphere block automatically if you haven't written one), rolls off high frequencies

`add some laziness` -> increases swing to 40% minimum, pushes timing slightly behind the beat

`bring energy up` -> increases velocity across all instruments, adds automatic fills every 4 bars

**`make it dusty` without an atmosphere block:**

```
drums:
  kick on 1 and 3
  snare on 2 and 4

make it dusty
```

Even without an `atmosphere:` block, this will produce vinyl crackle at 20%. The modifier creates the atmosphere automatically. If you have an atmosphere block with crackle already above 20%, your value is kept.

Modifiers stack. This is valid:

```
make it dusty
add some laziness
```

---

## Tutorial 9 - Sections and Arrangement (10 minutes)

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
  hihat open on 4

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

Each section instructs the engine how to build up and break down layers over time.

---

## Tutorial 10 - Error Messages (5 minutes)

SLAPT errors are designed to teach. Try deliberately breaking things.

**Trigger a beat error in a pattern array:**

```
kick pattern [1, 2.75, 5]
```

The error panel shows: `Beat 5 doesn't exist in 4/4 time` with context `"kick pattern"` so you know exactly which line caused it.

**Trigger a beat error on snare:**

```
snare on 2 and 6
```

Same error, context shows `"snare on"`.

**Trigger a beat error on hihat open on:**

```
hihat open on 5
```

Same error, context shows `"hihat open on"`. All four sources — kick pattern, kick on, snare on, and hihat open on — are validated against your current time signature.

**Trigger a tempo warning:**

```
@genre lofi-hiphop
@tempo 180 bpm
```

Warning: `180 BPM feels off for lofi-hiphop` with the typical range. Warnings do not block playback. Errors do.

The status dot in the editor header shows green (ok), yellow (parsing), or red (error).

---

## Tutorial 11 - Velocity Humanization (3 minutes)

Machines are too precise. Humans aren't.

```
snare on 2 and 4
snare velocity random(0.7 to 0.9)
```

`random(0.7 to 0.9)` randomizes the snare velocity between 70% and 90% on every hit. The range is `0.0` (silent) to `1.0` (full velocity).

These values are parsed and used directly by the audio engine — not approximated or overridden. What you write is what plays.

For more dynamic feel: `random(0.5 to 1.0)`
For subtle variation: `random(0.8 to 0.95)`
If you write no velocity line: defaults to `random(0.6 to 0.8)`

---

## Tutorial 12 - More Keys (3 minutes)

SLAPT now supports 11 keys. The original 7 (`Am`, `Cm`, `Dm`, `Em`, `C`, `G`, `F`) plus four new ones:

```
@key F#m   // ethereal, floaty — great for ambient and dream beats
@key Bb    // jazzy, soulful — classic neo-soul progressions live here
@key Ab    // rich, lush — pairs well with house and slow-tempo tracks
@key Ebm   // deep, heavy — suits trap and dnb
```

Change `@key` and your `NOTE_OUT_OF_SCALE` warnings update automatically. Try:

```
@genre lofi-hiphop
@tempo 80 bpm
@key F#m

chords using rhodes piano:
  progression Am7 -> Fmaj7 -> Em
  reverb(medium, dreamy)
```

F#m's scale is F#, G#, A, B, C#, D, E. If you use a chord with notes outside that set, SLAPT warns you — but still plays.

---

## Tutorial 13 - Time Signatures (8 minutes)

SLAPT defaults to 4/4. The `@timesig` directive unlocks 3/4 and 5/4.

```
@timesig 3/4   // waltz, jazz waltz, folk
@timesig 5/4   // Dave Brubeck, Radiohead, odd-time grooves
```

Add it alongside your other directives, before any blocks:

```
@genre lofi-hiphop
@tempo 80 bpm
@key Am
@timesig 3/4
```

**What changes when you set @timesig:**

- Beat validation range changes. In 3/4, beats 1–3 are valid. Beat 4 triggers `BEAT_OUT_OF_RANGE`. In 5/4, beats 1–5 are valid.
- The timeline shows the correct number of beat markers for the bar.
- MIDI export embeds the correct time signature meta event.

**A 3/4 waltz beat:**

```
@genre lofi-hiphop
@tempo 80 bpm
@key F#m
@timesig 3/4

atmosphere:
  vinyl crackle at 15% volume

drums with swing(55%):
  kick on 1
  snare on 2
  hihat closed 6 times
  hihat open on 3
```

Six closed hihats in 3/4 = two 8th notes per beat. Open hihat on beat 3 gives the classic waltz exhale.

**A 5/4 groove:**

```
@genre lofi-hiphop
@tempo 78 bpm
@key Bb
@timesig 5/4

drums with swing(40%):
  kick on 1 and 4
  snare on 2 and 5
  hihat closed 10 times
  hihat open on 3
```

Group 5/4 as 3+2 (kick on 1 and 4) or 2+3 (kick on 1 and 3). The `hihat open on 3` marks the midpoint of the bar, which is where the grouping switches — you feel it as a natural breathing point.

**If you try an unsupported time sig:**

```
@timesig 7/8
```

You'll get `TIMESIG_UNSUPPORTED`. Currently supported: `3/4`, `4/4`, `5/4`.

---

## Tutorial 14 - MIDI Export (3 minutes)

Once your code parses without errors, the **MIDI** button in the top bar activates.

Click it. A `.mid` file downloads named after your genre and tempo — something like `slapt-lofi-hiphop-75bpm.mid`.

**What gets exported:**

- Drums on GM channel 10. Kick on note 36, snare on 38, closed hihat on 42, open hihat on 46. Four bars. Velocity from your `snare velocity random()` range.
- Chords on channel 1. The same voicings you hear in the browser.
- Bass on channel 2. Root notes matching your chord progression.

**What doesn't get exported:**

Atmosphere (vinyl crackle, rain, tape wobble) is synthesized noise — there's no MIDI equivalent. Everything else exports cleanly.

**Importing into a DAW:**

Open Ableton, Logic, FL Studio, GarageBand, or any other DAW and drag the `.mid` file in. The drums land on channel 10 which is the General MIDI standard, so most drum kits will auto-map correctly. Chords and bass will need an instrument assigned.

**The MIDI button stays disabled while there are parse errors.** Fix the red dot first.

---

## Tutorial 15 - Copy Button and Auto-Save (2 minutes)

Two small features that save real time.

**Copy button:** The icon in the top-right corner of the editor copies your entire code to the clipboard in one click. The icon briefly shows a checkmark to confirm. Use this to paste your code into a text file, share it in a message, or back it up anywhere.

**Auto-save:** Every keystroke saves your code to the browser's `localStorage` under the key `slapt_code_v1`. Closing the tab, refreshing, or restarting Docker — your code comes back automatically. No manual save. No lost work.

If you want to clear the saved code and start completely fresh, run this in the browser console:

```javascript
localStorage.removeItem("slapt_code_v1")
```

Then refresh the page. The editor reloads with the default example track.

---

## Common Patterns Reference

### Basic Lo-fi Beat

```
@genre lofi-hiphop
@tempo 75 bpm
@key Am

atmosphere:
  vinyl crackle at 15% volume

drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  snare velocity random(0.7 to 0.9)
  hihat closed 8 times
  hihat open on 4

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
  hihat open on 2 and 4

chords using rhodes piano:
  progression Dm7 -> Cmaj7 -> Am7 -> Gmaj7
  voicing spread

bass walking the roots:
  follow chord progression

bring energy up
```

### Jazz Waltz (3/4)

```
@genre lofi-hiphop
@tempo 80 bpm
@key F#m
@timesig 3/4

atmosphere:
  vinyl crackle at 15% volume

drums with swing(55%):
  kick on 1
  snare on 2
  hihat closed 6 times
  hihat open on 3

chords using rhodes piano:
  progression Am7 -> Fmaj7 -> Em
  voicing spread
  reverb(medium, dreamy)

bass walking the roots:
  follow chord progression
  sound mellow

make it dusty
```

### Five-Beat Odd Time (5/4)

```
@genre lofi-hiphop
@tempo 78 bpm
@key Bb
@timesig 5/4

drums with swing(40%):
  kick on 1 and 4
  snare on 2 and 5
  hihat closed 10 times
  hihat open on 3

atmosphere:
  tape wobble subtle
  vinyl crackle at 10% volume

chords using rhodes piano:
  progression Dm7 -> Am7 -> Cmaj7
  reverb(medium, dreamy)

add some laziness
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

### Kick Only (no snare, no hihat)

```
@genre lofi-hiphop
@tempo 75 bpm

drums:
  kick on 1 and 3 and 4
```

Writing no `snare` line means no snare plays. Writing no `hihat` line means no hihat plays. This is intentional — SLAPT only plays what you explicitly write.

### Dusty With No Atmosphere Block

```
@genre lofi-hiphop
@tempo 75 bpm

drums with swing(55%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  hihat closed 8 times

make it dusty
```

`make it dusty` creates vinyl crackle at 20% automatically. You don't need an atmosphere block.

### Neo-Soul (Ab key)

```
@genre lofi-hiphop
@tempo 85 bpm
@key Ab

atmosphere:
  vinyl crackle at 10% volume

drums with swing(50%):
  kick on 1 and 3
  snare on 2 and 4
  snare velocity random(0.65 to 0.9)
  hihat closed 8 times
  hihat open on 4

chords using rhodes piano:
  progression Cmaj7 -> Am7 -> Fmaj7 -> Gmaj7
  voicing spread
  reverb(medium, dreamy)

bass walking the roots:
  follow chord progression
  sound mellow
  filter warm
```