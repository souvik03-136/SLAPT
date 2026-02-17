<script lang="ts">
  import { onDestroy } from "svelte";
  import { slaptStore, isPlaying } from "../stores/slapt";
  import {
    initAudio,
    playDrums,
    playChords,
    playBass,
    startPlayback,
    stopPlayback,
    pausePlayback,
    setBarChangeCallback,
    cleanup,
  } from "../audio/engine";

  onDestroy(cleanup);

  setBarChangeCallback((bar) => slaptStore.setCurrentBar(bar));

  async function handlePlay() {
    const { code, parseResult } = $slaptStore;
    if (!parseResult?.success) return;

    await initAudio();

    const genreMatch = code.match(/@genre\s+(\S+)/);
    const tempoMatch = code.match(/@tempo\s+(\d+(?:\.\d+)?)\s+bpm/i);
    const tempo = tempoMatch ? parseFloat(tempoMatch[1]) : 75;

    const hasDusty = code.includes("make it dusty");
    const hasGroovy = code.includes("make it groovy");

    const kickMatches = code.match(/kick\s+pattern\s+\[([\d.,\s]+)\]/);
    const kickBeats = kickMatches
      ? kickMatches[1].split(",").map((n) => parseFloat(n.trim()))
      : [1, 3];

    const snareMatches = code.match(/snare\s+on\s+([\d\s]+and[\d\s]+)/);
    const snareBeats = snareMatches
      ? snareMatches[1].split(/\s+and\s+/).map((n) => parseFloat(n.trim()))
      : [2, 4];

    const hihatMatch = code.match(/hihat\s+(?:closed\s+)?(\d+)\s+times/);
    const hihatCount = hihatMatch ? parseInt(hihatMatch[1]) : 8;

    const swingMatch = code.match(/swing\((\d+)%\)/);
    const swing = swingMatch ? parseInt(swingMatch[1]) : hasGroovy ? 60 : 0;

    await playDrums(
      {
        kick: kickBeats,
        snare: snareBeats,
        hihat: { count: hihatCount, type: "closed" },
        swing,
        effects: hasDusty ? ["bitcrush"] : [],
      },
      tempo
    );

    const progressionMatch = code.match(/progression\s+([\w#♭→\s]+)/);
    if (progressionMatch) {
      const progression = progressionMatch[1]
        .split("→")
        .map((c) => c.trim())
        .filter(Boolean);
      await playChords(progression, "piano", tempo);
      await playBass(progression, tempo);
    }

    startPlayback();
    slaptStore.setPlaybackState("playing");
    slaptStore.setTempo(tempo);
  }

  function handlePause() {
    pausePlayback();
    slaptStore.setPlaybackState("paused");
  }

  function handleStop() {
    stopPlayback();
    slaptStore.setPlaybackState("stopped");
    slaptStore.setCurrentBar(0);
  }
</script>

<div class="controls">
  <div class="transport">
    {#if $isPlaying}
      <button class="control-btn pause" on:click={handlePause} title="Pause">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      </button>
    {:else}
      <button
        class="control-btn play"
        on:click={handlePlay}
        disabled={!$slaptStore.parseResult?.success}
        title="Play"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      </button>
    {/if}

    <button class="control-btn stop" on:click={handleStop} title="Stop">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="4" width="16" height="16" />
      </svg>
    </button>
  </div>

  <div class="info">
    <span class="tempo-display">
      {$slaptStore.tempo} <span class="unit">BPM</span>
    </span>
    <span class="bar-display">
      BAR <span class="bar-number">{$slaptStore.currentBar}</span>
    </span>
    <span class="genre-badge">
      {$slaptStore.genre}
    </span>
  </div>
</div>

<style>
  .controls {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 0 20px;
    height: 100%;
  }

  .transport {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .control-btn {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    color: var(--text-secondary);
  }

  .control-btn:hover:not(:disabled) {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
    box-shadow: 0 0 12px rgba(200, 240, 96, 0.2);
  }

  .control-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .control-btn svg {
    width: 14px;
    height: 14px;
  }

  .control-btn.play {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: var(--bg-deep);
    box-shadow: 0 0 16px rgba(200, 240, 96, 0.3);
  }

  .control-btn.play:hover:not(:disabled) {
    box-shadow: 0 0 24px rgba(200, 240, 96, 0.5);
    color: var(--bg-deep);
  }

  .info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .tempo-display {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text-primary);
    font-weight: 700;
  }

  .unit {
    font-size: 10px;
    color: var(--text-muted);
    font-weight: 400;
  }

  .bar-display {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 0.08em;
  }

  .bar-number {
    color: var(--accent-cool);
    font-weight: 700;
  }

  .genre-badge {
    font-family: var(--font-mono);
    font-size: 10px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    color: var(--accent-warm);
    padding: 3px 8px;
    border-radius: 3px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
</style>