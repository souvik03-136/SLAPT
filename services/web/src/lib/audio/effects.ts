import * as Tone from "tone";

const TR808_BASE =
  "https://raw.githubusercontent.com/ritchse/tidal-drum-machines/main/machines/RolandTR808/";

const SALAMANDER = "https://tonejs.github.io/audio/salamander/";

// ── Types ────────────────────────────────────────────────────────────────────

export interface SynthRack {
  kickBuf:        AudioBuffer | null;
  snareBuf:       AudioBuffer | null;
  hihatClosedBuf: AudioBuffer | null;
  hihatOpenBuf:   AudioBuffer | null;
  chords:         Tone.Sampler;
  bass:           Tone.Sampler;
  ctx:            AudioContext;
}

export interface EffectRack {
  kickGain:        GainNode;
  snareGain:       GainNode;
  hihatGain:       GainNode;
  kickCompressor:  DynamicsCompressorNode;
  snareCompressor: DynamicsCompressorNode;
  kickBitcrusher:  Tone.BitCrusher;
  snareBitcrusher: Tone.BitCrusher;
  reverb:          Tone.Reverb;
  tremolo:         Tone.Tremolo;
  bassHpFilter:    Tone.Filter;
  bassLpFilter:    Tone.Filter;
  bassMidEq:       Tone.EQ3;
  bassCompressor:  Tone.Compressor;
}

// ── Effect rack ───────────────────────────────────────────────────────────────

export async function buildEffectRack(): Promise<EffectRack> {
  if (typeof window === "undefined")
    throw new Error("buildEffectRack called server-side");

  const ctx  = Tone.getContext().rawContext as AudioContext;
  const dest = ctx.destination;

  const kickCompressor  = ctx.createDynamicsCompressor();
  kickCompressor.threshold.value = -18;
  kickCompressor.ratio.value     = 4;
  kickCompressor.attack.value    = 0.003;
  kickCompressor.release.value   = 0.1;

  const snareCompressor = ctx.createDynamicsCompressor();
  snareCompressor.threshold.value = -18;
  snareCompressor.ratio.value     = 3;
  snareCompressor.attack.value    = 0.003;
  snareCompressor.release.value   = 0.1;

  const kickGain  = ctx.createGain(); kickGain.gain.value  = 1.0;
  const snareGain = ctx.createGain(); snareGain.gain.value = 0.85;
  const hihatGain = ctx.createGain(); hihatGain.gain.value = 0.55;

  kickGain.connect(kickCompressor);   kickCompressor.connect(dest);
  snareGain.connect(snareCompressor); snareCompressor.connect(dest);
  hihatGain.connect(dest);

  const reverb          = new Tone.Reverb({ decay: 2.5, wet: 0.35 });
  const tremolo         = new Tone.Tremolo({ frequency: 4, depth: 0.25 }).start();
  const kickBitcrusher  = new Tone.BitCrusher(8);
  const snareBitcrusher = new Tone.BitCrusher(8);
  const bassHpFilter    = new Tone.Filter({ frequency: 55,   type: "highpass", rolloff: -12 });
  const bassLpFilter    = new Tone.Filter({ frequency: 1200, type: "lowpass",  rolloff: -12 });
  const bassMidEq       = new Tone.EQ3({ low: 0, mid: 2, high: -3, lowFrequency: 200, highFrequency: 2500 });
  const bassCompressor  = new Tone.Compressor({ threshold: -14, ratio: 3, attack: 0.02, release: 0.2, knee: 6 });

  await reverb.generate();

  return {
    kickGain, snareGain, hihatGain,
    kickCompressor, snareCompressor,
    kickBitcrusher, snareBitcrusher,
    reverb, tremolo,
    bassHpFilter, bassLpFilter, bassMidEq, bassCompressor,
  };
}

// ── Synth rack ────────────────────────────────────────────────────────────────

