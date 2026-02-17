import * as Tone from "tone";
import type { SynthRack } from "./effects";

export interface DrumPattern {
  kick: number[];
  snare: number[];
  hihat: {
    count: number;
    type: "closed" | "open" | "mixed";
    feel?: string;
  };
  swing: number;
  effects: string[];
}

export interface ScheduledParts {
  drum: Tone.Part | null;
  chord: Tone.Part | null;
  bass: Tone.Part | null;
}

const CHORD_VOICINGS: Record<string, string[]> = {
  Am7:    ["A3", "C4", "E4", "G4"],
  Fmaj7:  ["F3", "A3", "C4", "E4"],
  Dm7:    ["D3", "F3", "A3", "C4"],
  E7:     ["E3", "G#3", "B3", "D4"],
  Cmaj7:  ["C3", "E3", "G3", "B3"],
  Gmaj7:  ["G3", "B3", "D4", "F#4"],
  Am:     ["A3", "C4", "E4"],
  Dm:     ["D3", "F3", "A3"],
  Em:     ["E3", "G3", "B3"],
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

  type DrumEvent = { time: string; type: "kick" | "snare" | "hihat" };
  const events: DrumEvent[] = [];

  for (const beat of pattern.kick) {
    events.push({
      time: beatsToTransportTime(beat),
      type: "kick",
    });
  }

  for (const beat of pattern.snare) {
    events.push({
      time: beatsToTransportTime(beat),
      type: "snare",
    });
  }

  const hihatInterval = 4 / pattern.hihat.count;
  for (let i = 0; i < pattern.hihat.count; i++) {
    events.push({
      time: beatsToTransportTime(1 + i * hihatInterval),
      type: "hihat",
    });
  }

  const part = new Tone.Part<DrumEvent>((time, event) => {
    if (event.type === "kick") {
      synths.kick.triggerAttackRelease("C1", "8n", time);
    } else if (event.type === "snare") {
      synths.snare.triggerAttackRelease("16n", time, 0.7 + Math.random() * 0.2);
    } else if (event.type === "hihat") {
      synths.hihat.triggerAttackRelease("16n", time, 0.5 + Math.random() * 0.3);
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

export function startParts(parts: ScheduledParts): void {
  parts.drum?.start(0);
  parts.chord?.start(0);
  parts.bass?.start(0);
}

export function disposeParts(parts: ScheduledParts): void {
  parts.drum?.dispose();
  parts.chord?.dispose();
  parts.bass?.dispose();
}

function beatsToTransportTime(beat: number): string {
  const zeroBased = beat - 1;
  const bar = Math.floor(zeroBased / 4);
  const beatInBar = Math.floor(zeroBased % 4);
  const sixteenth = Math.round(((zeroBased % 1) * 4)) ;
  return `${bar}:${beatInBar}:${sixteenth}`;
}