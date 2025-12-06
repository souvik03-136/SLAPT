# SLAPT: A Human-First Music Programming Language

## Core Vision
**Tagline:** "Write Music Like You Feel It"

SLAPT is a music programming language that lets you create beats and music using natural, descriptive language instead of cryptic code. It's designed to make music production accessible to everyone—from complete beginners to experienced producers—by speaking the language of musicians, not programmers.

---

## The Problem We're Solving

### Current State: Strudel & TidalCycles
```javascript
// Strudel/TidalCycles syntax:
s("bd").struct("<[x*<1 2> [~@3 x]] x>")
sound("hh*8").gain(0.6).delay(0.5)
```
**Issues:**
- Cryptic symbols: `*`, `~`, `@`, `<>`, `/`
- Requires understanding of complex pattern notation
- Steep learning curve for non-programmers
- Error messages are technical and unhelpful
- No guidance for musical context

### The SLAPT Approach
```
// SLAPT syntax:
play kick every beat
play snare on beats 2 and 4
play hihat 8 times per bar with swing
```
**Benefits:**
- Reads like plain English
- Self-documenting code
- Immediate understanding of what's happening
- Musical context built-in
- Helpful, educational error messages

---

## Core Philosophy

### 1. Progressive Complexity
Users can start simple and add layers of detail as they learn:

**Beginner Level:**
```
drums:
  kick on 1 and 3
  snare on 2 and 4
```

**Intermediate Level:**
```
drums with shuffle:
  kick hitting 1, 3, 3.75
  snare on 2, 4 with velocity 0.8
  hihat closed 8 times
  hihat open occasionally
```

**Advanced Level:**
```
drums evolving every 4 bars:
  kick pattern [1, 3] then [1, 2.5, 3]
  snare with velocity random(0.7 to 0.9)
  apply vintage compression
  filter below 80Hz
  compress heavily
```

### 2. Natural Language First
- Use words musicians actually say: "swing", "groove", "lazy", "dusty"
- Timing described as beats, not abstract patterns
- Effects named by their sound: "vintage compression", "vinyl crackle"
- Genre-aware defaults that understand musical context

### 3. Immediate Feedback
- Play back what you write instantly
- Visual timeline shows your patterns
- Smart error messages that teach
- Warnings before problems, not after

---

## Key Features

### 1. Semantic Error Messages
Instead of cryptic errors, SLAPT teaches you:

```
// User writes:
play kick every 3 beats

// SLAPT responds:
⚠️ Timing feels off! 
   → "every 3 beats" creates uneven bars (4 beats per bar)
   💡 Did you mean: 
      • "kick on 1 and 3" (downbeats)
      • "kick every 3rd beat" (1, 4, 3, 2, 1...)
   🎵 Listen to what you wrote: [plays back]
```

```
// Another example:
play note C# with chord Am

⚠️ Warning: C# not in Am scale
   This might sound dissonant (clashing)
   Am scale: A, B, C, D, E, F, G
   You played: C# (not in scale)
   
   🎵 Preview: [plays the sound]
   Continue anyway? (y/n)
   💡 Try: C or C♮ instead
```

```
// Context-aware warnings:
@genre lofi-hiphop
tempo 250 bpm

⚠️ That's very fast for lo-fi!
   Typical lo-fi: 60-90 BPM
   Your tempo: 250 BPM (like speedcore!)
   
   💡 Did you mean:
      • 125 BPM (halftime feel)
      • Change genre to @genre dnb or @genre techno
```

### 2. SLAPT Modifiers
Emotional and aesthetic descriptors that apply real musical transformations:

```
drums:
  kick on 1 and 3
  snare on 2 and 4
  hihat 8 times

make it groovy        
// → adds 60% swing
// → slight timing variations (humanization)
// → ghost notes on snare

make it dusty         
// → applies bitcrushing (12-bit)
// → vinyl crackle layer
// → rolls off highs
// → adds subtle noise

add some laziness     
// → pushes timing 10-20ms behind beat
// → reduces velocity slightly
// → adds more humanization

bring energy up       
// → increases velocity 10-20%
// → adds more variations
// → tightens timing
// → adds fills every 4 bars
```

### 3. Genre Templates
Built-in understanding of musical styles with automatic defaults:

```
@genre lofi-hiphop
@tempo 75 bpm
@key Dm

section intro:
  // Automatically inherits lofi characteristics:
  // ✓ Swing timing (55-65%)
  // ✓ Vinyl crackle ambience
  // ✓ Warm EQ (rolled-off highs)
  // ✓ Slight tape wobble
  // ✓ Jazz-influenced chords
  // ✓ Dusty drum samples
  
section verse:
  inherit intro
  add bass walking the roots
```

