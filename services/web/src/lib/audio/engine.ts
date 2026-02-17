import * as Tone from "tone";
import {
  buildEffectRack,
  buildSynthRack,
  applyDrumEffects,
  disposeEffectRack,
  disposeSynthRack,
} from "./effects";
import {
  scheduleDrums,
  scheduleChords,
  scheduleBass,
  startParts,
  disposeParts,
} from "./scheduler";
import type { SynthRack, EffectRack } from "./effects";
import type { DrumPattern, ScheduledParts } from "./scheduler";

export type { DrumPattern };

let synths: SynthRack | null = null;
let fx: EffectRack | null = null;
let parts: ScheduledParts = { drum: null, chord: null, bass: null };
let barRepeatId: number | null = null;
let barCount = 0;
let onBarChange: ((bar: number) => void) | null = null;
let initialized = false;

export async function initAudio(): Promise<void> {
  if (initialized) return;
  await Tone.start();
  fx = await buildEffectRack();
  synths = buildSynthRack(fx);
  initialized = true;
}

export function setBarChangeCallback(cb: (bar: number) => void): void {
  onBarChange = cb;
}

export async function playDrums(pattern: DrumPattern, tempo: number): Promise<void> {
  await initAudio();
  Tone.getTransport().bpm.value = tempo;

  parts.drum?.dispose();

  applyDrumEffects(synths!, fx!, pattern.effects);
  parts.drum = scheduleDrums(pattern, synths!);
}

export async function playChords(
  progression: string[],
  _instrument: string,
  tempo: number
): Promise<void> {
  await initAudio();
  Tone.getTransport().bpm.value = tempo;

  parts.chord?.dispose();
  parts.chord = scheduleChords(progression, synths!);
}

export async function playBass(progression: string[], _tempo: number): Promise<void> {
  await initAudio();

  parts.bass?.dispose();
  parts.bass = scheduleBass(progression, synths!);
}

export function startPlayback(): void {
  barCount = 0;

  if (barRepeatId !== null) {
    Tone.getTransport().clear(barRepeatId);
  }

  barRepeatId = Tone.getTransport().scheduleRepeat(() => {
    barCount++;
    onBarChange?.(barCount);
  }, "1m");

  startParts(parts);
  Tone.getTransport().start();
}

export function stopPlayback(): void {
  Tone.getTransport().stop();
  Tone.getTransport().cancel();
  barCount = 0;
  barRepeatId = null;
}

export function pausePlayback(): void {
  Tone.getTransport().pause();
}

export function setTempo(bpm: number): void {
  Tone.getTransport().bpm.value = bpm;
}

export function cleanup(): void {
  stopPlayback();
  disposeParts(parts);
  if (synths) disposeSynthRack(synths);
  if (fx) disposeEffectRack(fx);
  parts = { drum: null, chord: null, bass: null };
  synths = null;
  fx = null;
  initialized = false;
}