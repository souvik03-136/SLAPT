<script lang="ts">
  import { slaptStore, isPlaying } from "$lib/stores/slapt";
  import {
    initAudio,
    playDrums,
    playChords,
    playBass,
    playAtmosphere,
    startPlayback,
    stopPlayback,
    pausePlayback,
    setBarChangeCallback,
    setTempo,
  } from "$lib/audio/engine";

  $: program = $slaptStore.parseResult?.program;
  $: tempo   = $slaptStore.tempo ?? 75;
  $: genre   = $slaptStore.genre ?? "";
  $: bars    = $slaptStore.currentBar ?? 0;

  setBarChangeCallback((bar) => slaptStore.setCurrentBar(bar));

  async function handlePlay() {
    await initAudio();

    const drums = program?.drums;
    const chords = program?.chords;
    const bass = program?.bass;
    const atmosphere = program?.atmosphere;

    if (drums) {
      await playDrums(
        {
          kick:          drums.kick          ?? [],
          snare:         drums.snare         ?? [],
          // FIX: pass parsed snareVelocity through — null means use scheduler default
          snareVelocity: drums.snareVelocity ?? null,
          hihat:         drums.hihat         ?? { count: 0, type: "closed" },
          swing:         drums.swing         ?? 0,
          effects:       drums.effects       ?? [],
        },
        tempo
      );
    }

    if (chords?.progression?.length) {
      await playChords(chords.progression, chords.instrument ?? "piano", tempo);
    }

    if (bass) {
      await playBass(chords?.progression ?? [], tempo);
    }

    // FIX: play atmosphere if present — was wired up in stores/types but never
    // called into the audio engine, so vinyl crackle/rain were always silent
    if (atmosphere) {
      await playAtmosphere({
        vinylCrackle: atmosphere.vinylCrackle ?? 0,
        rain:         atmosphere.rain         ?? false,
        tapeWobble:   atmosphere.tapeWobble   ?? false,
      });
    }

    startPlayback();
    slaptStore.setPlaybackState("playing");
  }

  async function handlePause() {
    pausePlayback();
    slaptStore.setPlaybackState("paused");
  }

  async function handleStop() {
    stopPlayback();
    slaptStore.setCurrentBar(0);
    slaptStore.setPlaybackState("stopped");
  }

  function handleTempoChange(e: Event) {
    const val = parseFloat((e.target as HTMLInputElement).value);
    if (!isNaN(val) && val > 0) {
      slaptStore.setTempo(val);
      setTempo(val);
    }
  }
</script>

<div class="controls">
  <div class="left">
    {#if $isPlaying}
      <button class="ctrl-btn pause" on:click={handlePause} title="Pause">
        <span class="icon">⏸</span>
      </button>
    {:else}
      <button class="ctrl-btn play" on:click={handlePlay} title="Play">
        <span class="icon">▶</span>
      </button>
    {/if}
    <button class="ctrl-btn stop" on:click={handleStop} title="Stop">
      <span class="icon">■</span>
    </button>
  </div>

  <div class="info">
    <span class="bpm">{tempo} <span class="label">BPM</span></span>
    <span class="bar">BAR <strong>{bars}</strong></span>
    {#if genre}
      <span class="genre-badge">{genre.toUpperCase()}</span>
    {/if}
  </div>
</div>

<style>
  .controls {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0 12px;
  }
  .left {
    display: flex;
    gap: 6px;
  }
  .ctrl-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    color: #ccc;
    transition: background 0.15s;
  }
  .ctrl-btn:hover { background: rgba(255,255,255,0.08); }
  .ctrl-btn.play  { color: #b5f542; }
  .ctrl-btn.pause { color: #f5d742; }
  .ctrl-btn.stop  { color: #f57242; }
  .info {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: #aaa;
  }
  .bpm { color: #fff; font-weight: 600; }
  .label { font-size: 10px; color: #888; margin-left: 2px; }
  .bar strong { color: #b5f542; }
  .genre-badge {
    background: #b5f542;
    color: #111;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 3px;
    letter-spacing: 0.05em;
  }
</style>