# 🎵 SLAPT

> **Is your code slapping? Because mine is.**

## What if making music felt like texting your bestie?

You know that feeling when a beat just *hits different*? When the bass drops and everything clicks? That's what coding music should feel like. But instead, I saw this:

```javascript
// Other tools be like:
s("bd").struct("<[x*<1 2> [~@3 x]] x>")
sound("hh*8").gain(0.6).delay(0.5)
```

Meanwhile us: *"bro what? 💀"*

## Welcome to SLAPT

**SLAPT** = **S**ounds **L**ike **A** **P**erfect **T**rack  
*(or Sonic Language Audio Programming Tool if ur parents are asking)*

I said "nah" to cryptic symbols and made music programming that actually makes sense:

```
play kick every beat
play snare on beats 2 and 4
play hihat 8 times per bar with swing
```

Read that. You understood it immediately. That's the whole point.

---

## 🔥 The Vibe

### If you can text, you can make beats

No cap, I built SLAPT because learning music production felt like studying ancient hieroglyphics. TidalCycles and Strudel are powerful, sure, but they're not exactly giving "intuitive" energy.

**I wanted:**
- Code that reads like your inner monologue
- Errors that teach instead of confuse
- Results that slap immediately
- Zero gatekeeping

**I got tired of:**
- Googling what `~` and `@` mean for the 47th time
- "Syntax error" with zero context
- Spending 3 hours to make a basic drum loop
- Feeling dumb for not "getting it"

---

## ⚡ Why SLAPT Hits Different

### 1. **It Just Makes Sense™**

```
// Level 1: Your first day
drums:
  kick on 1 and 3
  snare on 2 and 4

// Level 30: Two weeks later
drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2, 4 with velocity random(0.7 to 0.9)
  hihat closed 8 times
  apply vintage compression
  make it dusty
```

Same language, different power level. No sudden difficulty spike. No "jk now learn regex."

### 2. **Errors That Actually Help**

Remember getting roasted by compiler errors? Yeah, I don't do that here.

```
play kick every 3 beats

⚠️ Timing feels off! 
   → "every 3 beats" creates uneven bars (4 beats per bar)
   
   💡 Did you mean: 
      • "kick on 1 and 3" (downbeats)
      • "kick every 3rd beat" (1, 4, 3, 2, 1...)
      
   🎵 Listen to what you wrote: [▶️ plays back]
```

Not "SyntaxError: line 4" and a middle finger. I give you options, context, and *let you hear it*.

### 3. **Genre Awareness Built In**

```
@genre lofi-hiphop
@tempo 72 bpm

// SLAPT already knows:
// ✓ Add vinyl crackle
// ✓ Use that chill swing
// ✓ Warm, dusty samples
// ✓ Jazz-influenced chords
// ✓ Laid-back timing
```

Type "lofi-hiphop" and it sets the whole vibe. No PhD in music theory required.

### 4. **The "Make It" Commands**

This is where it gets spicy:

```
drums:
  kick on 1 and 3
  snare on 2 and 4
  hihat 8 times

make it groovy    // adds swing, humanization, ghost notes
make it dusty     // bitcrush, vinyl crackle, rolled-off highs
add some laziness // pushes timing back, reduces velocity
bring energy up   // increases velocity, adds fills
```

One line. Entire vibe shift. That's the SLAPT difference.

---

## 🎯 Who Is This For?

### ✅ You should use SLAPT if:
- You want to make beats but coding feels like alien language
- You're tired of spending 6 hours on YouTube tutorials
- You learn by doing, not by reading documentation
- You want your code to be as fire as your beats
- You think music production should be fun, not a CS degree
- You've tried other tools and rage-quit

### ❌ Maybe stick to your DAW if:
- You need pixel-perfect MIDI editing (for now)
- You're already fluent in TidalCycles and love it
- You prefer clicking buttons over typing
- You need every VST plugin under the sun

---

## 🚀 Quick Start (Literally 2 Minutes)

### Run with Docker

```bash
git clone https://github.com/souvik03-136/slapt
cd slapt
docker-compose up --build
```

Open `http://localhost`. That's it.

### Run in dev mode (no Docker)

```bash
# Terminal 1 — parser service
cd services/parser
npm install
npm run dev

# Terminal 2 — web frontend
cd services/web
npm install
npm run dev
```

Web on `http://localhost:3000`, parser on `http://localhost:3001`.

---

## 📚 Learn By Example

