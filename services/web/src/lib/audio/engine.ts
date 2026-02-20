import * as Tone from "tone";
import {
  buildEffectRack,
  buildSynthRack,
  applyDrumEffects,
  resetEffectState,
  disposeEffectRack,
  disposeSynthRack,
} from "./effects";
import {
  scheduleDrums,
  scheduleChords,
  scheduleBass,
  scheduleAtmosphere,
  startAtmosphere,
  stopAtmosphere,
  disposeAtmosphere,
  startParts,
  disposeParts,
} from "./scheduler";
import type { SynthRack, EffectRack } from "./effects";
import type { DrumPattern, AtmospherePattern, ScheduledParts } from "./scheduler";

export type { DrumPattern, AtmospherePattern };

let synths: SynthRack | null = null;
let fx: EffectRack | null = null;
let parts: ScheduledParts = { drum: null, chord: null, bass: null, atmosphere: null };
let barRepeatId: number | null = null;
let barCount = 0;
let onBarChange: ((bar: number) => void) | null = null;
let initialized = false;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export async function initAudio(): Promise<void> {
  if (!isBrowser()) return;
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
  if (!isBrowser()) return;
  await initAudio();
  Tone.getTransport().bpm.value = tempo;

  parts.drum?.dispose();
  parts.drum = null;

  resetEffectState();
  applyDrumEffects(synths!, fx!, pattern.effects);
  parts.drum = scheduleDrums(pattern, synths!);
}

export async function playChords(
  progression: string[],
  _instrument: string,
  tempo: number
): Promise<void> {
  if (!isBrowser()) return;
  await initAudio();
  Tone.getTransport().bpm.value = tempo;

  parts.chord?.dispose();
  parts.chord = null;
  parts.chord = scheduleChords(progression, synths!);
}

export async function playBass(progression: string[], _tempo: number): Promise<void> {
  if (!isBrowser()) return;
  await initAudio();

  parts.bass?.dispose();
  parts.bass = null;
  parts.bass = scheduleBass(progression, synths!);
}

export async function playAtmosphere(atmos: AtmospherePattern): Promise<void> {
  if (!isBrowser()) return;
  await initAudio();

  // Stop and dispose previous atmosphere nodes before building new ones
  if (parts.atmosphere) {
    stopAtmosphere(parts.atmosphere);
    disposeAtmosphere(parts.atmosphere);
    parts.atmosphere = null;
  }

  const hasContent = atmos.vinylCrackle > 0 || atmos.rain || atmos.tapeWobble;
  if (hasContent) {
    // FIX: only build the nodes here — do NOT start them yet.
    // startAtmosphere is called from startPlayback so noise only
    // runs while the transport is running.
    parts.atmosphere = scheduleAtmosphere(atmos);
  }
}

export function startPlayback(): void {
  if (!isBrowser()) return;
  barCount = 0;

  if (barRepeatId !== null) {
    Tone.getTransport().clear(barRepeatId);
    barRepeatId = null;
  }

  barRepeatId = Tone.getTransport().scheduleRepeat(() => {
    barCount++;
    onBarChange?.(barCount);
  }, "1m");

  startParts(parts);
  Tone.getTransport().start();
}

export function stopPlayback(): void {
  if (!isBrowser()) return;
  Tone.getTransport().stop();
  Tone.getTransport().cancel();
  // FIX: explicitly stop atmosphere nodes — they are free-running Tone.Noise
  // instances not tied to the Transport, so Transport.stop() does nothing to them
  if (parts.atmosphere) {
    stopAtmosphere(parts.atmosphere);
  }
  barCount = 0;
  barRepeatId = null;
}

export function pausePlayback(): void {
  if (!isBrowser()) return;
  Tone.getTransport().pause();
  // FIX: pause atmosphere too — noise doesn't pause with the transport
  if (parts.atmosphere) {
    stopAtmosphere(parts.atmosphere);
  }
}

export function setTempo(bpm: number): void {
  if (!isBrowser()) return;
  Tone.getTransport().bpm.value = bpm;
}

export function cleanup(): void {
  if (!isBrowser()) return;
  stopPlayback();
  disposeParts(parts);
  if (synths) disposeSynthRack(synths);
  if (fx) disposeEffectRack(fx);
  parts = { drum: null, chord: null, bass: null, atmosphere: null };
  synths = null;
  fx = null;
  initialized = false;
}