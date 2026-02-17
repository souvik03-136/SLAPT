<script lang="ts">
  import Editor from "$lib/components/Editor.svelte";
  import Controls from "$lib/components/Controls.svelte";
  import Timeline from "$lib/components/Timeline.svelte";
  import ErrorPanel from "$lib/components/ErrorPanel.svelte";
  import { slaptStore } from "$lib/stores/slapt";
</script>

<div class="app">
  <header class="topbar">
    <div class="brand">
      <span class="logo">SLAPT</span>
      <span class="tagline">write music like you feel it</span>
    </div>
    <div class="controls-area">
      <Controls />
    </div>
    <div class="topbar-right">
      <span class="key-badge">{$slaptStore.key}</span>
      <a href="https://github.com/souvik03-136/slapt" target="_blank" rel="noopener" class="github-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
      </a>
    </div>
  </header>

  <div class="workspace">
    <aside class="sidebar">
      <div class="sidebar-section">
        <span class="sidebar-label">GENRE TEMPLATES</span>
        <div class="template-list">
          {#each ["lofi-hiphop", "boom-bap", "house", "techno"] as g}
            <button
              class="template-btn"
              class:active={$slaptStore.genre === g}
              on:click={() => {}}
            >
              {g}
            </button>
          {/each}
        </div>
      </div>

      <div class="sidebar-section">
        <span class="sidebar-label">QUICK MODIFIERS</span>
        <div class="modifier-list">
          {#each ["make it groovy", "make it dusty", "add some laziness", "bring energy up"] as m}
            <button
              class="modifier-btn"
              on:click={() => {
                const current = $slaptStore.code;
                if (!current.includes(m)) {
                  slaptStore.setCode(current + "\n" + m);
                }
              }}
            >
              {m}
            </button>
          {/each}
        </div>
      </div>
    </aside>

    <main class="editor-area">
      <Editor />
      <ErrorPanel />
      <Timeline />
    </main>
  </div>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background: var(--bg-deep);
  }

  .topbar {
    display: flex;
    align-items: center;
    height: 52px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-panel);
    padding: 0 16px;
    gap: 0;
    flex-shrink: 0;
    box-shadow: var(--shadow-panel);
    z-index: 10;
  }

  .brand {
    display: flex;
    align-items: baseline;
    gap: 12px;
    min-width: 180px;
  }

  .logo {
    font-family: var(--font-display);
    font-size: 26px;
    color: var(--accent-primary);
    letter-spacing: 0.08em;
    line-height: 1;
    text-shadow: 0 0 20px rgba(200, 240, 96, 0.3);
  }

  .tagline {
    font-size: 11px;
    color: var(--text-muted);
    font-style: italic;
    letter-spacing: 0.03em;
  }

  .controls-area {
    flex: 1;
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .key-badge {
    font-family: var(--font-mono);
    font-size: 11px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    color: var(--accent-cool);
    padding: 3px 8px;
    border-radius: 3px;
    letter-spacing: 0.08em;
  }

  .github-link {
    color: var(--text-muted);
    display: flex;
    align-items: center;
    transition: color 0.15s ease;
  }

  .github-link:hover {
    color: var(--text-primary);
  }

  .workspace {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .sidebar {
    width: 200px;
    background: var(--bg-panel);
    border-right: 1px solid var(--border);
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
    flex-shrink: 0;
    overflow-y: auto;
  }

  .sidebar-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 12px;
  }

  .sidebar-label {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--text-muted);
    letter-spacing: 0.12em;
    padding-bottom: 4px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 2px;
  }

  .template-list,
  .modifier-list {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .template-btn,
  .modifier-btn {
    text-align: left;
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: 11px;
    border: 1px solid transparent;
    transition: all 0.12s ease;
    letter-spacing: 0.02em;
  }

  .template-btn:hover,
  .modifier-btn:hover {
    background: var(--bg-elevated);
    border-color: var(--border);
    color: var(--text-primary);
  }

  .template-btn.active {
    background: rgba(200, 240, 96, 0.08);
    border-color: rgba(200, 240, 96, 0.3);
    color: var(--accent-primary);
  }

  .modifier-btn {
    font-size: 10px;
    color: var(--text-muted);
  }

  .modifier-btn:hover {
    color: var(--accent-warm);
    border-color: rgba(240, 160, 96, 0.3);
    background: rgba(240, 160, 96, 0.05);
  }

  .editor-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
</style>