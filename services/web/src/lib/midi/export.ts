// Pure-TypeScript MIDI file builder.
// No dependencies — generates a standard MIDI type-1 file (multi-track)
// with separate tracks for: drums (ch 10), chords (ch 1), bass (ch 2).
//
// General MIDI drum map used:
//   Kick  = 36 (Bass Drum 1)
//   Snare = 38 (Acoustic Snare)
//   Hihat closed = 42
//   Hihat open   = 46

import type { SlaptProgram } from "../../types/slapt";

// ─── MIDI primitives ────────────────────────────────────────────────────────

function varLen(value: number): number[] {
  const bytes: number[] = [];
  bytes.unshift(value & 0x7f);
  value >>= 7;
  while (value > 0) {
    bytes.unshift((value & 0x7f) | 0x80);
    value >>= 7;
  }
  return bytes;
}

function uint16BE(v: number): number[] {
  return [(v >> 8) & 0xff, v & 0xff];
}

function uint32BE(v: number): number[] {
  return [(v >> 24) & 0xff, (v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff];
}

function str(s: string): number[] {
  return Array.from(s).map((c) => c.charCodeAt(0));
}

// ─── Track builder ──────────────────────────────────────────────────────────

interface MidiEvent {
  tick: number;
  data: number[];
}

function buildTrack(events: MidiEvent[], name?: string): number[] {
  // Sort by tick
  events.sort((a, b) => a.tick - b.tick);

  const msgs: number[] = [];

  // Track name meta event
  if (name) {
    const nameBytes = str(name);
    msgs.push(...varLen(0), 0xff, 0x03, ...varLen(nameBytes.length), ...nameBytes);
  }

  let prevTick = 0;
  for (const ev of events) {
    const delta = ev.tick - prevTick;
    prevTick = ev.tick;
    msgs.push(...varLen(delta), ...ev.data);
  }

  // End of track
  msgs.push(0x00, 0xff, 0x2f, 0x00);

  // MTrk header
  return [
    ...str("MTrk"),
    ...uint32BE(msgs.length),
    ...msgs,
  ];
}

// ─── Beat → tick conversion ─────────────────────────────────────────────────
// PPQN (pulses per quarter note) = 480

const PPQN = 480;

function beatToTick(beat: number): number {
  // beat is 1-based (1.0 = tick 0, 2.0 = tick 480, etc.)
  return Math.round((beat - 1) * PPQN);
}

// For progressions: each chord = 1 bar = timeSig beats
function barToTick(bar: number, timeSig: number): number {
  return bar * timeSig * PPQN;
}

// ─── GM chord voicings (same as scheduler.ts) ───────────────────────────────

const CHORD_MIDI: Record<string, number[]> = {
  Am7:   [57, 60, 64, 67],
  Fmaj7: [53, 57, 60, 64],
  Dm7:   [50, 53, 57, 60],
  E7:    [52, 56, 59, 62],
  Cmaj7: [48, 52, 55, 59],
  Gmaj7: [55, 59, 62, 66],
  Am:    [57, 60, 64],
  Dm:    [50, 53, 57],
  Em:    [52, 55, 59],
};

const BASS_ROOTS: Record<string, number> = {
  Am7:   33,  // A1
  Fmaj7: 29,  // F1
  Dm7:   38,  // D2
  E7:    40,  // E2
  Cmaj7: 36,  // C2
  Gmaj7: 31,  // G1
  Am:    33,
  Dm:    38,
  Em:    40,
};

// GM drum notes
const KICK  = 36;
const SNARE = 38;
const HIHAT_CLOSED = 42;
const HIHAT_OPEN   = 46;

// ─── Main export function ───────────────────────────────────────────────────

export function exportMidi(program: SlaptProgram, bars = 4): Uint8Array {
  const tempo    = program.tempo ?? 75;
  const timeSig  = program.timeSig?.numerator ?? 4;
  const drums    = program.drums;
  const chords   = program.chords;
  const bass     = program.bass;

  // µs per beat
  const uspb = Math.round(60_000_000 / tempo);

  // ─── Header track (track 0) ─────────────────────────────────────────────
  const headerEvents: MidiEvent[] = [];

  // Set tempo meta event at tick 0
  headerEvents.push({
    tick: 0,
    data: [
      0xff, 0x51, 0x03,
      (uspb >> 16) & 0xff,
      (uspb >> 8)  & 0xff,
       uspb        & 0xff,
    ],
  });

  // Time signature meta event
  headerEvents.push({
    tick: 0,
    data: [0xff, 0x58, 0x04, timeSig, 2, 24, 8],
    // denominator 2 = quarter note (2^2=4), 24 MIDI clocks/beat, 8 32nds/quarter
  });

  const headerTrack = buildTrack(headerEvents, "SLAPT");

  const tracks: number[][] = [headerTrack];

  // ─── Drum track (channel 10 = 0x09) ────────────────────────────────────
  if (drums) {
    const drumEvents: MidiEvent[] = [];
    const NOTE_ON  = 0x99; // ch 10
    const NOTE_OFF = 0x89;
    const durTicks = Math.round(PPQN / 4); // 16th note gate

    for (let bar = 0; bar < bars; bar++) {
      const barOffset = barToTick(bar, timeSig);

      // Kick
      for (const beat of drums.kick) {
        const t = barOffset + beatToTick(beat);
        drumEvents.push({ tick: t,           data: [NOTE_ON,  KICK, 100] });
        drumEvents.push({ tick: t + durTicks, data: [NOTE_OFF, KICK, 0]   });
      }

      // Snare
      const velMin = Math.round((drums.snareVelocity?.min ?? 0.7) * 127);
      const velMax = Math.round((drums.snareVelocity?.max ?? 0.9) * 127);
      for (const beat of drums.snare) {
        const vel = velMin + Math.floor(Math.random() * (velMax - velMin + 1));
        const t = barOffset + beatToTick(beat);
        drumEvents.push({ tick: t,           data: [NOTE_ON,  SNARE, vel] });
        drumEvents.push({ tick: t + durTicks, data: [NOTE_OFF, SNARE, 0]  });
      }

      // Hihat closed - evenly distributed
      if (drums.hihat.count > 0) {
        const interval = timeSig / drums.hihat.count;
        for (let i = 0; i < drums.hihat.count; i++) {
          const beat = 1 + i * interval;
          const t = barOffset + beatToTick(beat);
          drumEvents.push({ tick: t,           data: [NOTE_ON,  HIHAT_CLOSED, 70] });
          drumEvents.push({ tick: t + durTicks, data: [NOTE_OFF, HIHAT_CLOSED, 0]  });
        }
      }

      // Hihat open on specific beats
      for (const beat of (drums.hihatOpenBeats ?? [])) {
        const t = barOffset + beatToTick(beat);
        drumEvents.push({ tick: t,                data: [NOTE_ON,  HIHAT_OPEN, 90] });
        drumEvents.push({ tick: t + PPQN / 2,     data: [NOTE_OFF, HIHAT_OPEN, 0]  });
      }
    }

    tracks.push(buildTrack(drumEvents, "Drums"));
  }

  // ─── Chord track (channel 1 = 0x00) ────────────────────────────────────
  if (chords && chords.progression.length > 0) {
    const chordEvents: MidiEvent[] = [];
    const NOTE_ON  = 0x90; // ch 1
    const NOTE_OFF = 0x80;

    const prog = chords.progression;
    const totalBars = prog.length;

    for (let rep = 0; rep < Math.ceil(bars / totalBars); rep++) {
      for (let ci = 0; ci < prog.length; ci++) {
        const globalBar = rep * totalBars + ci;
        if (globalBar >= bars) break;

        const t    = barToTick(globalBar, timeSig);
        const tEnd = barToTick(globalBar + 1, timeSig) - 10;
        const notes = CHORD_MIDI[prog[ci]] ?? [60, 64, 67];

        for (const note of notes) {
          chordEvents.push({ tick: t,    data: [NOTE_ON,  note, 70] });
          chordEvents.push({ tick: tEnd, data: [NOTE_OFF, note, 0]  });
        }
      }
    }

    tracks.push(buildTrack(chordEvents, "Chords"));
  }

  // ─── Bass track (channel 2 = 0x01) ─────────────────────────────────────
  if (bass && chords && chords.progression.length > 0) {
    const bassEvents: MidiEvent[] = [];
    const NOTE_ON  = 0x91; // ch 2
    const NOTE_OFF = 0x81;

    const prog = chords.progression;
    const totalBars = prog.length;

    for (let rep = 0; rep < Math.ceil(bars / totalBars); rep++) {
      for (let ci = 0; ci < prog.length; ci++) {
        const globalBar = rep * totalBars + ci;
        if (globalBar >= bars) break;

        const t    = barToTick(globalBar, timeSig);
        const tEnd = barToTick(globalBar + 1, timeSig) - 10;
        const note = BASS_ROOTS[prog[ci]] ?? 36;

        bassEvents.push({ tick: t,    data: [NOTE_ON,  note, 90] });
        bassEvents.push({ tick: tEnd, data: [NOTE_OFF, note, 0]  });
      }
    }

    tracks.push(buildTrack(bassEvents, "Bass"));
  }

  // ─── Assemble MIDI file ─────────────────────────────────────────────────
  const numTracks = tracks.length;

  // MThd header: format 1, N tracks, PPQN
  const header: number[] = [
    ...str("MThd"),
    ...uint32BE(6),       // header chunk length always 6
    ...uint16BE(1),       // format type 1 (multi-track)
    ...uint16BE(numTracks),
    ...uint16BE(PPQN),
  ];

  const allBytes: number[] = [...header];
  for (const track of tracks) allBytes.push(...track);

  return new Uint8Array(allBytes);
}

export function downloadMidi(program: SlaptProgram, filename = "slapt-track.mid"): void {
  const bytes = exportMidi(program, 4);
  const blob  = new Blob([bytes.buffer as ArrayBuffer], { type: "audio/midi" });
  const url   = URL.createObjectURL(blob);
  const a     = document.createElement("a");
  a.href      = url;
  a.download  = filename;
  a.click();
  URL.revokeObjectURL(url);
}