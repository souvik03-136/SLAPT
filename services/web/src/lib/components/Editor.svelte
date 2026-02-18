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
</script>

<div class="editor-wrapper">
  <div class="editor-header">
    <span class="file-name">track.slapt</span>
    {#if $slaptStore.isLoading}
      <span class="status-dot loading" />
    {:else if ($slaptStore.parseResult?.errors?.length ?? 0) > 0}
      <span class="status-dot error" />
    {:else if $slaptStore.parseResult?.success}
      <span class="status-dot ok" />
    {/if}
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

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
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