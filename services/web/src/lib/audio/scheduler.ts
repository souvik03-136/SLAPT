// THE CRITICAL FIX IN THIS FILE:
//
//   Tone.Part fires its callback with (time, event) where `time` is already
//   the correct AudioContext lookahead timestamp — a future value in seconds
//   that accounts for the Transport's lookahead buffer.  You pass this
//   directly to BufferSourceNode.start(time).  Do NOT recompute it.
//
//   The previous version tried to recalculate `time` from rawContext.currentTime
//   + baseLatency + Transport.seconds.  That formula is wrong and caused:
//     • Drums firing at the wrong beat positions
//     • Ghost notes after pause (nodes scheduled in the future kept playing
//       because stopPlayback() only paused the Transport, not the raw nodes)
//
//   Now: use `time` as-is for Sampler calls AND for playBuffer calls.
//   stopAllSources() in effects.ts kills every in-flight BufferSourceNode
//   on stop/pause so there are no ghost notes.

import * as Tone from "tone";
import { playBuffer, stopAllSources } from "./effects";
import type { SynthRack, EffectRack } from "./effects";

export interface DrumPattern {
  kick:   number[];
  snare:  number[];
  snareVelocity: { min: number; max: number } | null;
  hihat: {
    count: number;
    type:  "closed" | "open" | "mixed";
    feel?: string;
  };
  hihatOpenBeats?: number[];
  swing:   number;
  effects: string[];
}

export interface AtmospherePattern {
  vinylCrackle: number;
  rain:         boolean;
  tapeWobble:   boolean;
}

export interface ScheduledParts {
  drum:       Tone.Part | null;
  chord:      Tone.Part | null;
  bass:       Tone.Part | null;
  atmosphere: AtmosphereNodes | null;
}

export interface AtmosphereNodes {
  vinylNoise:  Tone.Noise | null;
  vinylFilter: Tone.Filter | null;
  vinylGain:   Tone.Gain | null;
  rainNoise:   Tone.Noise | null;
  rainFilter:  Tone.Filter | null;
  rainGain:    Tone.Gain | null;
  wobbleInterval: ReturnType<typeof setInterval> | null;
  wobbleBpm:   number;
}

// ── Chord / bass data ────────────────────────────────────────────────────────

const CHORD_VOICINGS: Record<string, string[]> = {
  Am7:   ["A3", "C4", "E4", "G4"],
  Fmaj7: ["F3", "A3", "C4", "E4"],
  Dm7:   ["D3", "F3", "A3", "C4"],
  E7:    ["E3", "G#3", "B3", "D4"],
  Cmaj7: ["C3", "E3", "G3", "B3"],
  Gmaj7: ["G3", "B3", "D4", "F#4"],
  Am:    ["A3", "C4", "E4"],
  Dm:    ["D3", "F3", "A3"],
  Em:    ["E3", "G3", "B3"],
};

const BASS_ROOTS: Record<string, string> = {
  Am7: "A1", Fmaj7: "F1", Dm7: "D2",
  E7:  "E2", Cmaj7: "C2", Gmaj7: "G1",
  Am:  "A1", Dm:    "D2", Em:   "E2",
};

// ── Drum scheduler ────────────────────────────────────────────────────────────

export function scheduleDrums(
  pattern: DrumPattern,
  synths:  SynthRack,
  fx:      EffectRack
): Tone.Part {
  Tone.getTransport().swing = pattern.swing / 100;
  Tone.getTransport().swingSubdivision = "8n";

  type DrumEvent = {
    time: string;
    type: "kick" | "snare" | "hihat_closed" | "hihat_open";
  };

  const events: DrumEvent[] = [];

  for (const beat of pattern.kick) {
    events.push({ time: beatToBarTime(beat), type: "kick" });
  }
  for (const beat of pattern.snare) {
    events.push({ time: beatToBarTime(beat), type: "snare" });
  }

  if (pattern.hihat.count > 0) {
    const interval    = 4 / pattern.hihat.count;
    const openBeatSet = new Set(
      (pattern.hihatOpenBeats ?? []).map((b) => Math.round(b * 100))
    );
    for (let i = 0; i < pattern.hihat.count; i++) {
      const beat    = 1 + i * interval;
      const beatKey = Math.round(beat * 100);
      if (!openBeatSet.has(beatKey)) {
        events.push({ time: beatToBarTime(beat), type: "hihat_closed" });
      }
    }
  }
  for (const beat of (pattern.hihatOpenBeats ?? [])) {
    events.push({ time: beatToBarTime(beat), type: "hihat_open" });
  }

  const velMin   = pattern.snareVelocity?.min ?? 0.6;
  const velMax   = pattern.snareVelocity?.max ?? 0.8;
  const velRange = velMax - velMin;

  const part = new Tone.Part<DrumEvent>((time, event) => {
    // `time` is the AudioContext lookahead timestamp provided by Tone.js.
    // Pass it directly — do NOT recalculate it from rawContext.currentTime.
    switch (event.type) {
      case "kick":
        playBuffer(synths.ctx, synths.kickBuf, fx.kickGain, time, 1.0);
        break;

      case "snare":
        playBuffer(
          synths.ctx, synths.snareBuf, fx.snareGain, time,
          velMin + Math.random() * velRange
        );
        break;

      case "hihat_closed":
        playBuffer(
          synths.ctx, synths.hihatClosedBuf, fx.hihatGain, time,
          0.45 + Math.random() * 0.3,
          0.98 + Math.random() * 0.04   // ±2% pitch = human variation
        );
        break;

      case "hihat_open":
        playBuffer(
          synths.ctx, synths.hihatOpenBuf, fx.hihatGain, time,
          0.65 + Math.random() * 0.2
        );
        break;
    }
  }, events);

  part.loop    = true;
  part.loopEnd = "1m";
  return part;
}

