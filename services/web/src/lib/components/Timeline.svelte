<script lang="ts">
  import { slaptStore } from "../stores/slapt";

  const TOTAL_BARS = 16;
  $: currentBar = $slaptStore.currentBar % TOTAL_BARS;

  function extractKickBeats(code: string): number[] {
    const m = code.match(/kick\s+pattern\s+\[([\d.,\s]+)\]/);
    if (m) return m[1].split(",").map((n) => parseFloat(n.trim()));
    const m2 = code.match(/kick\s+on\s+([\d\s]+and[\d\s]+)/);
    if (m2) return m2[1].split(/\s+and\s+/).map((n) => parseFloat(n.trim()));
    return [1, 3];
  }

  function extractSnareBeats(code: string): number[] {
    const m = code.match(/snare\s+on\s+([\d\s]+and[\d\s]+)/);
    if (m) return m[1].split(/\s+and\s+/).map((n) => parseFloat(n.trim()));
    return [2, 4];
  }

  function extractHihatCount(code: string): number {
    const m = code.match(/hihat\s+(?:closed\s+)?(\d+)\s+times/);
    return m ? parseInt(m[1]) : 8;
  }

  $: kicks = extractKickBeats($slaptStore.code);
  $: snares = extractSnareBeats($slaptStore.code);
  $: hihatCount = extractHihatCount($slaptStore.code);

  const STEPS = 16;
  $: kickSteps = Array.from({ length: STEPS }, (_, i) => {
    const beat = (i / 4) + 1;
    return kicks.some((k) => Math.abs(k - beat) < 0.2);
  });
  $: snareSteps = Array.from({ length: STEPS }, (_, i) => {
    const beat = (i / 4) + 1;
    return snares.some((s) => Math.abs(s - beat) < 0.2);
  });
  $: hihatSteps = Array.from({ length: STEPS }, (_, i) => {
    const interval = STEPS / hihatCount;
    return i % interval < 1;
  });
</script>

<div class="timeline">
  <div class="timeline-header">
    <span class="label">PATTERN</span>
    <div class="beat-markers">
      {#each [1, 2, 3, 4] as b}
        <span class="beat-marker">{b}</span>
      {/each}
    </div>
  </div>

  <div class="rows">
    <div class="row">
      <span class="row-label">KICK</span>
      <div class="steps">
        {#each kickSteps as active, i}
          <div
            class="step kick"
            class:active
            class:current={$slaptStore.playbackState === "playing" &&
              Math.floor((i / STEPS) * 4) === ((currentBar * 4) % 4)}
          />
        {/each}
      </div>
    </div>

    <div class="row">
      <span class="row-label">SNARE</span>
      <div class="steps">
        {#each snareSteps as active, i}
          <div class="step snare" class:active />
        {/each}
      </div>
    </div>

    <div class="row">
      <span class="row-label">HIHAT</span>
      <div class="steps">
        {#each hihatSteps as active, i}
          <div class="step hihat" class:active />
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .timeline {
    padding: 12px 16px;
    background: var(--bg-panel);
    border-top: 1px solid var(--border);
  }

  .timeline-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .label {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 0.12em;
  }

  .beat-markers {
    display: flex;
    gap: 0;
    width: calc(100% - 64px);
    justify-content: space-around;
  }

  .beat-marker {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--text-muted);
    letter-spacing: 0.05em;
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .row-label {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--text-muted);
    width: 40px;
    letter-spacing: 0.08em;
    flex-shrink: 0;
  }

  .steps {
    display: flex;
    gap: 3px;
    flex: 1;
  }

  .step {
    flex: 1;
    height: 22px;
    border-radius: 2px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    transition: all 0.1s ease;
    position: relative;
  }

  .step.active.kick {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    box-shadow: 0 0 6px rgba(200, 240, 96, 0.4);
  }

  .step.active.snare {
    background: var(--accent-warm);
    border-color: var(--accent-warm);
    box-shadow: 0 0 6px rgba(240, 160, 96, 0.4);
  }

  .step.active.hihat {
    background: var(--accent-cool);
    border-color: var(--accent-cool);
    box-shadow: 0 0 6px rgba(96, 200, 240, 0.3);
    height: 12px;
    margin-top: 5px;
  }
</style>