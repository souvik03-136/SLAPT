# SLAPT Tutorials

> New here? Start at Tutorial 1. Already know the basics? Jump to any section.

---

## Tutorial 1 — Your First Beat (5 minutes)

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

The green play button in the top bar. You should hear a basic beat within 1–3 seconds while samples load from the CDN — the button shows "Loading…" during this. After the first play, samples are cached and playback is instant.

**What each line does:**

`@genre lofi-hiphop` — sets the vibe and unlocks genre-aware validation. SLAPT warns you if your tempo or notes feel off for the genre. Supported genres: `lofi-hiphop`, `boom-bap`, `house`, `techno`, `dnb`, `ambient`, `trap`.

`@tempo 75 bpm` — sets the speed.

`kick on 1 and 3` — bass drum hits on beat 1 and beat 3.

`snare on 2 and 4` — snare hits on the backbeats. This is what makes it groove.

`hihat 8 times` — eighth-note hi-hats, divides the bar into 8 equal hits.

**Important:** If you don't write a `snare` line, no snare plays. If you don't write a `hihat` line, no hihat plays. Instruments only appear when you explicitly write them.

**Your code is auto-saved.** Every keystroke writes to `localStorage`. If you refresh, close the tab, or restart Docker and come back, your code is still there. No manual save needed.

**Want a fresh start?** Click the **Reset** button in the top bar to restore the default example track.

---

## Tutorial 2 — Adding Swing (3 minutes)

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

## Tutorial 3 — Off-Beat Kick (5 minutes)

The default `kick on 1 and 3` is a starting point. Real beats have character.

```
drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  hihat closed 8 times
```

`kick pattern [1, 2.75, 3]` places kicks at beat 1, beat 2.75 (the "ah" of beat 2), and beat 3. This is a classic lo-fi syncopation. The Timeline panel at the bottom shows you exactly where each kick lands.

You can also use `kick on` with more than two beats:

```
kick on 1 and 3 and 4
kick on 1 and 2 and 3 and 4
```

Try these patterns and compare:

```
kick pattern [1, 3]              ← basic
kick pattern [1, 2.75, 3]        ← lo-fi classic
kick pattern [1, 1.5, 3]         ← double-time feel
kick pattern [1, 3, 3.5]         ← tail on the 3
```

**Beat validation:** SLAPT checks every beat in your pattern array. If you write `kick pattern [1, 2.75, 5]` you'll get a `BEAT_OUT_OF_RANGE` error on the `5` specifically — with context (`kick pattern`) and suggestions. The same validation applies to `snare on` and `hihat open on`.

---

## Tutorial 4 — Open Hihat On Specific Beats (5 minutes)

A closed hihat grid sounds tight. An open hihat on beat 4 breathes. This is one of the most-used techniques in boom-bap and lo-fi.

```
drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  hihat closed 8 times
  hihat open on 4
```

`hihat open on 4` places an open hihat hit on beat 4. The closed grid automatically skips that position — you won't get a double-hit. It just works.

**Multiple open hihat beats:**

```
hihat open on 2 and 4
hihat open on 1 and 3
```

**What "open" sounds like vs "closed":** The open hihat fires with a longer gate and slightly higher velocity. That sustained, washy sound vs the tight snap of a closed hit.

**Beat validation works here too.** If your time signature is `@timesig 3/4`, then `hihat open on 4` triggers `BEAT_OUT_OF_RANGE` — beat 4 doesn't exist in 3/4. See Tutorial 13 for time signatures.

**Compare these patterns:**

```
hihat closed 8 times                           ← all closed, machine feel
hihat closed 8 times + hihat open on 4         ← classic backbeat open
hihat closed 8 times + hihat open on 2 and 4   ← double open, jazz feel
```

---

## Tutorial 5 — Chord Progressions (8 minutes)

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

`@key Am` sets the key for scale validation. If you use a chord with notes outside that key, SLAPT warns you — but still plays.

`progression Am7 -> Fmaj7 -> Dm7 -> E7` — four chords, one per bar, looping. `->` is two ASCII characters you can type on any keyboard.

`voicing spread` — wide chord voicing, notes spread across octaves.

`reverb(medium, dreamy)` — adds space and wash.

