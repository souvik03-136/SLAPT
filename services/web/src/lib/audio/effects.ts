// FILE: slapt-web/src/lib/audio/effects.ts

import * as Tone from "tone";

export interface SynthRack {
  kick: Tone.MembraneSynth;
  snare: Tone.NoiseSynth;
  hihat: Tone.MetalSynth;
  chords: Tone.PolySynth;
  bass: Tone.Synth;
}

export interface EffectRack {
  kickCompressor: Tone.Compressor;
  snareCompressor: Tone.Compressor;
  reverb: Tone.Reverb;
  kickBitcrusher: Tone.BitCrusher;
  snareBitcrusher: Tone.BitCrusher;
  tremolo: Tone.Tremolo;
  snareFilter: Tone.Filter;

  // Bass signal chain — 4-stage instead of a single lowpass
  bassHpFilter: Tone.Filter;       // highpass: cuts sub-boom below 60Hz
  bassLpFilter: Tone.Filter;       // lowpass: rolls off harshness above 900Hz
  bassMidEq: Tone.EQ3;             // small mid boost for note definition
  bassCompressor: Tone.Compressor; // gentle evening-out, lets transient through
}

export async function buildEffectRack(): Promise<EffectRack> {
  if (typeof window === "undefined") throw new Error("buildEffectRack called server-side");

  const kickCompressor  = new Tone.Compressor({ threshold: -20, ratio: 4 });
  const snareCompressor = new Tone.Compressor({ threshold: -18, ratio: 3 });
  const reverb          = new Tone.Reverb({ decay: 2.5, wet: 0.4 });
  const kickBitcrusher  = new Tone.BitCrusher(8);
  const snareBitcrusher = new Tone.BitCrusher(8);
  const tremolo         = new Tone.Tremolo({ frequency: 4, depth: 0.3 }).start();
  const snareFilter     = new Tone.Filter({ frequency: 800, type: "lowpass" });

  // ── Bass chain ──────────────────────────────────────────────────────────
  // Stage 1: Remove sub-boom — below 60Hz on laptop/phone speakers is mud
  const bassHpFilter = new Tone.Filter({
    frequency: 60,
    type: "highpass",
    rolloff: -12,
  });

  // Stage 2: Tame harshness — 900Hz keeps the note body intact
  // (the old 600Hz was cutting so much it left only a boomy thud)
  const bassLpFilter = new Tone.Filter({
    frequency: 900,
    type: "lowpass",
    rolloff: -12,
  });

  // Stage 3: Presence boost around 700Hz so individual notes cut through
  // without adding brightness. +3dB mid, -4dB hi-shelf.
  const bassMidEq = new Tone.EQ3({
    low: 0,
    mid: 3,
    high: -4,
    lowFrequency: 250,
    highFrequency: 2000,
  });

  // Stage 4: Gentle compressor — lets the pluck transient through (slow attack),
  // then evens out note-to-note volume differences (medium release)
  const bassCompressor = new Tone.Compressor({
    threshold: -16,
    ratio: 3,
    attack: 0.02,
    release: 0.2,
    knee: 6,
  });

  await reverb.generate();

  return {
    kickCompressor,
    snareCompressor,
    reverb,
    kickBitcrusher,
    snareBitcrusher,
    tremolo,
    snareFilter,
    bassHpFilter,
    bassLpFilter,
    bassMidEq,
    bassCompressor,
  };
}

export function buildSynthRack(fx: EffectRack): SynthRack {
  // ── Kick ────────────────────────────────────────────────────────────────
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.06,
    octaves: 8,
    envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
  }).chain(fx.kickCompressor, Tone.getDestination());

  // ── Snare ───────────────────────────────────────────────────────────────
  const snare = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.01 },
  }).chain(fx.snareFilter, fx.snareCompressor, Tone.getDestination());

  // ── Hihat ───────────────────────────────────────────────────────────────
  const hihat = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
  }).toDestination();
  hihat.frequency.value = 400;
  hihat.volume.value = -10;

  // ── Chords ──────────────────────────────────────────────────────────────
  const chords = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.05, decay: 0.3, sustain: 0.6, release: 1.2 },
    volume: -8,
  }).chain(fx.tremolo, fx.reverb, Tone.getDestination());

  // ── Bass ─────────────────────────────────────────────────────────────────
  //
  // Why triangle instead of sawtooth:
  //   Sawtooth has strong odd + even harmonics all the way up — it buzzes.
  //   Triangle has only odd harmonics that fall off fast (1/n²) — it's warm
  //   and round, much closer to a fingered electric bass or upright.
  //
  // Why portamento 0.04:
  //   40ms slide between notes removes the hard click of instant pitch jumps.
  //   You don't hear it as a slide — you just stop hearing "MIDI bass".
  //
  // Why volume -12 instead of -6:
  //   Triangle oscillators have strong fundamentals. At -6 the root note
  //   was overpowering everything at low frequencies. We pull the level back
  //   and let the EQ chain bring the right frequencies forward instead.
  //
  // Envelope:
  //   attack 0.04  = finger-pluck softness (was 0.02 = too click-y)
  //   decay 0.25   = note falls off naturally after the pluck
  //   sustain 0.6  = enough sustain that the note doesn't die before next beat
  //   release 0.3  = short enough to not blur chord changes
  //
  const bass = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: {
      attack:  0.04,
      decay:   0.25,
      sustain: 0.6,
      release: 0.3,
    },
    portamento: 0.04,
    volume: -12,
  }).chain(
    fx.bassHpFilter,   // 60Hz highpass — kills mud
    fx.bassLpFilter,   // 900Hz lowpass — kills buzz
    fx.bassMidEq,      // +3dB mid presence, -4dB hi-shelf
    fx.bassCompressor, // gentle even-out, transient allowed through
    Tone.getDestination()
  );

  return { kick, snare, hihat, chords, bass };
}

// ── Drum effects (bitcrush) ─────────────────────────────────────────────────

let bitcrushApplied = false;

export function resetEffectState(): void {
  bitcrushApplied = false;
}

export function applyDrumEffects(synths: SynthRack, fx: EffectRack, effects: string[]): void {
  if (effects.includes("bitcrush") && !bitcrushApplied) {
    bitcrushApplied = true;

    // Kick gets its own bitcrusher — no bleed from snare
    synths.kick.disconnect();
    synths.kick.chain(fx.kickBitcrusher, fx.kickCompressor, Tone.getDestination());

    // Snare gets its own bitcrusher — completely separate chain
    synths.snare.disconnect();
    synths.snare.chain(fx.snareBitcrusher, fx.snareFilter, fx.snareCompressor, Tone.getDestination());
  }
}

// ── Disposal ────────────────────────────────────────────────────────────────

export function disposeEffectRack(fx: EffectRack): void {
  fx.kickCompressor.dispose();
  fx.snareCompressor.dispose();
  fx.reverb.dispose();
  fx.kickBitcrusher.dispose();
  fx.snareBitcrusher.dispose();
  fx.tremolo.dispose();
  fx.snareFilter.dispose();
  fx.bassHpFilter.dispose();
  fx.bassLpFilter.dispose();
  fx.bassMidEq.dispose();
  fx.bassCompressor.dispose();
  bitcrushApplied = false;
}

export function disposeSynthRack(synths: SynthRack): void {
  synths.kick.dispose();
  synths.snare.dispose();
  synths.hihat.dispose();
  synths.chords.dispose();
  synths.bass.dispose();
}