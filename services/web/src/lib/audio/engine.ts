// Public audio API consumed by Controls.svelte.
//
// Flow when user clicks Play:
//   1. Tone.start()           — resumes AudioContext (required after user gesture)
//   2. buildEffectRack()      — creates filters, compressors, reverb (~instant)
//   3. buildSynthRack(fx)     — creates Tone.Sampler instances, fetches .mp3
//                               samples from CDN, decodes into AudioBuffers.
//                               Resolves when ALL samples are ready.
//                               First call: ~1-3s. Subsequent calls: instant (cache).
//   4. samplesReady = true    — UI can now enable play button / hide spinner
//   5. schedule + start       — normal playback

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
import type { DrumPattern, AtmospherePattern, AtmosphereNodes } from "./scheduler";

export type { DrumPattern, AtmospherePattern };

// ─── State ────────────────────────────────────────────────────────────────────

let synthRack:   SynthRack      | null = null;
let effectRack:  EffectRack     | null = null;
let drumPart:    Tone.Part      | null = null;
let chordPart:   Tone.Part      | null = null;
let bassPart:    Tone.Part      | null = null;
let atmosNodes:  AtmosphereNodes| null = null;
let barCallback: ((bar: number) => void) | null = null;
let barInterval: ReturnType<typeof setInterval> | null = null;
let initialized  = false;

// Exposed to UI — Controls.svelte can show a loading indicator while false
export let samplesReady   = false;
export let samplesLoading = false;

// ─── Init ─────────────────────────────────────────────────────────────────────

export async function initAudio(): Promise<void> {
  if (typeof window === "undefined") return;
  if (initialized) return;

  await Tone.start();

  if (effectRack) disposeEffectRack(effectRack);
  if (synthRack)  disposeSynthRack(synthRack);
  resetEffectState();

  samplesReady   = false;
  samplesLoading = true;

  effectRack = await buildEffectRack();

  // Async: fetches .mp3 samples from CDN and decodes them into AudioBuffers.
  // Tone.loaded() inside buildSynthRack resolves when all samples are decoded.
  synthRack = await buildSynthRack(effectRack);

  samplesReady   = true;
  samplesLoading = false;
  initialized    = true;
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

export function playDrums(pattern: DrumPattern): void {
  if (!synthRack || !effectRack) return;
  resetEffectState();
  applyDrumEffects(synthRack, effectRack, pattern.effects);
  drumPart?.dispose();
  drumPart = scheduleDrums(pattern, synthRack, effectRack);
}

export function clearDrums(): void {
  drumPart?.dispose();
  drumPart = null;
}

export function playChords(progression: string[]): void {
  if (!synthRack) return;
  chordPart?.dispose();
  chordPart = scheduleChords(progression, synthRack);
}

export function clearChords(): void {
  chordPart?.dispose();
  chordPart = null;
}

export function playBass(progression: string[]): void {
  if (!synthRack) return;
  bassPart?.dispose();
  bassPart = scheduleBass(progression, synthRack);
}

export function clearBass(): void {
  bassPart?.dispose();
  bassPart = null;
}

export function clearAtmosphere(): void {
  if (atmosNodes) {
    stopAtmosphere(atmosNodes);
    disposeAtmosphere(atmosNodes);
    atmosNodes = null;
  }
}

export function playAtmosphere(atmos: AtmospherePattern): void {
  if (atmosNodes) {
    stopAtmosphere(atmosNodes);
    disposeAtmosphere(atmosNodes);
  }
  const hasContent = atmos.vinylCrackle > 0 || atmos.rain || atmos.tapeWobble;
  atmosNodes = hasContent ? scheduleAtmosphere(atmos) : null;
}

// ─── Transport ────────────────────────────────────────────────────────────────

export function startPlayback(): void {
  if (typeof window === "undefined") return;

  const parts = { drum: drumPart, chord: chordPart, bass: bassPart, atmosphere: atmosNodes };
  startParts(parts);

  Tone.getTransport().start();

  if (barCallback) {
    barInterval = setInterval(() => {
      const pos = Tone.getTransport().position as string;
      const bar = parseInt(pos.split(":")[0]) + 1;
      barCallback!(bar);
    }, 500);
  }
}

export function stopPlayback(): void {
  if (typeof window === "undefined") return;

  Tone.getTransport().stop();
  Tone.getTransport().cancel();

  drumPart?.stop();
  chordPart?.stop();
  bassPart?.stop();

  if (atmosNodes) stopAtmosphere(atmosNodes);
  if (barInterval) { clearInterval(barInterval); barInterval = null; }
  barCallback?.(0);
}

export function pausePlayback(): void {
  if (typeof window === "undefined") return;
  Tone.getTransport().pause();
  if (atmosNodes) stopAtmosphere(atmosNodes);
  if (barInterval) { clearInterval(barInterval); barInterval = null; }
}

export function setTempo(bpm: number): void {
  if (typeof window === "undefined") return;
  Tone.getTransport().bpm.value = bpm;
}

export function setBarChangeCallback(cb: (bar: number) => void): void {
  barCallback = cb;
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

export function cleanup(): void {
  if (typeof window === "undefined") return;
  stopPlayback();

  const parts = { drum: drumPart, chord: chordPart, bass: bassPart, atmosphere: atmosNodes };
  disposeParts(parts);

  if (synthRack)  disposeSynthRack(synthRack);
  if (effectRack) disposeEffectRack(effectRack);

  drumPart   = null;
  chordPart  = null;
  bassPart   = null;
  atmosNodes = null;
  synthRack  = null;
  effectRack = null;

  samplesReady   = false;
  samplesLoading = false;
  initialized    = false;
}