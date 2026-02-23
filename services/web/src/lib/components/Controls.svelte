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
  import { downloadMidi } from "$lib/midi/export";

  $: program    = $slaptStore.parseResult?.program;
  $: tempo      = $slaptStore.tempo ?? 75;
  $: genre      = $slaptStore.genre ?? "";
  $: bars       = $slaptStore.currentBar ?? 0;
  $: canExport  = !!program && ($slaptStore.parseResult?.success ?? false);

  let midiExporting = false;

  setBarChangeCallback((bar) => slaptStore.setCurrentBar(bar));

  async function handlePlay() {
    await initAudio();

    const drums      = program?.drums;
    const chords     = program?.chords;
    const bass       = program?.bass;
    const atmosphere = program?.atmosphere;

    if (drums) {
      await playDrums(
        {
          kick:             drums.kick             ?? [],
          snare:            drums.snare            ?? [],
          snareVelocity:    drums.snareVelocity    ?? null,
          hihat:            drums.hihat            ?? { count: 0, type: "closed" },
          hihatOpenBeats:   drums.hihatOpenBeats   ?? [],
          swing:            drums.swing            ?? 0,
          effects:          drums.effects          ?? [],
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

  async function handleMidiExport() {
    if (!program || midiExporting) return;
    midiExporting = true;
    try {
      const genre  = program.genre ?? "track";
      const tempo  = program.tempo ?? 75;
      downloadMidi(program, `slapt-${genre}-${tempo}bpm.mid`);
    } finally {
      setTimeout(() => { midiExporting = false; }, 1200);
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

  <!-- MIDI export -->
  <div class="right">
    <button
      class="midi-btn"
      class:disabled={!canExport}
      class:exporting={midiExporting}
      on:click={handleMidiExport}
      disabled={!canExport}
      title={canExport ? "Export as MIDI (.mid)" : "Fix errors before exporting"}
    >
      {#if midiExporting}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>Saved</span>
      {:else}
        <!-- Download icon -->
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>MIDI</span>
      {/if}
    </button>
  </div>
</div>

<style>
  .controls {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0 12px;
    width: 100%;
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
    flex: 1;
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
  .right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .midi-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 5px;
    background: var(--bg-elevated, #1a1a24);
    border: 1px solid var(--border, #2a2a38);
    color: var(--accent-cool, #60c8f0);
    font-family: var(--font-mono, monospace);
    font-size: 11px;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .midi-btn:hover:not(.disabled) {
    border-color: var(--accent-cool, #60c8f0);
    background: rgba(96, 200, 240, 0.08);
  }
  .midi-btn.disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .midi-btn.exporting {
    color: var(--accent-primary, #c8f060);
    border-color: rgba(200, 240, 96, 0.4);
    background: rgba(200, 240, 96, 0.06);
  }
</style>