**Available Genres (Phase 1-3):**
- **Phase 1:** lofi-hiphop, boom-bap
- **Phase 2:** house, techno, ambient, trap
- **Phase 3:** dnb, jazz, funk, experimental

Each genre includes:
- Typical BPM range (auto-suggests if outside)
- Common chord progressions
- Appropriate drum patterns
- Genre-specific effects
- Sample selection guidance

### 4. Smart Contextual Defaults

```
@genre lofi-hiphop

melody using piano:
  // SLAPT automatically applies:
  // ✓ Rhodes/warm electric piano sound
  // ✓ Slight detuning (-5 cents)
  // ✓ Medium reverb (1.2s decay)
  // ✓ Gentle chorus
  // ✓ Warm EQ profile
  notes C, E, G, A
  rhythm whole notes with slight anticipation
```

### 5. Visual Timeline (Optional)
As you code, see what's happening:

```
Bar 1         Bar 2         Bar 3         Bar 4
|====|====|====|====|====|====|====|====|====|====|
K    S    K    S    K    S    K    S       (kick/snare)
h.h.h.h.h.h.h.h.h.h.h.h.h.h.h.h.h.h.h.h.  (hi-hats)
├─────chord────┤├─────chord────┤           (harmony)
        m.......        m.......            (melody)
```

### 6. Live Feedback Mode

```
@mode live

// Every change plays immediately
// Color-coded feedback:

drums:
  kick on 1        // ✓ Green - plays immediately
  kick on 1 5      // ⚠️ Yellow - beat 5 doesn't exist, plays 1 only
  kick on         // ❌ Red - syntax error, nothing plays
```

---

## Complete Example: Lo-fi Beat

```
// ============================================
// "Midnight Study Session" 
// A Complete SLAPT Program
// ============================================

@genre lofi-hiphop
@tempo 72 bpm
@key Am
@structure intro(8) → verse(16) → chorus(16) → verse(16) → outro(8)

// ============ ATMOSPHERE ============
atmosphere:
  vinyl crackle at 20% volume
  rain sounds softly in background
  tape wobble subtle
  
// ============ DRUMS ============
drums with swing(60%):
  kick pattern [1, 2.75, 3]  // slightly offbeat 2nd kick
  snare on 2 and 4
  snare velocity random(0.7 to 0.9)  // humanize it
  
  hihat closed 8 times with triplet feel
  hihat open on 8 occasionally
  
  // Vintage processing chain:
  apply bitcrush(10bit)
  compress heavily with ratio 4:1
  filter below 80Hz
  add warmth
  
// ============ HARMONY ============
chords using rhodes piano:
  progression Am7 → Fmaj7 → Dm7 → E7
  voicing spread     // nice wide chords
  rhythm whole notes with slight anticipation
  
  // Effects chain:
  reverb(medium, dreamy)
  tremolo(gentle, 4Hz)
  detuned(slightly, -3 cents)
  
// ============ MELODY ============
melody using guitar(clean):
  notes from Am pentatonic
  rhythm syncopated
  play every 4 bars  // sparse = lofi aesthetic
  
  effects:
    delay(ping-pong, 1/8, 30% mix)
    chorus(subtle)
    reverb(small room)

// ============ BASS ============
bass walking the roots:
  follow chord progression
  rhythm on 1 and 3, sometimes 1, 2.5, 3
  sound mellow
  filter warm
  
// ============ ARRANGEMENT ============
section intro:
  only drums + atmosphere
  fade in over 4 bars

section verse:
  add chords at bar 4
  add bass after 4 bars
  
section chorus:
  add melody
  drums more energetic  // adds ghost notes automatically
  increase atmosphere 10%
  
section outro:
  remove melody first
  fade out chords over 4 bars
  fade out everything over 8 bars
  keep vinyl crackle till end
```

**Output Options:**
- ▶️ Instant playback in browser
- 💾 Export: WAV, MP3, MIDI
- 📤 Export to DAW (Ableton, Logic, FL Studio)
- 📊 Visual waveform/timeline
- 🔗 Share link for collaboration
- 📋 Copy to clipboard

---

## Advanced Features (For Power Users)

### 1. Generative Patterns
```
melody:
  generate from scale(Am pentatonic)
  rhythm random_choose([quarter, eighth, eighth, quarter])
  never repeat exactly  // always slight variations
  keep within range C3 to E5
  tend toward chord tones
```

### 2. Conditional Logic
```
drums:
  kick on 1 and 3
  snare on 2 and 4
  
  if bar % 4 == 0:  // every 4th bar
    add fill from [snare roll, tom roll, crash]
  
  if section == "chorus":
    energy *= 1.5
    add more ghost notes
    
  if section == "breakdown":
    remove kick
    halftime feel
```

