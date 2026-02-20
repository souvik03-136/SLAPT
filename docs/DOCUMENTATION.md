# SLAPT Documentation

## Architecture

SLAPT runs as three Docker services orchestrated via `docker-compose.yml`:

```
nginx (:80)
  |-- /api/parse  ->  parser (:3001)   [Node.js + TypeScript + Chevrotain]
  `-- /           ->  web    (:3000)   [SvelteKit + Tone.js + CodeMirror 6]
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
# Terminal 1 - parser
cd services/parser
npm install
npm run dev

# Terminal 2 - web
cd services/web
npm install
npm run dev
```

Web runs on `:3000`, parser on `:3001`.

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
      "context": "kick pattern",
      "suggestions": ["Beats go from 1 to 4 in your current time signature"]
    }
  ],
  "warnings": [
    {
      "code": "TEMPO_GENRE_MISMATCH",
      "message": "180 BPM feels off for lofi-hiphop",
      "suggestions": ["Typical lofi-hiphop range: 60-90 BPM"]
    }
  ],
  "success": true,
  "program": {
    "genre": "lofi-hiphop",
    "tempo": 75,
    "key": "Am",
    "drums": {
      "swing": 60,
      "kick": [1, 2.75, 3],
      "snare": [2, 4],
      "snareVelocity": { "min": 0.7, "max": 0.9 },
      "hihat": { "count": 8, "type": "closed" },
      "effects": ["bitcrush", "compress"]
    },
    "chords": {
      "instrument": "piano",
      "progression": ["Am7", "Fmaj7", "Dm7", "E7"],
      "voicing": "spread",
      "rhythm": "whole",
      "effects": []
    },
    "bass": { "style": "walking", "sound": "mellow", "filter": "warm" },
    "atmosphere": { "vinylCrackle": 20, "rain": true, "tapeWobble": false },
    "modifiers": ["dusty"]
  }
}
```

`success` is `true` when `errors` is empty. Warnings do not affect `success`.

`program` is `null` when there are parse errors. When `success` is `true`, `program` contains the fully extracted track structure ready for the audio engine.

**Health check:** `GET /health` -> `{ "status": "ok", "service": "slapt-parser" }`

---

## Validation Rules

### Tempo/Genre Mismatch

Fires a warning when your `@tempo` is outside the genre's typical range.

| Genre | BPM Range |
|---|---|
| lofi-hiphop | 60-90 |
| boom-bap | 80-100 |
| house | 120-135 |
| techno | 130-150 |
| dnb | 160-180 |
| ambient | 60-90 |
| trap | 130-170 |

### Beat Out of Range

Fires an error when a beat number exceeds the time signature (default 4/4). Beat validation runs against all beat sources:

- `kick on X and Y` — each beat checked individually
- `kick pattern [X, Y, Z]` — every value in the array checked
- `snare on X and Y` — each beat checked individually

```
kick pattern [1, 2.75, 5]
-> Error: BEAT_OUT_OF_RANGE (context: "kick pattern")

snare on 2 and 6
-> Error: BEAT_OUT_OF_RANGE (context: "snare on")
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
- `kick on X and Y` is shorthand for two or more beats: `kick on 1 and 3 and 4` is valid.
- `snare on X and Y` works the same way. If you write no `snare` line, no snare plays.
- `snare velocity random(min to max)` sets the velocity range for every snare hit. Values are `0.0` (silent) to `1.0` (full). If omitted, defaults to `random(0.6 to 0.8)`.
- `hihat N times` divides the bar into N equal hits. If omitted or set to 0, no hihat plays.
- `swing(N%)` shifts every other 8th note by N%.

### Chord Block

```
chords using rhodes piano:
  progression Am7 -> Fmaj7 -> Dm7 -> E7
  voicing spread
  rhythm whole notes with slight anticipation
  reverb(medium, dreamy)
  tremolo(gentle, 4Hz)
```

`->` separates chords in the progression. Each chord occupies one bar.

Built-in chord voicings: `Am7`, `Fmaj7`, `Dm7`, `E7`, `Cmaj7`, `Gmaj7`, `Am`, `Dm`, `Em`.

### Bass Block

```
bass walking the roots:
  follow chord progression
  sound mellow
  filter warm
```

Bass automatically follows the root note of each chord in the progression, one octave below the chord roots.

### Atmosphere Block

```
atmosphere:
  vinyl crackle at 20% volume
  rain sounds softly in background
  tape wobble subtle
