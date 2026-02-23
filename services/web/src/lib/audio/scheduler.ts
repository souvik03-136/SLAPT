import * as Tone from "tone";
import type { SynthRack } from "./effects";

export interface DrumPattern {
  kick: number[];
  snare: number[];
  snareVelocity: { min: number; max: number } | null;
  hihat: {
    count: number;
    type: "closed" | "open" | "mixed";
    feel?: string;
  };
  // New: specific beat positions for open hihat
  hihatOpenBeats?: number[];
  swing: number;
  effects: string[];
}

export interface AtmospherePattern {
  vinylCrackle: number;
  rain: boolean;
  tapeWobble: boolean;
}

export interface ScheduledParts {
  drum: Tone.Part | null;
  chord: Tone.Part | null;
  bass: Tone.Part | null;
  atmosphere: AtmosphereNodes | null;
}

export interface AtmosphereNodes {
  vinylNoise: Tone.Noise | null;
  vinylFilter: Tone.Filter | null;
  vinylGain: Tone.Gain | null;
  rainNoise: Tone.Noise | null;
  rainFilter: Tone.Filter | null;
  rainGain: Tone.Gain | null;
  wobbleInterval: ReturnType<typeof setInterval> | null;
  wobbleBpm: number;
}

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
  Am7:   "A1",
  Fmaj7: "F1",
  Dm7:   "D2",
  E7:    "E2",
  Cmaj7: "C2",
  Gmaj7: "G1",
  Am:    "A1",
  Dm:    "D2",
  Em:    "E2",
};

export function scheduleDrums(pattern: DrumPattern, synths: SynthRack): Tone.Part {
  Tone.getTransport().swing = pattern.swing / 100;
  Tone.getTransport().swingSubdivision = "8n";

  type DrumEvent = { time: string; type: "kick" | "snare" | "hihat_closed" | "hihat_open" };
  const events: DrumEvent[] = [];

  for (const beat of pattern.kick) {
    events.push({ time: beatsToTransportTime(beat), type: "kick" });
  }

  for (const beat of pattern.snare) {
    events.push({ time: beatsToTransportTime(beat), type: "snare" });
  }

  // Regular closed hihat grid
  if (pattern.hihat.count > 0) {
    const hihatInterval = 4 / pattern.hihat.count;
    // Build a set of open hihat beat positions for easy lookup
    const openBeatSet = new Set((pattern.hihatOpenBeats ?? []).map(
      (b) => Math.round(b * 100)  // multiply to avoid float comparison issues
    ));

    for (let i = 0; i < pattern.hihat.count; i++) {
      const beat = 1 + i * hihatInterval;
      const beatKey = Math.round(beat * 100);
      // If this grid position coincides with an open hihat beat, skip closed hit
      if (!openBeatSet.has(beatKey)) {
        events.push({
          time: beatsToTransportTime(beat),
          type: "hihat_closed",
        });
      }
    }
  }

  // Open hihat on specific beats
  for (const beat of (pattern.hihatOpenBeats ?? [])) {
    events.push({ time: beatsToTransportTime(beat), type: "hihat_open" });
  }

  const velMin   = pattern.snareVelocity?.min ?? 0.6;
  const velMax   = pattern.snareVelocity?.max ?? 0.8;
  const velRange = velMax - velMin;

  const part = new Tone.Part<DrumEvent>((time, event) => {
    if (event.type === "kick") {
      synths.kick.triggerAttackRelease("C1", "8n", time);
    } else if (event.type === "snare") {
      const velocity = velMin + Math.random() * velRange;
      synths.snare.triggerAttackRelease("16n", time, velocity);
    } else if (event.type === "hihat_closed") {
      synths.hihat.triggerAttackRelease("16n", time, 0.5 + Math.random() * 0.3);
    } else if (event.type === "hihat_open") {
      // Open hihat: longer decay, higher pitch
      synths.hihat.triggerAttackRelease("8n", time, 0.7 + Math.random() * 0.2);
    }
  }, events);

  part.loop = true;
  part.loopEnd = "1m";
  return part;
}

export function scheduleChords(progression: string[], synths: SynthRack): Tone.Part {
  const events = progression.map((chord, i) => ({
    time: `${i}m`,
    notes: CHORD_VOICINGS[chord] ?? ["C4", "E4", "G4"],
  }));

  const part = new Tone.Part((time, event) => {
    synths.chords.triggerAttackRelease(
      (event as { notes: string[] }).notes,
      "2n",
      time,
      0.6
    );
  }, events);

  part.loop = true;
  part.loopEnd = `${progression.length}m`;
  return part;
}

export function scheduleBass(progression: string[], synths: SynthRack): Tone.Part {
  const events = progression.map((chord, i) => ({
    time: `${i}m`,
    note: BASS_ROOTS[chord] ?? "C2",
  }));

  const part = new Tone.Part((time, event) => {
    synths.bass.triggerAttackRelease(
      (event as { note: string }).note,
      "2n",
      time,
      0.8
    );
  }, events);

  part.loop = true;
  part.loopEnd = `${progression.length}m`;
  return part;
}