// ── Chord scheduler ───────────────────────────────────────────────────────────

export function scheduleChords(progression: string[], synths: SynthRack): Tone.Part {
  const events = progression.map((chord, i) => ({
    time:  `${i}m`,
    notes: CHORD_VOICINGS[chord] ?? ["C4", "E4", "G4"],
  }));

  const part = new Tone.Part((time, event) => {
    for (const note of (event as { notes: string[] }).notes) {
      synths.chords.triggerAttackRelease(note, "2n", time, 0.65);
    }
  }, events);

  part.loop    = true;
  part.loopEnd = `${progression.length}m`;
  return part;
}

// ── Bass scheduler ────────────────────────────────────────────────────────────

export function scheduleBass(progression: string[], synths: SynthRack): Tone.Part {
  const events = progression.map((chord, i) => ({
    time: `${i}m`,
    note: BASS_ROOTS[chord] ?? "C2",
  }));

  const part = new Tone.Part((time, event) => {
    synths.bass.triggerAttackRelease(
      (event as { note: string }).note, "2n", time, 0.8
    );
  }, events);

  part.loop    = true;
  part.loopEnd = `${progression.length}m`;
  return part;
}

// ── Atmosphere ────────────────────────────────────────────────────────────────

export function scheduleAtmosphere(atmos: AtmospherePattern): AtmosphereNodes {
  const nodes: AtmosphereNodes = {
    vinylNoise: null, vinylFilter: null, vinylGain: null,
    rainNoise:  null, rainFilter:  null, rainGain:  null,
    wobbleInterval: null,
    wobbleBpm: Tone.getTransport().bpm.value,
  };

  if (atmos.vinylCrackle > 0) {
    const scaledGain = (atmos.vinylCrackle / 100) * 0.06;

    const rumbleGain   = new Tone.Gain(scaledGain * 0.3).toDestination();
    const rumbleFilter = new Tone.Filter({ frequency: 2200, type: "bandpass", Q: 0.8 }).connect(rumbleGain);
    const rumbleNoise  = new Tone.Noise("brown").connect(rumbleFilter);

    const popGain   = new Tone.Gain(scaledGain * 0.7).toDestination();
    const popFilter = new Tone.Filter({ frequency: 3500, type: "highpass", rolloff: -12 }).connect(popGain);
    const popEnv    = new Tone.AmplitudeEnvelope({ attack: 0.001, decay: 0.04, sustain: 0, release: 0.02 }).connect(popFilter);
    const popNoise  = new Tone.Noise("white").connect(popEnv);
    const popLoop   = new Tone.Loop(() => {
      popEnv.triggerAttackRelease(0.03);
      popLoop.interval = `${0.3 + Math.random() * 2.2}s` as Tone.Unit.Time;
    }, "1s");

    nodes.vinylNoise  = rumbleNoise;
    nodes.vinylFilter = rumbleFilter;
    nodes.vinylGain   = rumbleGain;
    (nodes as any)._popNoise  = popNoise;
    (nodes as any)._popEnv    = popEnv;
    (nodes as any)._popFilter = popFilter;
    (nodes as any)._popGain   = popGain;
    (nodes as any)._popLoop   = popLoop;
  }

  if (atmos.rain) {
    const lowGain    = new Tone.Gain(0.07).toDestination();
    const lowFilter  = new Tone.Filter({ frequency: 200,  type: "lowpass",  rolloff: -48 }).connect(lowGain);
    const lowNoise   = new Tone.Noise("brown").connect(lowFilter);
    const midGain    = new Tone.Gain(0.04).toDestination();
    const midFilter  = new Tone.Filter({ frequency: 700,  type: "bandpass", Q: 0.6 }).connect(midGain);
    const midNoise   = new Tone.Noise("brown").connect(midFilter);
    const highGain   = new Tone.Gain(0.015).toDestination();
    const highFilter = new Tone.Filter({ frequency: 1400, type: "bandpass", Q: 0.4 }).connect(highGain);
    const highNoise  = new Tone.Noise("pink").connect(highFilter);

    nodes.rainNoise  = lowNoise;
    nodes.rainFilter = lowFilter;
    nodes.rainGain   = lowGain;
    (nodes as any)._rainMidNoise   = midNoise;
    (nodes as any)._rainMidFilter  = midFilter;
    (nodes as any)._rainMidGain    = midGain;
    (nodes as any)._rainHighNoise  = highNoise;
    (nodes as any)._rainHighFilter = highFilter;
    (nodes as any)._rainHighGain   = highGain;
  }

  if (atmos.tapeWobble) {
    const baseBpm   = Tone.getTransport().bpm.value;
    nodes.wobbleBpm = baseBpm;
    let phase       = 0;
    const depth     = baseBpm * 0.008;
    const phaseStep = (2 * Math.PI * 0.3) / (1000 / 300);
    nodes.wobbleInterval = setInterval(() => {
      phase += phaseStep;
      Tone.getTransport().bpm.value = baseBpm + Math.sin(phase) * depth;
    }, 300);
  }

  return nodes;
}