### The Midnight Study Session
```
// A complete lofi track in SLAPT

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
  progression Am7 → Fmaj7 → Dm7 → E7
  voicing spread
  rhythm whole notes with slight anticipation
  reverb(medium, dreamy)
  tremolo(gentle, 4Hz)
  
bass walking the roots:
  follow chord progression
  sound mellow
  
section intro:
  only drums + atmosphere
  fade in over 4 bars

section verse:
  add chords at bar 4
  add bass after 4 bars
  
section chorus:
  bring energy up
  
section outro:
  fade out everything over 8 bars
  keep vinyl crackle till end
```

**Output:** A full lofi track with intro, verse, chorus, outro. Ready to export as WAV, MP3, or MIDI.

---

## 🎨 The SLAPT Philosophy

### 1. **Write Music Like You Feel It**
If you can describe it, you can code it. "Lazy hi-hats"? Done. "Dusty vinyl vibe"? Easy. "That groovy thing J Dilla does"? We got you.

### 2. **Mistakes Are Features**
In lofi, imperfection is the aesthetic. SLAPT embraces this. Timing doesn't need to be robotic. Velocity doesn't need to be perfect. Your "mistakes" might be the best part.

### 3. **No Gatekeeping**
Music production has too many barriers already. Expensive software, steep learning curves, elitist communities. SLAPT is free, approachable, and welcomes everyone.

### 4. **Progressive Complexity**
Start simple. Add layers as you learn. Never feel overwhelmed. Never hit a wall where suddenly everything is different.

---

## 🔮 What's Next?

### Phase 1 (Now): Lo-fi & Hip-Hop
- ✅ Lofi hip-hop
- ✅ Boom-bap
- ✅ Core drum programming
- ✅ Basic effects & modifiers

### Phase 2 (Soon™): Electronic Expansion
- 🔄 House & Techno
- 🔄 Ambient & Downtempo
- 🔄 Trap & Drill
- 🔄 VST plugin support

### Phase 3 (Future): Everything Else
- ⏳ DnB, Jungle, Breakbeat
- ⏳ Jazz, Funk, Soul
- ⏳ Experimental & Generative
- ⏳ Live performance mode
- ⏳ Collaboration features

---

## 🤝 Contributing

SLAPT is open source because music should be accessible to everyone.

**Ways to contribute:**
- 🐛 Report bugs (with kindness)
- 💡 Suggest features (dream big)
- 📝 Improve docs (explain it better than we did)
- 🎵 Add genre templates (share your expertise)
- 🔧 Submit PRs (code that slaps)

Check out [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📜 License

MIT License - Do whatever you want. Make money. Don't make money. Just make music.

---

## 🙏 Credits

**Built with love by me:**
- A music producer tired of complicated tools
- A developer who wanted to make beats
- Someone who believes there has to be a better way

**Inspired by:**
- TidalCycles & Strudel (respect to the OGs)
- Sonic Pi (you paved the way)
- Every producer who shares knowledge freely
- J Dilla, Nujabes, and the whole lofi aesthetic

---

## 🎧 Final Thoughts

Music production shouldn't feel like work. It shouldn't require a computer science degree. It shouldn't make you feel dumb.

SLAPT is here to change that.

**Write code that slaps. Make beats that hit. Ship tracks that vibe.**

No cap. 🚫🧢

---

<div align="center">

### Is your code slapping yet?

[Get Started](./docs/DOCUMENTATION.md) • [Tutorials](./docs/TUTORIALS.md)

**⭐ Star us on GitHub if SLAPT helped you make something fire**

</div>

---

## Quick Links

- 📖 [Documentation](./docs/DOCUMENTATION.md) — architecture, language reference, API
- 🎓 [Tutorials](./docs/TUTORIALS.md) — 10 step-by-step guides from first beat to full arrangement
- ⚙️ [Task Commands](./TASKS.md) — all `task` commands for Docker, dev, tests, build, and cleanup
- 🧪 [Tests](./tests) — lexer, error validation, and API integration tests
- 🤝 [Contributing](./CONTRIBUTING.md) — how to report bugs, add genres, submit PRs
- 🔒 [Security](./SECURITY.md) — how to report vulnerabilities
- 🐛 [Report Issues](https://github.com/souvik03-136/slapt/issues)
- 💡 [Feature Requests](https://github.com/souvik03-136/slapt/discussions)

---

*"Finally, a music programming language that doesn't make me want to uninstall everything."*  
— Every SLAPT user, probably

*Built different. Sounds different. Is different.* 🎵✨