export function scheduleAtmosphere(atmos: AtmospherePattern): AtmosphereNodes {
  const nodes: AtmosphereNodes = {
    vinylNoise: null,
    vinylFilter: null,
    vinylGain: null,
    rainNoise: null,
    rainFilter: null,
    rainGain: null,
    wobbleInterval: null,
    wobbleBpm: Tone.getTransport().bpm.value,
  };

  // ── Vinyl crackle ───────────────────────────────────────────────────────
  if (atmos.vinylCrackle > 0) {
    const scaledGain = (atmos.vinylCrackle / 100) * 0.06;

    const rumbleGain = new Tone.Gain(scaledGain * 0.3).toDestination();
    const rumbleFilter = new Tone.Filter({
      frequency: 2200,
      type: "bandpass",
      Q: 0.8,
    }).connect(rumbleGain);
    const rumbleNoise = new Tone.Noise("brown").connect(rumbleFilter);

    const popGain = new Tone.Gain(scaledGain * 0.7).toDestination();
    const popFilter = new Tone.Filter({
      frequency: 3500,
      type: "highpass",
      rolloff: -12,
    }).connect(popGain);
    const popEnv = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay:  0.04,
      sustain: 0,
      release: 0.02,
    }).connect(popFilter);
    const popNoise = new Tone.Noise("white").connect(popEnv);

    const popLoop = new Tone.Loop(() => {
      popEnv.triggerAttackRelease(0.03);
      popLoop.interval = `${0.3 + Math.random() * 2.2}s` as Tone.Unit.Time;
    }, "1s");

    nodes.vinylNoise   = rumbleNoise;
    nodes.vinylFilter  = rumbleFilter;
    nodes.vinylGain    = rumbleGain;
    (nodes as any)._popNoise  = popNoise;
    (nodes as any)._popEnv    = popEnv;
    (nodes as any)._popFilter = popFilter;
    (nodes as any)._popGain   = popGain;
    (nodes as any)._popLoop   = popLoop;
  }

  // ── Rain ────────────────────────────────────────────────────────────────
  if (atmos.rain) {
    const lowGain = new Tone.Gain(0.07).toDestination();
    const lowFilter = new Tone.Filter({ frequency: 200, type: "lowpass", rolloff: -48 }).connect(lowGain);
    const lowNoise = new Tone.Noise("brown").connect(lowFilter);

    const midGain = new Tone.Gain(0.04).toDestination();
    const midFilter = new Tone.Filter({ frequency: 700, type: "bandpass", Q: 0.6 }).connect(midGain);
    const midNoise = new Tone.Noise("brown").connect(midFilter);

    const highGain = new Tone.Gain(0.015).toDestination();
    const highFilter = new Tone.Filter({ frequency: 1400, type: "bandpass", Q: 0.4 }).connect(highGain);
    const highNoise = new Tone.Noise("pink").connect(highFilter);

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

  // ── Tape wobble ─────────────────────────────────────────────────────────
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
  const popNoise = (nodes as any)._popNoise as Tone.Noise | undefined;
  const popLoop  = (nodes as any)._popLoop  as Tone.Loop  | undefined;
  popNoise?.start();
  popLoop?.start();

  nodes.rainNoise?.start();
  const mid  = (nodes as any)._rainMidNoise  as Tone.Noise | undefined;
  const high = (nodes as any)._rainHighNoise as Tone.Noise | undefined;
  mid?.start();
  high?.start();
}

export function stopAtmosphere(nodes: AtmosphereNodes): void {
  nodes.vinylNoise?.stop();
  const popNoise = (nodes as any)._popNoise as Tone.Noise | undefined;
  const popLoop  = (nodes as any)._popLoop  as Tone.Loop  | undefined;
  popNoise?.stop();
  popLoop?.stop();

  nodes.rainNoise?.stop();
  const mid  = (nodes as any)._rainMidNoise  as Tone.Noise | undefined;
  const high = (nodes as any)._rainHighNoise as Tone.Noise | undefined;
  mid?.stop();
  high?.stop();

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
  const popNoise  = (nodes as any)._popNoise  as Tone.Noise             | undefined;
  const popEnv    = (nodes as any)._popEnv    as Tone.AmplitudeEnvelope | undefined;
  const popFilter = (nodes as any)._popFilter as Tone.Filter            | undefined;
  const popGain   = (nodes as any)._popGain   as Tone.Gain              | undefined;
  const popLoop   = (nodes as any)._popLoop   as Tone.Loop              | undefined;
  popNoise?.dispose();
  popEnv?.dispose();
  popFilter?.dispose();
  popGain?.dispose();
  popLoop?.dispose();

  nodes.rainNoise?.dispose();
  nodes.rainFilter?.dispose();
  nodes.rainGain?.dispose();
  const midNoise   = (nodes as any)._rainMidNoise   as Tone.Noise  | undefined;
  const midFilter  = (nodes as any)._rainMidFilter  as Tone.Filter | undefined;
  const midGain    = (nodes as any)._rainMidGain    as Tone.Gain   | undefined;
  const highNoise  = (nodes as any)._rainHighNoise  as Tone.Noise  | undefined;
  const highFilter = (nodes as any)._rainHighFilter as Tone.Filter | undefined;
  const highGain   = (nodes as any)._rainHighGain   as Tone.Gain   | undefined;
  midNoise?.dispose();
  midFilter?.dispose();
  midGain?.dispose();
  highNoise?.dispose();
  highFilter?.dispose();
  highGain?.dispose();
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

function beatsToTransportTime(beat: number): string {
  const zeroBased  = beat - 1;
  const bar        = Math.floor(zeroBased / 4);
  const beatInBar  = Math.floor(zeroBased % 4);
  const sixteenth  = Math.round((zeroBased % 1) * 4);
  return `${bar}:${beatInBar}:${sixteenth}`;
}