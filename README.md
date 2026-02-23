<p align="center">
  <img src="images/slapt.png" alt="SLAPT Logo" width="600"/>
</p>

<h1 align="center">SLAPT</h1>
<p align="center"><em><strong>S</strong>ounds <strong>L</strong>ike <strong>A</strong> <strong>P</strong>erfect <strong>T</strong>rack</em><br/>
<sub><em>(or Sonic Language Audio Programming Tool if ur parents are asking)</em></sub></p>

<p align="center">
  <a href="https://github.com/souvik03-136/slapt/releases"><img src="https://img.shields.io/github/v/release/souvik03-136/slapt?style=flat-square&color=blueviolet" alt="Latest Release"/></a>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT License"/>
  <img src="https://img.shields.io/badge/requires-Docker-2496ED?style=flat-square&logo=docker" alt="Docker"/>
</p>

---

> **Is your code slapping? Because mine is.**

## What if making music felt like texting your bestie?

You know that feeling when a beat just *hits different*? When the bass drops and everything clicks? That's what coding music should feel like. But instead, you're staring at this:

```javascript
// Other tools be like:
s("bd").struct("<[x*<1 2> [~@3 x]] x>")
sound("hh*8").gain(0.6).delay(0.5)
```

Meanwhile us: *"bro what?"*

## Welcome to SLAPT

We said "nah" to cryptic symbols and built music programming that actually makes sense:

```
drums:
  kick on 1 and 3
  snare on 2 and 4
  hihat 8 times
```

Read that. You understood it immediately. That's the whole point.

---

## Download & Run (No Setup)

**Requires:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running. That's literally the only dependency.

### Step 1 -> Download the latest release

