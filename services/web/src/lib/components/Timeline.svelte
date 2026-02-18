<script lang="ts">
  import { slaptStore } from "$lib/stores/slapt";

  const STEPS = 16; // 16th-note resolution (4 beats * 4 subdivisions)

  $: drums = $slaptStore.parseResult?.program?.drums;

  // Convert a beat number (1-based, decimal) to a 0-based step index (0..15)
  // beat 1.0 -> step 0, beat 2.0 -> step 4, beat 3.0 -> step 8, beat 4.0 -> step 12
  function beatToStep(beat: number): number {
    return Math.round((beat - 1) * 4);
  }

  // FIX: build a Set of active steps for O(1) lookup, handles decimal beats properly
  $: kickSteps = new Set<number>(
    (drums?.kick ?? []).map(beatToStep).filter((s) => s >= 0 && s < STEPS)
  );

  $: snareSteps = new Set<number>(
    (drums?.snare ?? []).map(beatToStep).filter((s) => s >= 0 && s < STEPS)
  );

  // FIX: hihat evenly divides STEPS by count. If count=0 -> no hihat steps.
  $: hihatSteps = (() => {
    const count = drums?.hihat?.count ?? 0;
    if (count <= 0) return new Set<number>();
    const interval = STEPS / count; // e.g. count=8 -> interval=2 -> steps 0,2,4,6,8,10,12,14
    const s = new Set<number>();
    for (let i = 0; i < count; i++) {
      s.add(Math.round(i * interval));
    }
    return s;
  })();

  // Generate step indices 0..15
  const stepIndices = Array.from({ length: STEPS }, (_, i) => i);

  // Beat label positions: beats 1-4 sit at steps 0,4,8,12
  // We render them as absolute overlays so they never affect the grid column widths
  const beatLabels = [
    { beat: 1, step: 0  },
    { beat: 2, step: 4  },
    { beat: 3, step: 8  },
    { beat: 4, step: 12 },
  ];
</script>

<div class="timeline">
  <!-- Beat label row: absolutely positioned over the grid so it doesn't break columns -->
  <div class="row header-row">
    <div class="row-label">PATTERN</div>
    <div class="grid-wrapper">
      <!-- FIX: beat labels are overlaid via absolute positioning, 
           each at exactly (step / STEPS * 100%) of grid width -->
      <div class="beat-labels">
        {#each beatLabels as { beat, step }}
          <span
            class="beat-label"
            style="left: {(step / STEPS) * 100}%"
          >{beat}</span>
        {/each}
      </div>
    </div>
  </div>

  <!-- Kick row -->
  <div class="row">
    <div class="row-label">KICK</div>
    <div class="grid-wrapper">
      <div class="step-grid">
        {#each stepIndices as i}
          <div
            class="step"
            class:active={kickSteps.has(i)}
            class:beat-start={i % 4 === 0}
            data-type="kick"
          />
        {/each}
      </div>
    </div>
  </div>

  <!-- Snare row -->
  <div class="row">
    <div class="row-label">SNARE</div>
    <div class="grid-wrapper">
      <div class="step-grid">
        {#each stepIndices as i}
          <div
            class="step"
            class:active={snareSteps.has(i)}
            class:beat-start={i % 4 === 0}
            data-type="snare"
          />
        {/each}
      </div>
    </div>
  </div>

  <!-- Hihat row -->
  <div class="row">
    <div class="row-label">HIHAT</div>
    <div class="grid-wrapper">
      <div class="step-grid">
        {#each stepIndices as i}
          <div
            class="step"
            class:active={hihatSteps.has(i)}
            class:beat-start={i % 4 === 0}
            data-type="hihat"
          />
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .timeline {
    background: #1a1a1a;
    padding: 10px 0 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    user-select: none;
  }

  .row {
    display: flex;
    align-items: center;
    height: 28px;
  }

  .header-row {
    height: 20px;
    margin-bottom: 2px;
  }

  .row-label {
    width: 60px;
    min-width: 60px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: #555;
    text-align: right;
    padding-right: 10px;
  }

  /* FIX: grid-wrapper is position:relative so beat labels can overlay correctly */
  .grid-wrapper {
    flex: 1;
    position: relative;
    height: 100%;
  }

  /* Beat labels absolutely positioned so they don't consume grid columns */
  .beat-labels {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .beat-label {
    position: absolute;
    font-size: 9px;
    color: #444;
    transform: translateX(-50%);
    top: 2px;
  }

  /* FIX: 16 exactly equal columns using grid - no flex quirks */
  .step-grid {
    display: grid;
    grid-template-columns: repeat(16, 1fr);
    gap: 2px;
    height: 100%;
    width: 100%;
  }

  .step {
    border-radius: 2px;
    background: #2a2a2a;
    height: 100%;
    transition: background 0.1s;
  }

  /* FIX: beat-start steps get a slightly lighter background so bar grid is visible */
  .step.beat-start {
    background: #2f2f2f;
  }

  .step.active[data-type="kick"]  { background: #b5f542; }
  .step.active[data-type="snare"] { background: #f5a742; }
  .step.active[data-type="hihat"] { background: #42d4f5; }
</style>