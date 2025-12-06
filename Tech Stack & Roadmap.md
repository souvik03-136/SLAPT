# SLAPT: Tech Stack & Development Roadmap

## Tech Stack

### Core Stack
```
┌─────────────────────────────────────┐
│  Language: TypeScript               │
│  Framework: Svelte + SvelteKit      │
│  Audio Engine: Tone.js              │
│  Parser: Chevrotain                 │
│  Editor: CodeMirror 6               │
│  Build Tool: Vite                   │
└─────────────────────────────────────┘
```

### Why These Choices?

**TypeScript**
- Type safety for complex audio logic
- Better IDE support
- Industry standard

**Svelte + SvelteKit**
- ⚡ Faster than React (compiles to vanilla JS)
- Less boilerplate, cleaner code
- Built-in reactivity perfect for real-time audio
- Better for audio apps (less re-renders)
- Growing ecosystem, modern

**Tone.js**
- Built specifically for music (not just audio)
- Handles timing perfectly (crucial for music)
- Built-in effects, synths, samplers
- Web Audio API wrapper (easier than raw API)
- Active development

**Chevrotain**
- Fast, written in TypeScript
- Better error messages (crucial for UX)
- Easier debugging than ANTLR
- Grammar in code (not external files)

**CodeMirror 6**
- Modern, extensible
- Custom syntax highlighting
- Error underlining
- Autocomplete support

**Vite**
- Instant dev server start
- Fast HMR (hot module replacement)
- Better for audio (less build overhead)
- Modern, industry standard

### Additional Libraries

**State Management**
- Zustand (lightweight, simple)

**Audio Analysis/Visualization**
- Meyda (audio feature extraction)

**Export/Recording**
- Recorder.js or MediaRecorder API

**File Handling**
- Pizzicato (if need more audio effects)
- Soundfont-player (for MIDI sounds)

**UI Components**
- Tailwind CSS (styling)
- Radix UI or shadcn/ui (accessible components)
- Framer Motion (animations)

**Testing**
- Vitest (testing)
- Playwright (E2E)

### Infrastructure

**Hosting:** Vercel or Cloudflare Pages (free tier, fast)
**Database:** Supabase (for user projects/sharing)
**Storage:** Cloudflare R2 (for audio samples)
**Auth:** Clerk or Supabase Auth
**Analytics:** Plausible or Vercel Analytics

---

## Development Roadmap

### 🎯 Phase 0: Foundation (2-3 weeks)
**Goal:** Core engine + basic proof of concept

**Week 1-2: Parser & Audio Engine**
- Set up project with Vite + Svelte + TypeScript
- Build lexer/parser with Chevrotain for basic syntax
- Integrate Tone.js and test basic playback
- Parse simple commands: `play kick on 1`
- Test audio scheduling accuracy

**Week 3: Editor Integration**
- Integrate CodeMirror 6
- Add basic syntax highlighting
- Connect editor to parser
- Show errors in editor
- Basic play/stop controls

**Deliverable:** Can write `play kick on 1` and hear it

---

### 🚀 Phase 1: Lo-fi MVP (4-6 weeks)
**Goal:** Functional lo-fi beat maker with core features

**Week 4-5: Core Language Features**
- Implement drum patterns (kick, snare, hihat)
- Time parsing (beats, bars, subdivisions)
- Basic velocity/volume control
- Pattern repeat/variation
- Structure: sections (intro, verse, etc.)

**Week 6-7: Musical Features**
- Chord progression support
- Bass line generation
- Sample library (10-15 lo-fi sounds)
- Basic effects (reverb, delay, bitcrush)
- Tempo and key settings

**Week 8-9: UX & Error Handling**
- Smart error messages with suggestions
- Audio preview for errors
- Auto-complete basic patterns
- Visual timeline (simple bars display)
- Export to WAV

**Deliverable:** Can create a complete lo-fi beat

---

### 🎨 Phase 2: Enhancement (6-8 weeks)
**Goal:** Polish, expand, make it shareable

**Week 10-12: Advanced Features**
- Melody generator/support
- More sophisticated patterns
- Probability & randomness
- Conditional logic (if/else)
- More effects & processing chains

**Week 13-15: User Experience**
- Better visual timeline (waveforms)
- Preset library (genre templates)
- SLAPT modifiers ("make it groovy")
- Live mode (real-time editing)
- Keyboard shortcuts

**Week 16-17: Sharing & Community**
- User accounts (Supabase)
- Save/load projects
- Share links (project URLs)
- Public gallery
- Fork/remix others' projects

**Deliverable:** Polished product ready for beta users

---

### ⚡ Phase 3: Scale (8-12 weeks)
**Goal:** More genres, advanced features, growth

**Week 18-22: Genre Expansion**
- Electronic/House support
- Ambient/Drone
- Jazz (complex chords)
- Each genre gets:
  - Custom samples
  - Style templates
  - Specific effects
  - Documentation

**Week 23-26: Advanced Features**
- VST/Audio Unit plugin support
- MIDI export
- DAW integration (Ableton Link)
- Mobile app (React Native or PWA)
- AI assist ("make this more interesting")

**Week 27-29: Performance & Scaling**
- Optimize audio engine
- CDN for samples
- Better caching
- Collaborative editing
- API for developers

**Deliverable:** Full-featured platform with multiple genres

---

### 🌟 Phase 4: Ecosystem (Ongoing)
**Goal:** Build a platform and community

**Features:**
- Community sample packs
- Tutorial system
- YouTube integration (share beats)
- Mobile apps
- Desktop app (Electron or Tauri)
- Marketplace for sounds/presets
- Education partnerships (schools/bootcamps)

---

## Alternative Tech Stack Options

### If You Want Mobile-First:
- React Native + Expo
- Same audio engine (Tone.js works in RN)
- Harder but more accessible to Gen-Z

### If You Want Desktop App:
- Tauri (Rust + Web) - lighter than Electron
- Full DAW-like features
- Local file system access

### If You Want Real-time Collaboration:
- Add Yjs or Partykit
- WebRTC for audio sync
- Phase 3 feature