Go to [Releases](https://github.com/souvik03-136/slapt/releases) and download `slapt-vX.X.X.zip`.

### Step 2 -> Unzip it

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

### Step 3 -> Start it

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
  hihat open on 4
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
   - Did you mean beat 1?
```

Not "SyntaxError: line 4" and a middle finger. You get the exact line, the context (kick on / kick pattern / snare on / hihat open on), and suggestions for what to try instead.

### 3. Genre Awareness Built In

```
@genre lofi-hiphop
@tempo 72 bpm

// SLAPT already knows:
// - Typical BPM range (60-90)
// - Warn if tempo feels off for the genre
// - Scale validation for your key
```

Set the genre, get smart warnings. Supported: `lofi-hiphop`, `boom-bap`, `house`, `techno`, `dnb`, `ambient`, `trap`.

### 4. The "Make It" Commands

```
drums:
  kick on 1 and 3
  snare on 2 and 4
  hihat 8 times

make it groovy    // swing >= 60%, humanization
make it dusty     // bitcrush + vinyl crackle auto-added
add some laziness // pushed-back timing, lower velocity
bring energy up   // higher velocity, drum fills
```

One line. Entire vibe shift. Stack them freely.

### 5. Synthesized Atmosphere — No Samples

```
atmosphere:
  vinyl crackle at 20% volume      // 2-layer noise synthesis
  rain sounds softly in background // 3-layer noise synthesis
  tape wobble subtle               // BPM flutter via sine curve
```

Everything is generated in the browser. No audio files. No downloads.

### 6. Open Hihat On Specific Beats

```
drums with swing(60%):
  hihat closed 8 times
  hihat open on 4
```

Place an open hihat on any beat you want. The closed grid automatically skips that position — no double-hit, no overlap. Standard drum machine behaviour, no config needed.

### 7. Odd Time Signatures

```
@timesig 3/4   // waltz / jazz waltz
@timesig 5/4   // Dave Brubeck / Radiohead territory
```

Beat validation adjusts automatically. Use beats 1–3 in 3/4, beats 1–5 in 5/4. SLAPT tells you if you go out of range.

### 8. More Keys

```
@key F#m   // ethereal, floaty — great for ambient
@key Bb    // jazzy, soulful
@key Ab    // rich, lush — neo-soul
@key Ebm   // deep, heavy — suits trap / dnb
```

11 keys total. Scale validation works across all of them.

### 9. MIDI Export

Click **MIDI** in the top bar. Downloads a standard `.mid` file with separate tracks for drums (GM channel 10), chords, and bass. Drop it straight into Ableton, Logic, FL Studio, GarageBand — any DAW.

### 10. Your Code Never Disappears

Code is auto-saved to `localStorage` as you type. Refresh, close the tab, come back tomorrow — your track is still there.

---

## Who Is This For?

**You should use SLAPT if:**
- You want to make beats but coding feels like alien language
- You're tired of spending 6 hours on YouTube tutorials
- You learn by doing, not by reading documentation
- You think music production should be fun, not a CS degree
- You've tried other tools and rage-quit

**Maybe stick to your DAW if:**
- You need pixel-perfect MIDI editing
- You're already fluent in TidalCycles and love it
- You prefer clicking buttons over typing

---

## Run From Source (Developers)

### 1. Clone and configure

```bash
git clone https://github.com/souvik03-136/slapt
cd slapt
```

The repo ships with a `.env` file at the root:

```env
# .env (root - single config for everything)
NGINX_PORT=80
WEB_PORT=3000
PARSER_PORT=3001
PARSER_URL=http://parser:3001
NODE_ENV=production
```

Only edit if port 80 is already taken on your machine.

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

### The Jazz Waltz

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

### The Five-Beat Weirdo

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

> Note: chord progressions use `->` (two ASCII characters — works on every keyboard).

---

## What's Built

### Language
- `@genre`, `@tempo`, `@key` directives
- `@timesig` directive — 3/4, 4/4, 5/4; beat validation adjusts automatically
- `drums:` block — kick pattern, kick on, snare on, snare velocity, hihat closed N times, **hihat open on specific beats**, bitcrush, compress, swing
- `chords using rhodes piano:` block — progression, voicing, reverb, tremolo
- `bass walking the roots:` block — follow chord progression, sound, filter
- `atmosphere:` block — vinyl crackle, rain, tape wobble (all synthesized, no samples)
- `section:` blocks — intro, verse, chorus, outro with fade in/out
- Global modifiers — `make it groovy`, `make it dusty`, `add some laziness`, `bring energy up`

### Audio Engine
- Real-time synthesis via Tone.js — no samples, no audio files
- Separate signal chains per instrument (kick, snare, hihat, chords, bass)
- Independent compressors and bitcrushers per instrument — no bleed
- **Open hihat**: longer gate on specific beats, closed grid auto-skips those positions
- Chord voicings for Am7, Fmaj7, Dm7, E7, Cmaj7, Gmaj7, Am, Dm, Em
- Bass root notes mapped per chord, one octave below
- Vinyl crackle: 2-layer (surface hum + random pops)
- Rain: 3-layer brown/pink noise blend
- Tape wobble: sine-curve BPM nudge via setInterval

### MIDI Export
- Zero-dependency pure-TypeScript MIDI type-1 builder
- Drums on GM channel 10 (kick 36, snare 38, closed hihat 42, open hihat 46)
- Chords on channel 1, bass on channel 2 — 4 bars exported
- Button disabled while parse errors exist

### Validation & Errors
- `BEAT_OUT_OF_RANGE` — checked for kick on, kick pattern, snare on, **hihat open on**; range adjusts per `@timesig`
- `TIMESIG_UNSUPPORTED` — fires when a time sig other than 3/4, 4/4, 5/4 is used
- `TEMPO_GENRE_MISMATCH` — warning when BPM is outside genre's typical range
- `NOTE_OUT_OF_SCALE` — warning when chord note is outside declared key
- `LEXER_ERROR` / `PARSE_ERROR` — with line number and character offset

### Editor & UI
- CodeMirror 6 with oneDark theme and line numbers
- **Copy button** — top-right of editor, copies full code to clipboard with checkmark feedback
- 400ms debounced parse — status dot shows valid/error state
- **Auto-save** — code persisted to `localStorage` as you type, survives refresh
- 16-step drum timeline visualization
- Error panel with code, line, context, and suggestions
- **MIDI export button** in top bar — downloads `.mid`, disabled on errors
- Slide-over docs panel — full language reference accessible in-app
- Genre template buttons and modifier shortcuts in sidebar

### Supported Genres
`lofi-hiphop` · `boom-bap` · `house` · `techno` · `dnb` · `ambient` · `trap`

### Supported Keys
`Am` · `Cm` · `Dm` · `Em` · `F#m` · `Ebm` · `C` · `G` · `F` · `Bb` · `Ab`

### Supported Time Signatures
`3/4` · `4/4` (default) · `5/4`


---

## What's Next?

### Phase 1 (Now): Foundation
- [x] Core drum programming (kick, snare, hihat, swing, velocity)
- [x] Open hihat on specific beats (`hihat open on 4`)
- [x] Chord block with rhodes piano voicings
- [x] Bass block following chord roots
- [x] Atmosphere synthesis (vinyl crackle, rain, tape wobble)
- [x] Global modifiers (groovy, dusty, lazy, energetic)
- [x] Sections (intro, verse, chorus, outro)
- [x] Genre-aware validation (lofi-hiphop, boom-bap, house, techno, dnb, ambient, trap)
- [x] Key-aware note validation (Am, Cm, Dm, Em, F#m, Ebm, C, G, F, Bb, Ab)
- [x] `@timesig` directive — 3/4, 4/4, 5/4 with automatic beat range validation
- [x] MIDI export — download `.mid` for any DAW
- [x] Copy code button in editor
- [x] Auto-save to localStorage — code persists through refresh
- [x] Helpful error messages with context and suggestions
- [x] In-app documentation panel
- [x] GitHub releases with one-click install

### Phase 2 (Soon): More Expression
- [ ] More chord voicings and instruments beyond rhodes piano
- [ ] More atmosphere layers (custom noise types)
- [ ] More genre templates

### Phase 3 (Future): Everything Else
- [ ] DnB, Jungle, Breakbeat
- [ ] Jazz, Funk, Soul
- [ ] Live performance mode
- [ ] Collaboration features
- [ ] Generative/randomized patterns

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

## Community Tracks

People are making things with SLAPT. Come see what's possible — or add yours.

- **Browse tracks:** [TRACKS.md](./TRACKS.md)
- **Quick share (no PR):** [Discussions → Show & Tell](https://github.com/souvik03-136/slapt/discussions)
- **Add permanently:** Fork -> create `tracks/your-username--track-name.md` -> PR

---

## Quick Links

- [Releases](https://github.com/souvik03-136/slapt/releases) -> download the latest version
- [Documentation](./docs/DOCUMENTATION.md) -> architecture, language reference, API
- [Task Commands](./TASKS.md) -> all `task` commands for Docker, dev, tests, build, and cleanup
- [Tests](./tests) -> lexer, error validation, and API integration tests
- [Contributing](./CONTRIBUTING.md) -> how to report bugs, add genres, submit PRs
- [Security](./SECURITY.md) -> how to report vulnerabilities
- [Report Issues](https://github.com/souvik03-136/slapt/issues)
- [Feature Requests](https://github.com/souvik03-136/slapt/discussions)

---

## License

MIT — Free to use, modify, and distribute.

---

## Credits

Inspired by TidalCycles, Strudel, Sonic Pi, and every producer who shares knowledge freely.

---

## Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/souvik03-136">
        <img src="https://avatars.githubusercontent.com/souvik03-136" width="100px;" alt="Souvik Mahanta"/>
        <br />
        <sub><b>Souvik Mahanta</b></sub>
      </a>
      <br />
      <a href="https://www.linkedin.com/in/souvik-mahanta" title="LinkedIn">🔗</a>
      <a href="https://github.com/souvik03-136" title="GitHub">🐙</a>
    </td>
  </tr>
</table>

---

<p align="center">
  <img src="images/slapt.png" alt="SLAPT" width="400"/>
</p>

<p align="center"><em>"Finally, a music programming language that doesn't make me want to uninstall everything."</em></p>

<p align="center"><strong>Built different. Sounds different. Is different.</strong></p>