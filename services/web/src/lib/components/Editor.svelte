<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { EditorView, keymap, lineNumbers, highlightActiveLineGutter } from "@codemirror/view";
  import { EditorState } from "@codemirror/state";
  import { defaultKeymap, historyKeymap, history } from "@codemirror/commands";
  import { oneDark } from "@codemirror/theme-one-dark";
  import { slaptStore } from "../stores/slapt";
  import { parseCode } from "../api/parser";

  let editorContainer: HTMLDivElement;
  let view: EditorView;
  let parseTimer: ReturnType<typeof setTimeout>;

  // Copy state
  let copied = false;
  let copyTimer: ReturnType<typeof setTimeout>;

  onMount(() => {
    const state = EditorState.create({
      doc: $slaptStore.code,
      extensions: [
        history(),
        lineNumbers(),
        highlightActiveLineGutter(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        oneDark,
        EditorView.theme({
          "&": {
            backgroundColor: "transparent",
            height: "100%",
            fontSize: "14px",
          },
          ".cm-scroller": {
            fontFamily: "var(--font-mono)",
            lineHeight: "1.7",
            overflow: "auto !important",
          },
          ".cm-content": {
            padding: "16px 0",
          },
          ".cm-line": {
            padding: "0 20px",
          },
          ".cm-gutters": {
            backgroundColor: "transparent",
            borderRight: "1px solid var(--border)",
            color: "var(--text-muted)",
          },
          ".cm-activeLineGutter": {
            backgroundColor: "rgba(200, 240, 96, 0.05)",
          },
          ".cm-activeLine": {
            backgroundColor: "rgba(200, 240, 96, 0.03)",
          },
          ".cm-cursor": {
            borderLeftColor: "var(--accent-primary)",
          },
          ".cm-selectionBackground": {
            backgroundColor: "rgba(200, 240, 96, 0.12) !important",
          },
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const code = update.state.doc.toString();
            slaptStore.setCode(code);
            clearTimeout(parseTimer);
            parseTimer = setTimeout(() => triggerParse(code), 400);
          }
        }),
      ],
    });

    view = new EditorView({ state, parent: editorContainer });
    triggerParse($slaptStore.code);
  });

  onDestroy(() => {
    view?.destroy();
    clearTimeout(parseTimer);
    clearTimeout(copyTimer);
  });

  async function triggerParse(code: string) {
    slaptStore.setLoading(true);
    try {
      const result = await parseCode(code);
      slaptStore.setParseResult(result);
    } catch (e) {
      console.error("Parse error:", e);
    } finally {
      slaptStore.setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText($slaptStore.code);
      copied = true;
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => { copied = false; }, 1800);
    } catch {
      // fallback: select all in editor
      view?.focus();
    }
  }
</script>

<div class="editor-wrapper">
  <div class="editor-header">
    <span class="file-name">track.slapt</span>

    <div class="header-right">
      <!-- Status dot -->
      {#if $slaptStore.isLoading}
        <span class="status-dot loading" />
      {:else if ($slaptStore.parseResult?.errors?.length ?? 0) > 0}
        <span class="status-dot error" />
      {:else if $slaptStore.parseResult?.success}
        <span class="status-dot ok" />
      {/if}

      <!-- Copy button -->
      <button
        class="copy-btn"
        class:copied
        on:click={handleCopy}
        title="Copy code"
        aria-label="Copy code to clipboard"
      >
        {#if copied}
          <!-- Checkmark icon -->
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        {:else}
          <!-- Copy icon -->
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        {/if}
      </button>
    </div>
  </div>
  <div bind:this={editorContainer} class="editor-container" />
</div>

<style>
  .editor-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    background: var(--bg-surface);
    border-right: 1px solid var(--border);
    overflow: hidden;
  }

  .editor-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-panel);
  }

  .file-name {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-secondary);
    letter-spacing: 0.05em;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }

  .status-dot.loading {
    background: var(--accent-warn);
    animation: pulse 1s infinite;
  }

  .status-dot.error {
    background: var(--accent-danger);
    box-shadow: 0 0 8px rgba(240, 96, 96, 0.6);
  }

  .status-dot.ok {
    background: var(--accent-primary);
    box-shadow: 0 0 8px rgba(200, 240, 96, 0.4);
  }

  /* Copy button */
  .copy-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 5px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .copy-btn:hover {
    border-color: var(--border-bright);
    color: var(--text-secondary);
    background: var(--bg-surface);
  }

  .copy-btn.copied {
    border-color: rgba(200, 240, 96, 0.5);
    color: var(--accent-primary);
    background: rgba(200, 240, 96, 0.06);
  }

  .editor-container {
    flex: 1;
    overflow: auto;
    min-height: 0;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
</style>