**Try these progressions:**

```
progression Am7 -> Fmaj7 -> Dm7 -> E7       ← classic lo-fi
progression Cmaj7 -> Am7 -> Fmaj7 -> Gmaj7  ← brighter feel
progression Dm7 -> Gmaj7 -> Cmaj7 -> Am7    ← jazzy movement
```

**Built-in voicings:** `Am7`, `Fmaj7`, `Dm7`, `E7`, `Cmaj7`, `Gmaj7`, `Am`, `Dm`, `Em`

---

## Tutorial 6 — Bass Lines (5 minutes)

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

`bass walking the roots` plays the root note of each chord, one octave below. `follow chord progression` locks it to whatever progression is declared above. Bass requires a chord block — no chords means no roots to follow.

---

## Tutorial 7 — Atmosphere (5 minutes)

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

**How each layer works — everything is generated in the browser, no audio files:**

`vinyl crackle at 20% volume` — two synthesized layers: brown noise surface hum and random pop bursts at irregular intervals. Try 10–30%; above 30% it becomes very noticeable.

`rain sounds softly in background` — three noise layers filtered to different frequency bands (low rumble at 200Hz, mid splash at 700Hz, high sparkle at 1400Hz). It should sit well under the mix and add a sense of space.

`tape wobble subtle` — a 0.3Hz sine curve that nudges the BPM ±0.8%, simulating cassette flutter. You feel it more than hear it.

**Important:** Atmosphere layers only play while the transport is running. They stop when you hit Stop or Pause, and resume when you play again. This is because they're free-running `Tone.Noise` nodes — they're stopped explicitly, not by the Transport.

**If you just hear noise with nothing else:** atmosphere is designed to sit under a full mix. Add drums and chords — the crackle and rain will settle into the background naturally.

---

## Tutorial 8 — Global Modifiers (3 minutes)

Modifiers are the fastest way to shift the entire vibe. One line, entire vibe shift. Add them at the end of your file.

```
drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  hihat closed 8 times

make it dusty
```

**What each modifier does:**

`make it groovy` — increases swing to 60% minimum, adds humanization to velocity, adds ghost notes to snare.

