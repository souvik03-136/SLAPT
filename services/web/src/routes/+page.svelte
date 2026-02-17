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
      
        href="https://github.com/souvik03-136/slapt"
        target="_blank"
        rel="noopener"
        class="github-link"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path
            d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.78 1.3 3.46.99.1-.77.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.28-1.23 3.28-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.93.43.37.82 1.1.82 2.22v3.3c0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"
          />
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