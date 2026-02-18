import * as Tone from "tone";

export interface SynthRack {
  kick: Tone.MembraneSynth;
  snare: Tone.NoiseSynth;
  hihat: Tone.MetalSynth;
  chords: Tone.PolySynth;
  bass: Tone.Synth;
}

export interface EffectRack {
  kickCompressor: Tone.Compressor;   // FIX: separate compressor for kick
  snareCompressor: Tone.Compressor;  // FIX: separate compressor for snare
  reverb: Tone.Reverb;
  kickBitcrusher: Tone.BitCrusher;   // FIX: separate bitcrusher for kick
  snareBitcrusher: Tone.BitCrusher;  // FIX: separate bitcrusher for snare
  tremolo: Tone.Tremolo;
  snareFilter: Tone.Filter;
  bassFilter: Tone.Filter;
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
  const bassFilter      = new Tone.Filter({ frequency: 600, type: "lowpass" });

  await reverb.generate();

  return {
    kickCompressor,
    snareCompressor,
    reverb,
    kickBitcrusher,
    snareBitcrusher,
    tremolo,
    snareFilter,
    bassFilter,
  };
}

export function buildSynthRack(fx: EffectRack): SynthRack {
  // FIX: kick -> its own compressor only, no shared path with snare
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.06,
    octaves: 8,
    envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
  }).chain(fx.kickCompressor, Tone.getDestination());

  // FIX: snare -> snareFilter -> its own snareCompressor, completely isolated from kick
  // NoiseSynth envelope sustain=0 ensures noise is fully gated between hits
  const snare = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.01 }, // FIX: release 0.05->0.01, tighter gate
  }).chain(fx.snareFilter, fx.snareCompressor, Tone.getDestination());

  const hihat = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
  }).toDestination();
  hihat.frequency.value = 400;
  hihat.volume.value = -10;

  const chords = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.05, decay: 0.3, sustain: 0.6, release: 1.2 },
    volume: -8,
  }).chain(fx.tremolo, fx.reverb, Tone.getDestination());

  const bass = new Tone.Synth({
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.02, decay: 0.2, sustain: 0.8, release: 0.5 },
    volume: -6,
  }).chain(fx.bassFilter, Tone.getDestination());

  return { kick, snare, hihat, chords, bass };
}

// FIX: track whether bitcrush routing has been applied so we never double-chain
let bitcrushApplied = false;

export function resetEffectState(): void {
  bitcrushApplied = false;
}

export function applyDrumEffects(synths: SynthRack, fx: EffectRack, effects: string[]): void {
  if (effects.includes("bitcrush") && !bitcrushApplied) {
    bitcrushApplied = true;

    // FIX: kick gets its OWN bitcrusher instance, no bleed from snare
    synths.kick.disconnect();
    synths.kick.chain(fx.kickBitcrusher, fx.kickCompressor, Tone.getDestination());

    // FIX: snare gets its OWN bitcrusher instance, completely separate chain
    synths.snare.disconnect();
    synths.snare.chain(fx.snareBitcrusher, fx.snareFilter, fx.snareCompressor, Tone.getDestination());
  }
}

export function disposeEffectRack(fx: EffectRack): void {
  fx.kickCompressor.dispose();
  fx.snareCompressor.dispose();
  fx.reverb.dispose();
  fx.kickBitcrusher.dispose();
  fx.snareBitcrusher.dispose();
  fx.tremolo.dispose();
  fx.snareFilter.dispose();
  fx.bassFilter.dispose();
  bitcrushApplied = false;
}

export function disposeSynthRack(synths: SynthRack): void {
  synths.kick.dispose();
  synths.snare.dispose();
  synths.hihat.dispose();
  synths.chords.dispose();
  synths.bass.dispose();
}