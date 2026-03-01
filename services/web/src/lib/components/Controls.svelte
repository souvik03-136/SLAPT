<script lang="ts">
  import { slaptStore, isPlaying } from "$lib/stores/slapt";
  import {
    initAudio,
    playDrums,
    clearDrums,
    playChords,
    clearChords,
    playBass,
    clearBass,
    playAtmosphere,
    clearAtmosphere,
    startPlayback,
    stopPlayback,
    pausePlayback,
    setBarChangeCallback,
    setTempo,
  } from "$lib/audio/engine";
  import { downloadMidi } from "$lib/midi/export";

  $: program   = $slaptStore.parseResult?.program;
  $: tempo     = $slaptStore.tempo ?? 75;
  $: genre     = $slaptStore.genre ?? "";
  $: bars      = $slaptStore.currentBar ?? 0;
  $: canExport = !!program && ($slaptStore.parseResult?.success ?? false);

  let midiExporting  = false;
  let samplesLoading = false;
  let resetting      = false;

  setBarChangeCallback((bar) => slaptStore.setCurrentBar(bar));

  async function handlePlay() {
    samplesLoading = true;
    await initAudio();
    samplesLoading = false;

    const drums      = program?.drums;
    const chords     = program?.chords;
    const bass       = program?.bass;
    const atmosphere = program?.atmosphere;

    // Always call play OR clear for every part so stale parts from a previous
    // play session never bleed into the current one.
    if (drums) {
      await playDrums({
        kick:           drums.kick           ?? [],
        snare:          drums.snare          ?? [],
        snareVelocity:  drums.snareVelocity  ?? null,
        hihat:          drums.hihat          ?? { count: 0, type: "closed" },
        hihatOpenBeats: drums.hihatOpenBeats ?? [],
        swing:          drums.swing          ?? 0,
        effects:        drums.effects        ?? [],
      });
    } else {
      clearDrums();
    }

    if (chords?.progression?.length) {
      playChords(chords.progression);
    } else {
      clearChords();   // no chords block in code — kill any lingering chord part
    }

    if (bass && chords?.progression?.length) {
      playBass(chords.progression);
    } else {
      clearBass();     // no bass block — kill any lingering bass part
    }

    if (atmosphere) {
      playAtmosphere({
        vinylCrackle: atmosphere.vinylCrackle ?? 0,
        rain:         atmosphere.rain         ?? false,
        tapeWobble:   atmosphere.tapeWobble   ?? false,
      });
    } else {
      clearAtmosphere();
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
      const g = program.genre ?? "track";
      const t = program.tempo ?? 75;
      downloadMidi(program, `slapt-${g}-${t}bpm.mid`);
    } finally {
      setTimeout(() => { midiExporting = false; }, 1200);
    }
  }

  async function handleReset() {
    if (resetting) return;
    // Stop playback before resetting so audio doesn't continue on stale state
    stopPlayback();
    slaptStore.setPlaybackState("stopped");
    slaptStore.setCurrentBar(0);

    resetting = true;
    slaptStore.resetCode();          // restores INITIAL_CODE in store + localStorage
    setTimeout(() => { resetting = false; }, 1000);
  }
</script>

<div class="controls">
  <!-- ── Transport ── -->
  <div class="left">
    {#if $isPlaying}
      <button class="ctrl-btn pause" on:click={handlePause} title="Pause">
        <span class="icon">⏸</span>
      </button>
    {:else}
      <button
        class="ctrl-btn play"
        on:click={handlePlay}
        title={samplesLoading ? "Loading samples…" : "Play"}
        disabled={samplesLoading}
      >
        <span class="icon">{samplesLoading ? "⏳" : "▶"}</span>
        {#if samplesLoading}<span class="loading-label">Loading…</span>{/if}
      </button>
    {/if}
    <button class="ctrl-btn stop" on:click={handleStop} title="Stop">
      <span class="icon">■</span>
    </button>
  </div>

  <!-- ── Info ── -->
  <div class="info">
    <span class="bpm">{tempo} <span class="label">BPM</span></span>
    <span class="bar">BAR <strong>{bars}</strong></span>
    {#if genre}
      <span class="genre-badge">{genre.toUpperCase()}</span>
    {/if}
  </div>

  <!-- ── Right actions ── -->
  <div class="right">

    <!-- Reset button -->
    <button
      class="reset-btn"
      class:spinning={resetting}
      on:click={handleReset}
      title="Reset to default example track"
      aria-label="Reset code to default"
    >
      <!-- Refresh/reset icon -->
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class:spin={resetting}
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
      <span>Reset</span>
    </button>

    <!-- MIDI export -->
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
  .ctrl-btn:hover    { background: rgba(255,255,255,0.08); }
  .ctrl-btn.play     { color: #b5f542; }
  .ctrl-btn.pause    { color: #f5d742; }
  .ctrl-btn.stop     { color: #f57242; }
  .ctrl-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .loading-label {
    font-size: 11px;
    margin-left: 4px;
  }

  .info {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: #aaa;
    flex: 1;
  }

  .bpm       { color: #fff; font-weight: 600; }
  .label     { font-size: 10px; color: #888; margin-left: 2px; }
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

  /* ── Reset button ───────────────────────────────────────────────────── */
  .reset-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    border-radius: 5px;
    background: var(--bg-elevated, #1a1a24);
    border: 1px solid var(--border, #2a2a38);
    color: var(--text-muted, #888);
    font-family: var(--font-mono, monospace);
    font-size: 11px;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .reset-btn:hover {
    border-color: rgba(245, 114, 66, 0.5);
    color: #f57242;
    background: rgba(245, 114, 66, 0.06);
  }

  .reset-btn.spinning {
    border-color: rgba(245, 114, 66, 0.5);
    color: #f57242;
  }

  .reset-btn svg.spin {
    animation: spin 0.6s linear;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }

  /* ── MIDI button ────────────────────────────────────────────────────── */
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