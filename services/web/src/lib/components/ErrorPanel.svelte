<script lang="ts">
  import { slaptStore, hasErrors, hasWarnings } from "../stores/slapt";
</script>

{#if $hasErrors || $hasWarnings}
  <div class="error-panel">
    {#if $hasErrors}
      <div class="section errors">
        <span class="section-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          ERRORS
        </span>
        {#each $slaptStore.parseResult?.errors ?? [] as err}
          <div class="item error">
            <div class="item-header">
              {#if err.line}<span class="location">line {err.line}{err.column ? `:${err.column}` : ''}</span>{/if}
              <span class="code">{err.code}</span>
            </div>
            <p class="message">{err.message}</p>
            {#if err.suggestions?.length}
              <ul class="suggestions">
                {#each err.suggestions as s}
                  <li>{s}</li>
                {/each}
              </ul>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

    {#if $hasWarnings}
      <div class="section warnings">
        <span class="section-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          WARNINGS
        </span>
        {#each $slaptStore.parseResult?.warnings ?? [] as warn}
          <div class="item warning">
            <div class="item-header">
              <span class="code">{warn.code}</span>
            </div>
            <p class="message">{warn.message}</p>
            {#if warn.suggestions?.length}
              <ul class="suggestions">
                {#each warn.suggestions as s}
                  <li>{s}</li>
                {/each}
              </ul>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style>
  .error-panel {
    background: var(--bg-panel);
    border-top: 1px solid var(--border);
    overflow-y: auto;
    padding: 8px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .section-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.12em;
    padding-bottom: 4px;
    border-bottom: 1px solid var(--border);
  }

  .errors .section-label { color: var(--accent-danger); }
  .warnings .section-label { color: var(--accent-warn); }

  .item {
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    border-left: 2px solid;
    background: var(--bg-elevated);
  }

  .item.error { border-color: var(--accent-danger); }
  .item.warning { border-color: var(--accent-warn); }

  .item-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
  }

  .location {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
  }

  .code {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-secondary);
    background: var(--bg-surface);
    padding: 1px 5px;
    border-radius: 2px;
  }

  .message {
    font-size: 12px;
    color: var(--text-primary);
    line-height: 1.4;
  }

  .suggestions {
    margin-top: 4px;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .suggestions li {
    font-size: 11px;
    color: var(--text-secondary);
    padding-left: 12px;
    position: relative;
  }

  .suggestions li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--text-muted);
  }
</style>