`make it dusty` — applies bitcrushing to drums, adds vinyl crackle to atmosphere at 20% minimum (creates an atmosphere block automatically if you haven't written one), rolls off high frequencies.

`add some laziness` — increases swing to 40% minimum, pushes timing slightly behind the beat, lowers velocity.

`bring energy up` — increases velocity across all instruments, adds automatic fills every 4 bars.

**`make it dusty` without an atmosphere block:**

```
drums:
  kick on 1 and 3
  snare on 2 and 4

make it dusty
```

Even without an `atmosphere:` block, this produces vinyl crackle at 20%. If you have an atmosphere block with crackle already above 20%, your value is kept.

**Modifiers stack.** This is valid:

```
make it dusty
add some laziness
```

---

## Tutorial 9 — Sections and Arrangement (10 minutes)

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

Section names are free-form — `section drop:`, `section build:`, `section breakdown:` all parse correctly. Content is written intent for future live arrangement rendering.

---

## Tutorial 10 — Error Messages (5 minutes)

SLAPT errors are designed to teach, not confuse. Try deliberately breaking things.

**Trigger a beat error in a pattern array:**

```
kick pattern [1, 2.75, 5]
```

Error panel: `Beat 5 doesn't exist in 4/4 time` with context `"kick pattern"` — you know exactly which statement caused it, plus suggestions.

**Trigger a beat error on snare:**

```
snare on 2 and 6
```

Same error, context `"snare on"`.

**Trigger a beat error on hihat open on:**

```
hihat open on 5
```

Same error, context `"hihat open on"`. All four sources — `kick pattern`, `kick on`, `snare on`, and `hihat open on` — are validated against your current time signature.

**Trigger a tempo warning:**

```
@genre lofi-hiphop
@tempo 180 bpm
```

Warning: `180 BPM feels off for lofi-hiphop`. Warnings don't block playback. Errors do.

**Trigger a timesig error:**

```
@timesig 7/8
```

Error: `TIMESIG_UNSUPPORTED`. Supported: `3/4`, `4/4`, `5/4`.

The status dot in the editor header: green (ok), yellow (parsing), red (error).

---

## Tutorial 11 — Velocity Humanization (3 minutes)

Machines are too precise. Humans aren't.

```
snare on 2 and 4
snare velocity random(0.7 to 0.9)
```

`random(0.7 to 0.9)` randomizes the snare velocity between 70% and 90% on every hit. Range is `0.0` (silent) to `1.0` (full velocity). These exact values are passed to the audio engine and used in MIDI export — not approximated.

For more dynamic feel: `random(0.5 to 1.0)`  
For subtle variation: `random(0.8 to 0.95)`  
If you write no velocity line: defaults to `random(0.6 to 0.8)`

---

## Tutorial 12 — More Keys (3 minutes)

SLAPT supports 11 keys. The original set (`Am`, `Cm`, `Dm`, `Em`, `C`, `G`, `F`) plus four more:

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

## Tutorial 13 — Time Signatures (8 minutes)

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

**What changes when you set `@timesig`:**

Beat validation range changes automatically. In 3/4, beats 1–3 are valid — beat 4 triggers `BEAT_OUT_OF_RANGE`. In 5/4, beats 1–5 are valid. The timeline shows the correct beat markers. MIDI export embeds the correct time signature meta event.

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

Group 5/4 as 3+2 (kick on 1 and 4) or 2+3 (kick on 1 and 3). The `hihat open on 3` marks the grouping midpoint — you feel it as a natural breathing point.

**If you try an unsupported time sig:**

```
@timesig 7/8
```

You'll get `TIMESIG_UNSUPPORTED`. Currently supported: `3/4`, `4/4`, `5/4`.

---

## Tutorial 14 — MIDI Export (3 minutes)

Once your code parses without errors, the **MIDI** button in the top bar activates.

Click it. A `.mid` file downloads named after your genre and tempo — something like `slapt-lofi-hiphop-75bpm.mid`.

**What gets exported:**

Drums on GM channel 10. Kick on note 36, snare on 38, closed hihat on 42, open hihat on 46. Four bars. Snare velocity from your `snare velocity random()` range — randomized per hit, same as audio playback.

Chords on channel 1. The same voicings you hear in the browser.

Bass on channel 2. Root notes matching your chord progression.

Time signature embedded as a MIDI meta event — correct for 3/4 and 5/4 as well as 4/4.

**What doesn't get exported:**

Atmosphere (vinyl crackle, rain, tape wobble) is synthesized noise — there's no MIDI equivalent. Everything else exports cleanly.

**Importing into a DAW:**

Drag the `.mid` file into Ableton, Logic, FL Studio, GarageBand, or any other DAW. Drums land on channel 10 (General MIDI standard), so most drum kits auto-map correctly. Chords and bass need an instrument assigned.

**The MIDI button stays disabled while there are parse errors.** Fix the red dot first.

---

## Tutorial 15 — Copy Button and Auto-Save (2 minutes)

Two small features that save real time.

**Copy button:** The icon in the top-right corner of the editor copies your entire code to the clipboard in one click. The icon briefly shows a checkmark to confirm.

**Auto-save:** Every keystroke saves your code to `localStorage` under the key `slapt_code_v1`. Closing the tab, refreshing, or restarting Docker — your code comes back automatically. No manual save needed.

**Reset button:** The circular arrow button in the top bar stops playback and restores the default example track in both the editor and localStorage. Use it when you want a clean slate.

**To manually clear saved code** without using the Reset button, run this in the browser console:

```javascript
localStorage.removeItem("slapt_code_v1")
```

Then refresh. The editor reloads with the default example track.

---

## Tutorial 16 — In-App Documentation (1 minute)

Hit the **Docs** button in the top bar. A side panel slides in with the full language reference, all examples, and a cheat sheet — without leaving the editor.

Navigate using the sidenav on the left. Close with the ✕ button, by clicking the backdrop, or by pressing `Escape`.

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

No `snare` line = no snare. No `hihat` line = no hihat. SLAPT only plays what you explicitly write.

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

### The Midnight Study Session

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

section chorus:
  bring energy up

section outro:
  fade out everything over 8 bars
  keep vinyl crackle till end

make it dusty
```