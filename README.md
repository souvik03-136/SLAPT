# SLAPT

> **Is your code slapping? Because mine is.**

## What if making music felt like texting your bestie?

You know that feeling when a beat just *hits different*? When the bass drops and everything clicks? That's what coding music should feel like. But instead, you see this:

```javascript
// Other tools be like:
s("bd").struct("<[x*<1 2> [~@3 x]] x>")
sound("hh*8").gain(0.6).delay(0.5)
```

Meanwhile us: *"bro what?"*

## Welcome to SLAPT

**SLAPT** = **S**ounds **L**ike **A** **P**erfect **T**rack
*(or Sonic Language Audio Programming Tool if ur parents are asking)*

Said "nah" to cryptic symbols and made music programming that actually makes sense:

```
play kick every beat
play snare on beats 2 and 4
play hihat 8 times per bar with swing
```

Read that. You understood it immediately. That's the whole point.

---

## Download & Run (No Setup)

**Requires:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running. That's the only dependency.

### Step 1 — Download the latest release

Go to [Releases](https://github.com/souvik03-136/slapt/releases) and download `slapt-vX.X.X.zip`.

### Step 2 — Unzip it

Unzip anywhere. You'll get a folder with these files:

```
slapt-v0.1.0/
  start.bat              <- Windows
  start.sh               <- Mac / Linux
  stop.bat               <- Windows
  stop.sh                <- Mac / Linux
  docker-compose.release.yml
  .env
```

### Step 3 — Start it

**Windows:** double-click `start.bat`

**Mac / Linux:**
```bash
chmod +x start.sh
./start.sh
```

Browser opens automatically at `http://localhost`. Done.

### Stop it

**Windows:** double-click `stop.bat`

**Mac / Linux:** `./stop.sh`

---

## The Vibe

### If you can text, you can make beats

SLAPT was built because learning music production felt like studying ancient hieroglyphics. TidalCycles and Strudel are powerful, sure, but they're not exactly giving "intuitive" energy.

**Wanted:**
- Code that reads like your inner monologue
- Errors that teach instead of confuse
- Results that slap immediately
- Zero gatekeeping

**Tired of:**
- Googling what `~` and `@` mean for the 47th time
- "Syntax error" with zero context
- Spending 3 hours to make a basic drum loop
- Feeling dumb for not "getting it"

---

## Why SLAPT Hits Different

### 1. It Just Makes Sense

```
// Level 1: Your first day
drums:
  kick on 1 and 3
  snare on 2 and 4

// Level 30: Two weeks later
drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  snare velocity random(0.7 to 0.9)
  hihat closed 8 times
  apply bitcrush(10bit)
  compress heavily
  make it dusty
```

Same language, different power level. No sudden difficulty spike.

### 2. Errors That Actually Help

```
kick on 5

-> Error: BEAT_OUT_OF_RANGE
   "Beat 5 doesn't exist in 4/4 time"

   Suggestions:
   - Beats go from 1 to 4 in your current time signature
   - Try @timesig 5/4 if you want 5 beats per bar
   - Did you mean beat 1?
```

Not "SyntaxError: line 4" and a middle finger. You get options, context, and what went wrong.

### 3. Genre Awareness Built In

```
@genre lofi-hiphop
@tempo 72 bpm

// SLAPT already knows:
// - Add vinyl crackle
// - Use that chill swing
// - Warm, dusty samples
// - Jazz-influenced chords
// - Laid-back timing
```

Type `lofi-hiphop` and it sets the whole vibe.

### 4. The "Make It" Commands

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

One line. Entire vibe shift.

---

## Who Is This For?

**You should use SLAPT if:**
- You want to make beats but coding feels like alien language
- You're tired of spending 6 hours on YouTube tutorials
- You learn by doing, not by reading documentation
- You think music production should be fun, not a CS degree
- You've tried other tools and rage-quit

**Maybe stick to your DAW if:**
- You need pixel-perfect MIDI editing (for now)
- You're already fluent in TidalCycles and love it
- You prefer clicking buttons over typing
- You need every VST plugin under the sun

---

## Run From Source (Developers)

### 1. Clone and configure

```bash
git clone https://github.com/souvik03-136/slapt
cd slapt
```

The repo ships with a `.env` file at the root. Open it and check the defaults:

```env
# .env (root - single config for everything)
NGINX_PORT=80
WEB_PORT=3000
PARSER_PORT=3001
PARSER_URL=http://parser:3001
NODE_ENV=production
```

You almost never need to change these. Only edit if port 80 is already taken on your machine.

### 2. Run with Docker

```bash
docker-compose up --build
```

Open `http://localhost`. Done.

### 3. Run in dev mode (no Docker)

```bash
# Terminal 1 - parser service
cd services/parser
npm run dev

# Terminal 2 - web frontend
cd services/web
npm run dev
```

Web runs on `http://localhost:3000`, parser on `http://localhost:3001`.

---

## Learn By Example

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

Note: chord progressions use `->` (two characters you can type on any keyboard).

---

## The SLAPT Philosophy

**Write Music Like You Feel It** - If you can describe it, you can code it.

**Mistakes Are Features** - In lofi, imperfection is the aesthetic. Your "mistakes" might be the best part.

**No Gatekeeping** - Free, approachable, welcomes everyone.

**Progressive Complexity** - Start simple. Add layers as you learn. Never hit a wall.

---

## What's Next?

### Phase 1 (Now): Lo-fi and Hip-Hop
- [x] Lofi hip-hop
- [x] Boom-bap
- [x] Core drum programming
- [x] Basic effects and modifiers
- [x] Atmosphere audio (vinyl crackle, rain, tape wobble)
- [x] Velocity humanization
- [x] GitHub releases with one-click install

### Phase 2 (Soon): Electronic Expansion
- [ ] House and Techno
- [ ] Ambient and Downtempo
- [ ] Trap and Drill
- [ ] VST plugin support

### Phase 3 (Future): Everything Else
- [ ] DnB, Jungle, Breakbeat
- [ ] Jazz, Funk, Soul
- [ ] Experimental and Generative
- [ ] Live performance mode
- [ ] Collaboration features

---

## Contributing

SLAPT is open source because music should be accessible to everyone.

- Report bugs (with kindness)
- Suggest features (dream big)
- Improve docs (explain it better)
- Add genre templates (share your expertise)
- Submit PRs (code that slaps)

Check out [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT - Do whatever you want. Make money. Don't make money. Just make music.

---

## Credits

Inspired by TidalCycles, Strudel, Sonic Pi, and every producer who shares knowledge freely.
J Dilla and Nujabes for the whole lofi aesthetic.

---

## Quick Links

- [Releases](https://github.com/souvik03-136/slapt/releases) - download the latest version
- [Documentation](./docs/DOCUMENTATION.md) - architecture, language reference, API
- [Tutorials](./docs/TUTORIALS.md) - 10 step-by-step guides from first beat to full arrangement
- [Task Commands](./TASKS.md) - all `task` commands for Docker, dev, tests, build, and cleanup
- [Tests](./tests) - lexer, error validation, and API integration tests
- [Contributing](./CONTRIBUTING.md) - how to report bugs, add genres, submit PRs
- [Security](./SECURITY.md) - how to report vulnerabilities
- [Report Issues](https://github.com/souvik03-136/slapt/issues)
- [Feature Requests](https://github.com/souvik03-136/slapt/discussions)

---

*"Finally, a music programming language that doesn't make me want to uninstall everything."*

*Built different. Sounds different. Is different.*