### 3. Probability & Randomness
```
hihat:
  80% chance closed
  15% chance open  
  5% chance splash
  
snare:
  velocity random(0.7 to 0.9)
  timing vary by ±10ms  // humanization
  occasionally play 25% quieter
```

### 4. Pattern Evolution
```
drums evolving every 8 bars:
  cycle through patterns:
    [kick on 1,3 | snare on 2,4]
    [kick on 1,2.5,3 | snare on 2,4]
    [kick on 1,3 with doubles | snare on 2,4 with ghost notes]
  transition smoothly
```

### 5. Plugin Integration (Phase 2+)
```
chords using vst("Keyscape", preset="Felt Piano"):
  progression Cmaj7 → Am7 → Fmaj7 → G7
  
synth using vst("Serum"):
  waveform saw
  filter lowpass at 800Hz
  modulate filter with lfo
```

### 6. Microtiming & Advanced Rhythm
```
drums with pocket:
  kick on 1 and 3
  kick push forward 5ms  // sits on top
  
  snare on 2 and 4  
  snare push back 15ms  // lays back, groove
  
  hihat 8 times
  hihat slight swing
  hihat push forward 3ms  // tight, crispy
```

---

## Why Start with Lo-fi Hip Hop?

Lo-fi hip hop is the **perfect genre for beginners** because:

### Musical Characteristics:
- **Relaxed Tempo:** 60-90 BPM (easier to hear what's happening)
- **Simple Patterns:** Kick on 1 & 3, snare on 2 & 4 (foundational)
- **Jazzy Chords:** Am7, Dmaj7, Fmaj7 (sound good immediately)
- **Embraces Imperfection:** Timing doesn't need to be perfect
- **Minimal Theory:** Don't need to know scales deeply

### Structural Benefits:
- **Clear Layers:** Drums → Bass → Chords → Melody (easy to understand)
- **Forgiving:** "Happy accidents" often sound good
- **Popular:** Instant gratification when it sounds right
- **Accessible:** Minimal music theory required
- **Expandable:** Easy to add complexity later

### Learning Progression:
1. **Start:** Basic beat (kick, snare, hihat)
2. **Add:** Simple chord progression
3. **Layer:** Bassline walking the roots
4. **Detail:** Melody and atmosphere
5. **Polish:** Effects and transitions
6. **Master:** Advanced techniques and variations

### Gateway to Other Genres:
Once you master lo-fi, the same concepts expand to:
- **Electronic:** More precise timing, synthesizers
- **Ambient:** Remove drums, focus on textures
- **House/Techno:** Faster tempo, four-on-the-floor
- **Jazz:** Complex chords, more theory
- **Experimental:** Break all the rules

---

## Error Handling Philosophy

SLAPT treats errors as **teaching opportunities**, not failures.

### Example 1: Beat Out of Range
```
kick on beat 5

❌ Error: Beat 5 doesn't exist!
   📐 Your time signature is 4/4 (4 beats per bar)
   
   💡 Did you mean:
      • Beat 1 of the next bar?
      • A different time signature? Try @timesig 5/4
      
   📚 Learn: In 4/4 time, beats are numbered 1, 2, 3, 4
```

### Example 2: Genre/Tempo Mismatch
```
@genre lofi-hiphop
tempo 180 bpm

⚠️ That's very fast for lo-fi!
   📊 Typical lo-fi: 60-90 BPM
   📊 Your tempo: 180 BPM (jungle/dnb speed!)
   
   💡 Suggestions:
      • 90 BPM (upbeat lo-fi)
      • 180 BPM with @genre dnb
      • Try "halftime feel" to make 180 feel like 90
      
   🎵 Preview both: [90 BPM] [180 BPM]
```

### Example 3: Scale Conflicts
```
@key Am

melody:
  notes C, E, G#, A

⚠️ Warning: G# not in Am scale
   🎼 Am natural minor: A, B, C, D, E, F, G
   ❌ You used: G# (not in scale)
   
   💡 Did you mean:
      • G natural (stays in scale)
      • Switch to A harmonic minor? (includes G#)
      
   🎵 Compare sounds:
      [G natural in Am] [G# in Am] [G# in A harmonic minor]
```

### Example 4: Syntax Suggestions
```
play kick on every 1 and 3

⚠️ Syntax issue: "on every" is redundant
   ✓ Correct: "kick on 1 and 3"
   ✓ Or: "kick every bar"
   
   Auto-corrected to: "kick on 1 and 3"
   🎵 [plays corrected version]
```

### Example 5: Performance Warnings
```
melody:
  generate from scale(C major)
  with 50 variations per second

⚠️ Performance warning!
   50 variations/second might cause audio glitches
   💡 Recommended: 2-8 variations per bar
   
   Current: 50/sec = 600/bar at 120 BPM
   
   Continue anyway? (not recommended)
```