export function startAtmosphere(nodes: AtmosphereNodes): void {
  nodes.vinylNoise?.start();
  (nodes as any)._popNoise?.start();
  (nodes as any)._popLoop?.start();
  nodes.rainNoise?.start();
  (nodes as any)._rainMidNoise?.start();
  (nodes as any)._rainHighNoise?.start();
}

export function stopAtmosphere(nodes: AtmosphereNodes): void {
  nodes.vinylNoise?.stop();
  (nodes as any)._popNoise?.stop();
  (nodes as any)._popLoop?.stop();
  nodes.rainNoise?.stop();
  (nodes as any)._rainMidNoise?.stop();
  (nodes as any)._rainHighNoise?.stop();
  if (nodes.wobbleInterval !== null) {
    clearInterval(nodes.wobbleInterval);
    nodes.wobbleInterval = null;
    Tone.getTransport().bpm.value = nodes.wobbleBpm;
  }
}

export function disposeAtmosphere(nodes: AtmosphereNodes): void {
  stopAtmosphere(nodes);
  nodes.vinylNoise?.dispose();
  nodes.vinylFilter?.dispose();
  nodes.vinylGain?.dispose();
  (nodes as any)._popNoise?.dispose();
  (nodes as any)._popEnv?.dispose();
  (nodes as any)._popFilter?.dispose();
  (nodes as any)._popGain?.dispose();
  (nodes as any)._popLoop?.dispose();
  nodes.rainNoise?.dispose();
  nodes.rainFilter?.dispose();
  nodes.rainGain?.dispose();
  (nodes as any)._rainMidNoise?.dispose();
  (nodes as any)._rainMidFilter?.dispose();
  (nodes as any)._rainMidGain?.dispose();
  (nodes as any)._rainHighNoise?.dispose();
  (nodes as any)._rainHighFilter?.dispose();
  (nodes as any)._rainHighGain?.dispose();
}

export function startParts(parts: ScheduledParts): void {
  parts.drum?.start(0);
  parts.chord?.start(0);
  parts.bass?.start(0);
  if (parts.atmosphere) startAtmosphere(parts.atmosphere);
}

export function disposeParts(parts: ScheduledParts): void {
  parts.drum?.dispose();
  parts.chord?.dispose();
  parts.bass?.dispose();
  if (parts.atmosphere) disposeAtmosphere(parts.atmosphere);
}

// ── beatToBarTime ─────────────────────────────────────────────────────────────
//
// Converts a 1-based beat number (may be decimal) to a Tone.js bar:beat:sixteenth
// string, always relative to bar 0.
//
// beat 1.0  → "0:0:0"   (bar 0, beat 0, 16th 0)
// beat 1.5  → "0:0:2"   (bar 0, beat 0, 16th 2  = the "and" of beat 1)
// beat 2.0  → "0:1:0"
// beat 2.75 → "0:1:3"   (bar 0, beat 1, 16th 3 = the "ah" of beat 2)
// beat 3.0  → "0:2:0"
// beat 4.0  → "0:3:0"
//
// This matches exactly what the MIDI exporter does:
//   beatToTick(beat) = Math.round((beat - 1) * PPQN)
// Both treat beat 1 as position 0.

function beatToBarTime(beat: number): string {
  const pos        = beat - 1;                      // make 0-based
  const beatIndex  = Math.floor(pos);               // which beat (0-3)
  const fraction   = pos - beatIndex;               // fractional part
  const sixteenth  = Math.round(fraction * 4);      // 0–3
  return `0:${beatIndex}:${sixteenth}`;
}