```

All three layers are optional and can be used in any combination.

**Vinyl crackle** — two-layer synthesis: a quiet brown noise surface rumble (bandpass ~2200Hz) plus random pop bursts triggered at random intervals between 0.3–2.5 seconds. The percentage controls overall level; useful range is 10–35%.

**Rain** — three-layer brown/pink noise synthesis: low rumble below 200Hz, mid splash bandpass at 700Hz, high sparkle bandpass at 1400Hz. Blends into a natural rain-in-a-room texture at low overall gain.

**Tape wobble** — nudges `Transport.bpm` ±0.8% on a 0.3Hz sine curve, simulating cassette flutter. Inaudible as discrete steps, felt as a subtle pitch drift.

All atmosphere layers start and stop with playback. Nothing plays when the transport is stopped.

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
make it groovy      -> swing 60% minimum, humanization, ghost notes
make it dusty       -> bitcrush on drums, vinyl crackle at 20% minimum, rolled-off highs
add some laziness   -> swing 40% minimum, pushed-back timing
bring energy up     -> increased velocity, fills every 4 bars
```

Modifiers stack. `make it dusty` + `add some laziness` is valid.

**`make it dusty` atmosphere behaviour:** if no `atmosphere` block is written, `make it dusty` creates one automatically with `vinylCrackle: 20`. If an atmosphere block exists with a higher crackle value, the existing value is kept.

---

## Audio Engine

The engine lives in `services/web/src/lib/audio/` and uses Tone.js.

### Synth Routing

```
kickSynth    -> kickCompressor                -> Destination
snareSynth   -> snareFilter -> snareCompressor -> Destination
hihatSynth   ->                                  Destination
chordSynth   -> Tremolo -> Reverb             -> Destination
bassSynth    -> LowpassFilter                 -> Destination

atmosphere:
  vinylRumble  -> Bandpass(2200Hz) -> Gain      -> Destination
  vinylPops    -> Highpass(3500Hz) -> AmplEnv   -> Gain -> Destination
  rainLow      -> Lowpass(200Hz)                -> Gain -> Destination
  rainMid      -> Bandpass(700Hz)               -> Gain -> Destination
  rainHigh     -> Bandpass(1400Hz)              -> Gain -> Destination
```

Kick and snare have **separate** compressors so they never bleed into each other. When bitcrush is applied, each instrument gets its **own** BitCrusher instance.

Atmosphere nodes are free-running (`Tone.Noise`, not transport-scheduled). They start and stop explicitly with playback — `Transport.stop()` alone does not stop them.

### Playback Flow

1. `initAudio()` — creates all synths and effects, must be called after a user gesture
2. `playDrums(pattern, tempo)` — builds a `Tone.Part` for kick/snare/hihat, applies effects
3. `playChords(progression, instrument, tempo)` — builds a `Tone.Part` for chords
4. `playBass(progression, tempo)` — builds a `Tone.Part` for bass roots
5. `playAtmosphere(atmos)` — builds atmosphere nodes (does not start them yet)
6. `startPlayback()` — starts `Tone.Transport` and all parts, calls `startAtmosphere()`
7. `stopPlayback()` — stops transport, cancels scheduled events, calls `stopAtmosphere()`
8. `pausePlayback()` — pauses transport, calls `stopAtmosphere()`
9. `cleanup()` — disposes all Tone nodes, call on component destroy

### Snare Velocity

The `snareVelocity` field from the parsed program is passed directly to the scheduler:

```typescript
// parsed from: snare velocity random(0.7 to 0.9)
snareVelocity: { min: 0.7, max: 0.9 }

// scheduler uses:
const velocity = velMin + Math.random() * (velMax - velMin);
```

If no velocity line is written, defaults to `{ min: 0.6, max: 0.8 }`.

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
| `slaptStore.parseResult` | `ParseResult \| null` | Latest parse response including `program` |
| `slaptStore.playbackState` | `stopped \| playing \| paused` | Transport state |
| `slaptStore.tempo` | `number` | Current BPM |
| `slaptStore.currentBar` | `number` | Bar counter from engine |
| `slaptStore.isLoading` | `boolean` | Parse in flight |

Derived stores: `hasErrors`, `hasWarnings`, `isPlaying`.

### Components

| Component | Responsibility |
|---|---|
| `Editor.svelte` | CodeMirror 6 instance, debounced parse on change |
| `Controls.svelte` | Play/pause/stop, passes exact parsed pattern to engine including `snareVelocity` and `atmosphere` |
| `Timeline.svelte` | 16-step grid — beat labels are absolutely positioned overlays so columns stay equal width |
| `ErrorPanel.svelte` | Renders errors (with `context` field) and warnings with suggestions |

Parse is debounced at **400ms** after the last keystroke.

---

## Environment Variables

| Variable | Service | Default | Description |
|---|---|---|---|
| `NGINX_PORT` | nginx | `80` | Nginx listen port |
| `WEB_PORT` | web | `3000` | Web service port |
| `PARSER_PORT` | parser | `3001` | Parser listen port (also exposed to host for tests) |
| `NODE_ENV` | both | `production` | Node environment |
| `PARSER_URL` | web | `http://parser:3001` | Parser base URL (server-side only) |

All variables live in a single `.env` at the project root. No `.env.local` or per-service env files.