# SLAPT Documentation

## Architecture

SLAPT runs as three Docker services orchestrated via `docker-compose.yml`:

```
nginx (:80)
  ├── /api/parse  →  parser (:3001)   [Node.js + TypeScript + Chevrotain]
  └── /           →  web    (:3000)   [SvelteKit + Tone.js + CodeMirror 6]
```

The parser is a stateless REST service. The web frontend does all audio synthesis client-side using the Web Audio API via Tone.js.

---

## Running Locally

```bash
docker-compose up --build
```

Open `http://localhost`. No other setup required.

For iterative development without Docker:

```bash
# Terminal 1 — parser
cd services/parser
npm install
npm run dev

# Terminal 2 — web
cd services/web
npm install
npm run dev
```

Web runs on `:3000`, parser on `:3001`. The web service proxies `/api/parse` to the parser only in Docker. In dev mode, set the parser URL directly in `services/web/src/lib/api/parser.ts`.

---

## Parser Service

**Endpoint:** `POST /api/parse`

**Request:**
```json
{ "code": "your slapt code here" }
```

**Response:**
```json
{
  "tokens": [
    { "tokenType": "Genre", "image": "genre", "startLine": 1, "startColumn": 2 }
  ],
  "errors": [
    {
      "code": "BEAT_OUT_OF_RANGE",
      "message": "Beat 5 doesn't exist in 4/4 time",
      "line": 4,
      "column": 12,
      "suggestions": ["Beats go from 1 to 4 in your current time signature"]
    }
  ],
  "warnings": [
    {
      "code": "TEMPO_GENRE_MISMATCH",
      "message": "180 BPM feels off for lofi-hiphop",
      "suggestions": ["Typical lofi-hiphop range: 60–90 BPM"]
    }
  ],
  "success": true
}
```

`success` is `true` when `errors` is empty. Warnings do not affect `success`.

**Health check:** `GET /health` → `{ "status": "ok", "service": "slapt-parser" }`

---

## Validation Rules

### Tempo/Genre Mismatch

Fires a warning when your `@tempo` is outside the genre's typical range.

| Genre | BPM Range |
|---|---|
| lofi-hiphop | 60–90 |
| boom-bap | 80–100 |
| house | 120–135 |
| techno | 130–150 |
| dnb | 160–180 |
| ambient | 60–90 |
| trap | 130–170 |

### Beat Out of Range

Fires an error when a beat number exceeds the time signature (default 4/4).

```
kick on 5
→ Error: BEAT_OUT_OF_RANGE
```

### Note Out of Scale

Fires a warning when a note is not in the declared `@key` scale.

Supported keys: `Am`, `Cm`, `Dm`, `Em`, `C`, `G`, `F`

---

## SLAPT Language Reference

### Directives

```
@genre lofi-hiphop
@tempo 75 bpm
@key Am
```

Directives must appear at the top of the file. Genre sets defaults for tempo and key if not explicitly declared.

### Drum Block

```
drums with swing(60%):
  kick pattern [1, 2.75, 3]
  kick on 1 and 3
  snare on 2 and 4
  snare velocity random(0.7 to 0.9)
  hihat closed 8 times
  hihat open occasionally
  apply bitcrush(10bit)
  compress heavily
  filter below 80Hz
```

- `kick pattern [...]` accepts any decimal beat positions.
- `kick on X and Y` is shorthand for two beats.
- `hihat N times` divides the bar into N equal hits.
- `swing(N%)` shifts every other 8th note by N%.

### Chord Block

```
chords using rhodes piano:
  progression Am7 → Fmaj7 → Dm7 → E7
  voicing spread
  rhythm whole notes with slight anticipation
  reverb(medium, dreamy)
  tremolo(gentle, 4Hz)
```

`→` separates chords in the progression. Each chord occupies one bar.

Built-in chord voicings: `Am7`, `Fmaj7`, `Dm7`, `E7`, `Cmaj7`, `Gmaj7`, `Am`, `Dm`, `Em`.

### Bass Block

```
bass walking the roots:
  follow chord progression
  sound mellow
  filter warm
```

Bass automatically follows the root note of each chord in the progression.

### Atmosphere Block

```
atmosphere:
  vinyl crackle at 20% volume
  rain sounds softly in background
  tape wobble subtle
```

### Section Block

```
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
```

### Global Modifiers

Applied after all blocks. Each modifier adjusts the interpretation of what was declared above it.

```
make it groovy      → swing 60%, humanization, ghost notes
make it dusty       → bitcrush, vinyl crackle, rolled-off highs
add some laziness   → swing 40%, pushed-back timing
bring energy up     → increased velocity, fills every 4 bars
```

---

## Audio Engine

The engine lives entirely in `services/web/src/lib/audio/engine.ts` and uses Tone.js.

### Synth Routing

```
kickSynth    → Compressor → Destination
snareSynth   → Filter → Compressor → Destination
hihatSynth   → Destination
chordSynth   → Tremolo → Reverb → Destination
bassSynth    → LowpassFilter → Destination
```

### Playback Flow

1. `initAudio()` — creates all synths and effects, must be called after a user gesture
2. `playDrums(pattern, tempo)` — builds a `Tone.Part` for kick/snare/hihat
3. `playChords(progression, instrument, tempo)` — builds a `Tone.Part` for chords
4. `playBass(progression, tempo)` — builds a `Tone.Part` for bass roots
5. `startPlayback()` — starts `Tone.Transport` and all parts simultaneously
6. `stopPlayback()` — stops transport and cancels all scheduled events
7. `cleanup()` — disposes all Tone nodes, call on component destroy

### Bar Tracking

```typescript
setBarChangeCallback((bar: number) => {
  slaptStore.setCurrentBar(bar);
});
```

The engine fires this callback every bar via `Tone.Transport.scheduleRepeat`.

---

## Web Service

### Stores (`src/lib/stores/slapt.ts`)

| Store | Type | Description |
|---|---|---|
| `slaptStore.code` | `string` | Current editor content |
| `slaptStore.parseResult` | `ParseResult \| null` | Latest parse response |
| `slaptStore.playbackState` | `stopped \| playing \| paused` | Transport state |
| `slaptStore.tempo` | `number` | Current BPM |
| `slaptStore.currentBar` | `number` | Bar counter from engine |
| `slaptStore.isLoading` | `boolean` | Parse in flight |

Derived stores: `hasErrors`, `hasWarnings`, `isPlaying`.

### Components

| Component | Responsibility |
|---|---|
| `Editor.svelte` | CodeMirror 6 instance, debounced parse on change |
| `Controls.svelte` | Play/pause/stop, extracts pattern from code, calls engine |
| `Timeline.svelte` | 16-step grid visualization of kick/snare/hihat |
| `ErrorPanel.svelte` | Renders errors and warnings with suggestions |

Parse is debounced at **400ms** after the last keystroke.

---

## Environment Variables

| Variable | Service | Default | Description |
|---|---|---|---|
| `PORT` | parser | `3001` | Parser listen port |
| `NODE_ENV` | both | `production` | Node environment |
| `PARSER_URL` | web | `http://parser:3001` | Parser base URL (server-side only) |