export async function buildSynthRack(fx: EffectRack): Promise<SynthRack> {
  if (typeof window === "undefined")
    throw new Error("buildSynthRack called server-side");

  const ctx = Tone.getContext().rawContext as AudioContext;

  const [kickBuf, snareBuf, hihatClosedBuf, hihatOpenBuf, chords, bass] =
    await Promise.all([
      fetchBuffer(ctx, TR808_BASE + "rolandtr808-bd/BD0000.WAV"),
      fetchBuffer(ctx, TR808_BASE + "rolandtr808-sd/SD0000.WAV"),
      fetchBuffer(ctx, TR808_BASE + "rolandtr808-hh/CH.WAV"),
      fetchBuffer(ctx, TR808_BASE + "rolandtr808-oh/OH00.WAV"),

      makeSampler(
        {
          "A2": "A2.mp3",  "C3": "C3.mp3",
          "D#3": "Ds3.mp3", "F#3": "Fs3.mp3",
          "A3": "A3.mp3",  "C4": "C4.mp3",
          "D#4": "Ds4.mp3", "F#4": "Fs4.mp3",
          "A4": "A4.mp3",  "C5": "C5.mp3",
          "D#5": "Ds5.mp3", "F#5": "Fs5.mp3",
          "A5": "A5.mp3",
        },
        SALAMANDER,
        [fx.tremolo, fx.reverb],
        { volume: -6, release: 1.4 }
      ),

      makeSampler(
        {
          "A1": "A1.mp3",   "C2": "C2.mp3",
          "D#2": "Ds2.mp3", "F#2": "Fs2.mp3",
          "A2": "A2.mp3",   "C3": "C3.mp3",
        },
        SALAMANDER,
        [fx.bassHpFilter, fx.bassLpFilter, fx.bassMidEq, fx.bassCompressor],
        { volume: -4, release: 0.5 }
      ),
    ]);

  return { kickBuf, snareBuf, hihatClosedBuf, hihatOpenBuf, chords, bass, ctx };
}

// ── Drum playback ─────────────────────────────────────────────────────────────
//
// KEY FIX: we track every BufferSourceNode we create in `activeSources`.
// stopAllSources() cancels them all — this is what prevents ghost notes
// after pause/stop. A DAW does the same thing: it maintains a list of
// playing voices and kills them all on stop.

const activeSources: Set<AudioBufferSourceNode> = new Set();

export function playBuffer(
  ctx:          AudioContext,
  buf:          AudioBuffer | null,
  dest:         AudioNode,
  acTime:       number,
  gainValue:    number = 1.0,
  playbackRate: number = 1.0
): void {
  if (!buf) return;

  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = playbackRate;

  const g = ctx.createGain();
  g.gain.value = gainValue;
  src.connect(g);
  g.connect(dest);

  // Track it so we can cancel later
  activeSources.add(src);
  src.onended = () => activeSources.delete(src);

  src.start(acTime);
}

export function stopAllSources(): void {
  for (const src of activeSources) {
    try { src.stop(); } catch { /* already stopped */ }
    src.disconnect();
  }
  activeSources.clear();
}

// ── Drum effects (bitcrush) ───────────────────────────────────────────────────

let bitcrushApplied = false;

export function resetEffectState(): void {
  bitcrushApplied = false;
}

export function applyDrumEffects(
  _synths: SynthRack,
  fx: EffectRack,
  effects: string[]
): void {
  if (effects.includes("bitcrush") && !bitcrushApplied) {
    bitcrushApplied = true;
    fx.kickBitcrusher.toDestination();
    fx.snareBitcrusher.toDestination();
  }
}

// ── Sampler helper ────────────────────────────────────────────────────────────

function makeSampler(
  urls: Record<string, string>,
  baseUrl: string,
  chain: Tone.ToneAudioNode[],
  options: Omit<Partial<Tone.SamplerOptions>, "urls" | "baseUrl" | "onload" | "onerror"> = {}
): Promise<Tone.Sampler> {
  let s: Tone.Sampler;
  return new Promise<Tone.Sampler>((resolve, reject) => {
    s = new Tone.Sampler({
      urls,
      baseUrl,
      onload:  (): void => resolve(s),
      onerror: (err: Error): void => reject(err),
      ...options,
    });
    if (chain.length > 0) {
      (s.chain as (...nodes: Tone.ToneAudioNode[]) => Tone.Sampler)(
        ...chain, Tone.getDestination()
      );
    } else {
      s.toDestination();
    }
  });
}

// ── fetchBuffer ───────────────────────────────────────────────────────────────

async function fetchBuffer(ctx: AudioContext, url: string): Promise<AudioBuffer> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to load sample: ${url} (${resp.status})`);
  const arrayBuf = await resp.arrayBuffer();
  return ctx.decodeAudioData(arrayBuf);
}

// ── Disposal ──────────────────────────────────────────────────────────────────

export function disposeEffectRack(fx: EffectRack): void {
  stopAllSources();
  fx.kickGain.disconnect();
  fx.snareGain.disconnect();
  fx.hihatGain.disconnect();
  fx.kickCompressor.disconnect();
  fx.snareCompressor.disconnect();
  fx.kickBitcrusher.dispose();
  fx.snareBitcrusher.dispose();
  fx.reverb.dispose();
  fx.tremolo.dispose();
  fx.bassHpFilter.dispose();
  fx.bassLpFilter.dispose();
  fx.bassMidEq.dispose();
  fx.bassCompressor.dispose();
  bitcrushApplied = false;
}

export function disposeSynthRack(synths: SynthRack): void {
  synths.chords.dispose();
  synths.bass.dispose();
}