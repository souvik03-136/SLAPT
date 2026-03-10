<h1 align="center">

```
  ███████╗██╗      █████╗ ██████╗ ████████╗
  ██╔════╝██║     ██╔══██╗██╔══██╗╚══██╔══╝
  ███████╗██║     ███████║██████╔╝   ██║   
  ╚════██║██║     ██╔══██║██╔═══╝    ██║   
  ███████║███████╗██║  ██║██║        ██║   
  ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝        ╚═╝   
```

</h1>

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

You know that feeling when a beat just *hits different*? When the bass drops and everything clicks? That's what coding music should feel like.

## Welcome to SLAPT

Music programming that actually makes sense:

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

### Step 1 → Download the latest release

Go to [Releases](https://github.com/souvik03-136/slapt/releases) and download `slapt-vX.X.X.zip`.

### Step 2 → Unzip it

Unzip anywhere. You'll get a folder with these files:

```
slapt-v1.1.0/
  start.bat              <- Windows
  start.sh               <- Mac / Linux
  stop.bat               <- Windows
  stop.sh                <- Mac / Linux
  docker-compose.release.yml
  .env
```

### Step 3 → Start it

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

SLAPT was built around one idea: music programming should feel approachable, not intimidating.

**What we're going for:**
- Code that reads like your inner monologue
- Errors that teach instead of confuse
- Results that slap immediately
- Zero gatekeeping

---

## A Quick Taste

### Natural Syntax That Scales With You

```
// Level 1: Your first day
drums:
  kick on 1 and 3
  snare on 2 and 4

// Level 30: Two weeks later
@timesig 3/4

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

### Errors That Actually Help

```
kick on 5

→ Error: BEAT_OUT_OF_RANGE
   "Beat 5 doesn't exist in 4/4 time"
   context: "kick on"

   Suggestions:
   - Beats go from 1 to 4 in your current time signature
   - Did you mean beat 1?
```

### One-Line Vibe Shifts

```
make it groovy    // swing + humanization
make it dusty     // bitcrush + vinyl crackle
add some laziness // pushed-back timing
bring energy up   // higher velocity, drum fills
```

### The Full Lo-fi Setup

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
  reverb(medium, dreamy)

bass walking the roots:
  follow chord progression
  sound mellow

make it dusty
```

---

## What's New in v1.1.0

### Open Hihat on Specific Beats
Place an open hihat exactly where you want it. The closed grid skips that position automatically — no double-hits.

```
hihat closed 8 times
hihat open on 4
hihat open on 2 and 4   // multiple beats
```

### Time Signatures — 3/4 and 5/4
Write in waltz or odd time. Beat validation adjusts automatically.

```
@timesig 3/4   // beats 1–3 valid, waltz feel
@timesig 5/4   // beats 1–5 valid, Radiohead territory
```

### MIDI Export
Click the **MIDI** button. Download a `.mid` file that works in any DAW — Ableton, Logic, FL Studio, GarageBand. Drums on GM channel 10, chords on channel 1, bass on channel 2.

### More Keys
Four new keys: `F#m` (ethereal), `Bb` (jazzy), `Ab` (lush), `Ebm` (heavy). Now 11 total.

### Auto-Save
Your code saves to `localStorage` on every keystroke. Refresh, close the tab, restart Docker — your track comes back automatically.

### In-App Documentation
Hit the **Docs** button in the top bar. Full language reference and examples without leaving the editor.

### Reset Button
One click restores the default example track if you want a clean start.

---

## Who Is This For?

**You should use SLAPT if:**
- You want to make beats but coding feels like alien language
- You're tired of spending hours on tutorials before hearing a single sound
- You learn by doing, not by reading documentation
- You think music production should be fun, not a CS degree

**Maybe stick to your DAW if:**
- You need pixel-perfect MIDI editing
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

## What's Next?

### Phase 1 (Done): Foundation
- [x] Core drum programming (kick, snare, hihat, swing, velocity)
- [x] Open hihat on specific beats (`hihat open on 4`, `hihat open on 2 and 4`)
- [x] Time signatures — `@timesig 3/4`, `4/4`, `5/4` with automatic beat range validation
- [x] Chord block with rhodes piano voicings
- [x] Bass block following chord roots
- [x] Atmosphere synthesis (vinyl crackle, rain, tape wobble)
- [x] Global modifiers (groovy, dusty, lazy, energetic)
- [x] Sections (intro, verse, chorus, outro)
- [x] Genre-aware validation (lofi-hiphop, boom-bap, house, techno, dnb, ambient, trap)
- [x] Key-aware note validation — 11 keys (Am, Cm, Dm, Em, F#m, Ebm, C, G, F, Bb, Ab)
- [x] MIDI export — download `.mid` for any DAW
- [x] Copy code button in editor
- [x] Auto-save to localStorage — code persists through refresh
- [x] Reset button — restores default example track
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

## Tagging a New Release

If you're a maintainer cutting a new release:

```bash
# 1. Make sure main is clean and all CI is green
git checkout main
git pull

# 2. Tag the release (semver — bump major.minor.patch as appropriate)
git tag v1.1.0

# 3. Push the tag — this triggers the release workflow automatically
git push origin v1.1.0
```

The `release.yml` workflow kicks in: it builds and pushes versioned Docker images to GHCR, packages `slapt-v1.1.0.zip` (start/stop scripts + `docker-compose.release.yml`), generates a grouped changelog from commit history, and creates the GitHub Release with the zip attached.

**No manual steps after the tag push.** The workflow does everything.

To overwrite an existing tag locally and remotely if you need to redo a release:

```bash
git tag -d v1.1.0
git push origin :refs/tags/v1.1.0
git tag v1.1.0
git push origin v1.1.0
```

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
- **Add permanently:** Fork → create `tracks/your-username--track-name.md` → PR

---

## Quick Links

- [Releases](https://github.com/souvik03-136/slapt/releases) → download the latest version
- [Documentation](./docs/DOCUMENTATION.md) → architecture, language reference, API
- [Tutorials](./docs/TUTORIALS.md) → step-by-step guides from first beat to advanced patterns
- [Task Commands](./TASKS.md) → all `task` commands for Docker, dev, tests, build, and cleanup
- [Tests](./tests) → lexer, error validation, and API integration tests
- [Contributing](./CONTRIBUTING.md) → how to report bugs, add genres, submit PRs
- [Security](./SECURITY.md) → how to report vulnerabilities
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
  <img src="media/slapt.png" alt="SLAPT" width="400"/>
</p>

<p align="center"><em>"Finally, a music programming language that doesn't make me want to uninstall everything."</em></p>

<p align="center"><strong>Built different. Sounds different. Is different.</strong></p>