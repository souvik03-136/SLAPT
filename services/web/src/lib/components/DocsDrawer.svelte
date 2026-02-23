<script lang="ts">
  export let open = false;

  function close() { open = false; }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  let activeSection = 'quickstart';

  const sections = [
    { group: 'Getting Started', items: [
      { id: 'quickstart',  label: 'Quick Start' },
      { id: 'structure',   label: 'File Structure' },
    ]},
    { group: 'Language Blocks', items: [
      { id: 'directives',  label: 'Directives' },
      { id: 'drums',       label: 'Drum Block' },
      { id: 'chords',      label: 'Chord Block' },
      { id: 'bass',        label: 'Bass Block' },
      { id: 'atmosphere',  label: 'Atmosphere Block' },
      { id: 'sections',    label: 'Sections' },
      { id: 'modifiers',   label: 'Global Modifiers' },
    ]},
    { group: 'Reference', items: [
      { id: 'keys',        label: 'Supported Keys' },
      { id: 'genres',      label: 'Supported Genres' },
      { id: 'timesig',     label: 'Time Signatures' },
      { id: 'midi',        label: 'MIDI Export' },
      { id: 'persist',     label: 'Auto-Save' },
      { id: 'errors',      label: 'Errors & Warnings' },
      { id: 'ascii',       label: 'ASCII Rule' },
      { id: 'cheatsheet',  label: 'Cheat Sheet' },
    ]},
    { group: 'Examples', items: [
      { id: 'ex-lofi',     label: 'Lo-Fi Hip-Hop' },
      { id: 'ex-boombap',  label: 'Boom Bap' },
      { id: 'ex-techno',   label: 'Techno' },
      { id: 'ex-waltz',    label: '3/4 Waltz Beat' },
      { id: 'ex-five',     label: '5/4 Odd Time' },
      { id: 'ex-minimal',  label: 'Minimal Beat' },
    ]},
  ];

  function scrollTo(id: string) {
    activeSection = id;
    const el = document.getElementById('doc-' + id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- BACKDROP -->
{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="backdrop" on:click={close}></div>
{/if}

<!-- DRAWER -->
<div class="drawer" class:open>

  <!-- DRAWER HEADER -->
  <div class="drawer-header">
    <div class="drawer-title">
      <span class="title-accent">SLAPT</span>
      <span class="title-sep">/</span>
      <span class="title-label">Documentation</span>
    </div>
    <button class="close-btn" on:click={close} aria-label="Close docs">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </button>
  </div>

  <!-- DRAWER BODY: sidenav + content -->
  <div class="drawer-body">

    <!-- SIDENAV -->
    <nav class="doc-nav">
      {#each sections as group}
        <div class="nav-group-label">{group.group}</div>
        {#each group.items as item}
          <button
            class="nav-item"
            class:active={activeSection === item.id}
            on:click={() => scrollTo(item.id)}
          >
            <span class="nav-dot"></span>
            {item.label}
          </button>
        {/each}
      {/each}
    </nav>

    <!-- SCROLLABLE CONTENT -->
    <div class="doc-content">

      <!-- ── QUICK START ── -->
      <section id="doc-quickstart" class="doc-sec">
        <div class="sec-head">
          <span class="sec-num">01</span>
          <h2>Quick Start</h2>
        </div>
        <p>The absolute minimum to make a beat:</p>
        <pre><code><span class="kw">@genre</span> <span class="str">lofi-hiphop</span>
<span class="kw">@tempo</span> <span class="num">75</span> bpm

<span class="blk">drums</span>:
  <span class="op">kick on</span> <span class="num">1</span> <span class="op">and</span> <span class="num">3</span>
  <span class="op">snare on</span> <span class="num">2</span> <span class="op">and</span> <span class="num">4</span></code></pre>
        <p>Paste that in the editor and hit play. Everything else is layers on top.</p>
        <div class="callout tip">💡 Code is parsed automatically 400ms after you stop typing. The status dot goes green when valid. Your code is <strong>auto-saved</strong> — refreshing the page won't lose your work.</div>
      </section>

      <!-- ── FILE STRUCTURE ── -->
      <section id="doc-structure" class="doc-sec">
        <div class="sec-head"><span class="sec-num">02</span><h2>File Structure</h2></div>
        <p>Every SLAPT file follows this order:</p>
        <pre><code><span class="cmt"># 1. Directives (optional, must be first)</span>
<span class="kw">@genre</span> <span class="str">lofi-hiphop</span>
<span class="kw">@tempo</span> <span class="num">75</span> bpm
<span class="kw">@key</span> <span class="str">Am</span>
<span class="kw">@timesig</span> <span class="num">3</span>/<span class="num">4</span>

<span class="cmt"># 2. Blocks (any order, all optional)</span>
<span class="blk">atmosphere</span>:  ...
<span class="blk">drums</span>:        ...
<span class="blk">chords</span> <span class="op">using</span> <span class="str">rhodes piano</span>:  ...
<span class="blk">bass</span> <span class="op">walking the roots</span>:    ...

<span class="cmt"># 3. Sections (optional)</span>
<span class="blk">section intro</span>:  ...

<span class="cmt"># 4. Modifiers last (optional)</span>
<span class="op">make it dusty</span></code></pre>
      </section>

      <!-- ── DIRECTIVES ── -->
      <section id="doc-directives" class="doc-sec">
        <div class="sec-head"><span class="sec-num">03</span><h2>Directives</h2></div>
        <p>Start with <code>@</code> and must appear before any blocks.</p>
        <table>
          <thead><tr><th>Directive</th><th>Example</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td><code>@genre</code></td><td><code>@genre lofi-hiphop</code></td><td>Sets BPM range warning context</td></tr>
            <tr><td><code>@tempo</code></td><td><code>@tempo 75 bpm</code></td><td>Sets BPM — warns if outside genre range</td></tr>
            <tr><td><code>@key</code></td><td><code>@key Am</code></td><td>Sets key for note validation</td></tr>
            <tr><td><code>@timesig</code></td><td><code>@timesig 3/4</code></td><td>Sets time signature. Supported: 3/4, 4/4, 5/4</td></tr>
          </tbody>
        </table>
      </section>

      <!-- ── DRUMS ── -->
      <section id="doc-drums" class="doc-sec">
        <div class="sec-head"><span class="sec-num">04</span><h2>Drum Block</h2></div>
        <pre><code><span class="blk">drums</span> <span class="op">with swing</span>(<span class="num">60</span>%):
  <span class="op">kick pattern</span> [<span class="num">1</span>, <span class="num">2.75</span>, <span class="num">3</span>]
  <span class="op">kick on</span> <span class="num">1</span> <span class="op">and</span> <span class="num">3</span>
  <span class="op">snare on</span> <span class="num">2</span> <span class="op">and</span> <span class="num">4</span>
  <span class="op">snare velocity random</span>(<span class="num">0.7</span> <span class="op">to</span> <span class="num">0.9</span>)
  <span class="op">hihat closed</span> <span class="num">8</span> <span class="op">times</span>
  <span class="op">hihat open on</span> <span class="num">4</span>
  <span class="op">hihat open on</span> <span class="num">2</span> <span class="op">and</span> <span class="num">4</span>
  <span class="op">apply bitcrush</span>(<span class="str">10bit</span>)
  <span class="op">compress heavily</span></code></pre>
        <table>
          <thead><tr><th>Statement</th><th>What it does</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>kick pattern [...]</code></td><td>Decimal beat positions, all validated</td><td>—</td></tr>
            <tr><td><code>kick on 1 and 3</code></td><td>Shorthand beats</td><td>—</td></tr>
            <tr><td><code>snare on 2 and 4</code></td><td>Same as kick shorthand</td><td>no snare</td></tr>
            <tr><td><code>snare velocity random(0.7 to 0.9)</code></td><td>Per-hit velocity. Range 0.0–1.0</td><td>0.6 to 0.8</td></tr>
            <tr><td><code>hihat closed N times</code></td><td>4 = quarters, 8 = eighths, 16 = sixteenths</td><td>no hihat</td></tr>
            <tr><td><code>hihat open on 4</code></td><td>Open hihat on beat 4 (longer, brighter sound). Multiple: <code>hihat open on 2 and 4</code></td><td>no open hihat</td></tr>
            <tr><td><code>apply bitcrush(10bit)</code></td><td>BitCrusher per instrument, no bleed</td><td>off</td></tr>
            <tr><td><code>compress heavily</code></td><td>Separate compressor per instrument</td><td>off</td></tr>
          </tbody>
        </table>
        <h3>Open hihat explained</h3>
        <p>When you write <code>hihat open on 4</code>, beat 4 becomes an open hihat hit instead of a closed one — even if <code>hihat closed 8 times</code> is present. The closed grid automatically skips that position to avoid layering. This is standard drum machine behaviour.</p>
        <h3>Decimal beats explained</h3>
        <pre><code><span class="num">1</span>    = beat 1 downbeat
<span class="num">1.5</span>  = beat 1 + one 8th note  (the "and" of 1)
<span class="num">1.75</span> = beat 1 + three 16ths
<span class="num">2.75</span> = beat 2 + three 16ths  ← signature lo-fi kick position
<span class="num">3</span>    = beat 3
<span class="num">4</span>    = beat 4 (last beat of bar in 4/4)</code></pre>
      </section>

      <!-- ── CHORDS ── -->
      <section id="doc-chords" class="doc-sec">
        <div class="sec-head"><span class="sec-num">05</span><h2>Chord Block</h2></div>
        <pre><code><span class="blk">chords</span> <span class="op">using</span> <span class="str">rhodes piano</span>:
  <span class="op">progression</span> <span class="str">Am7</span> -> <span class="str">Fmaj7</span> -> <span class="str">Dm7</span> -> <span class="str">E7</span>
  <span class="op">voicing</span> <span class="str">spread</span>
  <span class="op">reverb</span>(<span class="str">medium</span>, <span class="str">dreamy</span>)
  <span class="op">tremolo</span>(<span class="str">gentle</span>, <span class="str">4Hz</span>)</code></pre>
        <p>Use <code>-&gt;</code> (two ASCII chars) to separate chords. Each chord = one bar.</p>
        <table>
          <thead><tr><th>Chord</th><th>Character</th></tr></thead>
          <tbody>
            <tr><td><code>Am7</code></td><td>Dark, moody — lo-fi staple</td></tr>
            <tr><td><code>Fmaj7</code></td><td>Warm, resolved, jazz feel</td></tr>
            <tr><td><code>Dm7</code></td><td>Melancholic, slightly tense</td></tr>
            <tr><td><code>E7</code></td><td>Dominant tension, resolves to Am</td></tr>
            <tr><td><code>Cmaj7</code></td><td>Bright, optimistic, pop feel</td></tr>
            <tr><td><code>Gmaj7</code></td><td>Open, airy</td></tr>
            <tr><td><code>Am</code> / <code>Dm</code> / <code>Em</code></td><td>Simple minor triads, no 7th</td></tr>
          </tbody>
        </table>
      </section>

      <!-- ── BASS ── -->
      <section id="doc-bass" class="doc-sec">
        <div class="sec-head"><span class="sec-num">06</span><h2>Bass Block</h2></div>
        <pre><code><span class="blk">bass</span> <span class="op">walking the roots</span>:
  <span class="op">follow chord progression</span>
  <span class="op">sound</span> <span class="str">mellow</span>
  <span class="op">filter</span> <span class="str">warm</span></code></pre>
        <p>Bass plays the root note of each chord, one octave below. Requires a chord block — no chords means no roots to follow.</p>
        <table>
          <thead><tr><th>Statement</th><th>Effect</th></tr></thead>
          <tbody>
            <tr><td><code>sound mellow</code></td><td>Soft attack, smooth tone</td></tr>
            <tr><td><code>sound gritty</code></td><td>More aggressive — good for boom-bap and techno</td></tr>
            <tr><td><code>filter warm</code></td><td>Lowpass at ~600Hz, classic lo-fi bass feel</td></tr>
          </tbody>
        </table>
      </section>

      <!-- ── ATMOSPHERE ── -->
      <section id="doc-atmosphere" class="doc-sec">
        <div class="sec-head"><span class="sec-num">07</span><h2>Atmosphere Block</h2></div>
        <pre><code><span class="blk">atmosphere</span>:
  <span class="op">vinyl crackle at</span> <span class="num">20</span>% <span class="op">volume</span>
  <span class="op">rain sounds softly in background</span>
  <span class="op">tape wobble subtle</span></code></pre>
        <p>All three are synthesized in the browser — no samples. All optional, all combinable.</p>
        <table>
          <thead><tr><th>Layer</th><th>How it works</th></tr></thead>
          <tbody>
            <tr><td><code>vinyl crackle at N%</code></td><td>2 layers: brown noise → bandpass 2200Hz (hum) + white noise bursts via random loop → highpass 3500Hz (pops). Useful range: 10–35%</td></tr>
            <tr><td><code>rain sounds softly</code></td><td>3 layers: brown → lowpass 200Hz (rumble) + brown → bandpass 700Hz (body) + pink → bandpass 1400Hz (sparkle)</td></tr>
            <tr><td><code>tape wobble subtle</code></td><td>Nudges Transport.bpm ±0.8% on a 0.3Hz sine. Felt as pitch drift, not heard as a clear effect</td></tr>
          </tbody>
        </table>
        <div class="callout tip">💡 <code>make it dusty</code> auto-creates an atmosphere block with vinyl crackle at 20% if you haven't written one.</div>
      </section>

      <!-- ── SECTIONS ── -->
      <section id="doc-sections" class="doc-sec">
        <div class="sec-head"><span class="sec-num">08</span><h2>Sections</h2></div>
        <pre><code><span class="blk">section intro</span>:
  <span class="op">only drums and atmosphere</span>
  <span class="op">fade in over</span> <span class="num">4</span> <span class="op">bars</span>

<span class="blk">section verse</span>:
  <span class="op">add chords after</span> <span class="num">4</span> <span class="op">bars</span>
  <span class="op">add bass after</span> <span class="num">4</span> <span class="op">bars</span>

<span class="blk">section chorus</span>:
  <span class="op">bring energy up</span>

<span class="blk">section outro</span>:
  <span class="op">fade out everything over</span> <span class="num">8</span> <span class="op">bars</span>
  <span class="op">keep vinyl crackle till end</span></code></pre>
        <p>Section names are free-form — <code>section drop:</code>, <code>section build:</code>, <code>section breakdown:</code> all parse correctly.</p>
      </section>

      <!-- ── MODIFIERS ── -->
      <section id="doc-modifiers" class="doc-sec">
        <div class="sec-head"><span class="sec-num">09</span><h2>Global Modifiers</h2></div>
        <p>Go at the very end. Adjust the interpretation of everything above. Stack freely.</p>
        <div class="mod-grid">
          <div class="mod-card">
            <div class="mod-name">make it groovy</div>
            <div class="mod-desc">Swing ≥ 60%, humanization, ghost notes</div>
          </div>
          <div class="mod-card">
            <div class="mod-name">make it dusty</div>
            <div class="mod-desc">Bitcrush + vinyl crackle ≥ 20% + rolled-off highs. Auto-creates atmosphere if absent.</div>
          </div>
          <div class="mod-card">
            <div class="mod-name">add some laziness</div>
            <div class="mod-desc">Swing ≥ 40%, pushed-back timing, lower velocity</div>
          </div>
          <div class="mod-card">
            <div class="mod-name">bring energy up</div>
            <div class="mod-desc">Higher velocity, drum fills every 4 bars</div>
          </div>
        </div>
        <pre><code><span class="cmt"># Stacking is valid and encouraged</span>
<span class="op">make it dusty</span>
<span class="op">add some laziness</span></code></pre>
      </section>

      <!-- ── KEYS ── -->
      <section id="doc-keys" class="doc-sec">
        <div class="sec-head"><span class="sec-num">10</span><h2>Supported Keys</h2></div>
        <table>
          <thead><tr><th>Key</th><th>Scale Notes</th><th>Flavour</th></tr></thead>
          <tbody>
            <tr><td><code>Am</code></td><td>A B C D E F G</td><td>Dark, melancholic — the lo-fi default</td></tr>
            <tr><td><code>Cm</code></td><td>C D Eb F G Ab Bb</td><td>Brooding, cinematic</td></tr>
            <tr><td><code>Dm</code></td><td>D E F G A Bb C</td><td>Jazz-dark, moody</td></tr>
            <tr><td><code>Em</code></td><td>E F# G A B C D</td><td>Tense, a little brighter</td></tr>
            <tr><td><code>F#m</code></td><td>F# G# A B C# D E</td><td>Ethereal, floaty — great for ambient</td></tr>
            <tr><td><code>Ebm</code></td><td>Eb F Gb Ab Bb B Db</td><td>Deep, heavy — suits trap/dnb</td></tr>
            <tr><td><code>C</code></td><td>C D E F G A B</td><td>Clean, bright major</td></tr>
            <tr><td><code>G</code></td><td>G A B C D E F#</td><td>Open, pastoral</td></tr>
            <tr><td><code>F</code></td><td>F G A Bb C D E</td><td>Warm major</td></tr>
            <tr><td><code>Bb</code></td><td>Bb C D Eb F G A</td><td>Jazzy, soulful</td></tr>
            <tr><td><code>Ab</code></td><td>Ab Bb C Db Eb F G</td><td>Rich, lush — good for neo-soul</td></tr>
          </tbody>
        </table>
        <div class="callout warn">⚠ Notes outside the key trigger a <code>NOTE_OUT_OF_SCALE</code> warning — the track still plays.</div>
      </section>

      <!-- ── GENRES ── -->
      <section id="doc-genres" class="doc-sec">
        <div class="sec-head"><span class="sec-num">11</span><h2>Supported Genres</h2></div>
        <table>
          <thead><tr><th>Genre</th><th>BPM Range</th></tr></thead>
          <tbody>
            <tr><td><code>lofi-hiphop</code></td><td>60–90</td></tr>
            <tr><td><code>boom-bap</code></td><td>80–100</td></tr>
            <tr><td><code>house</code></td><td>120–135</td></tr>
            <tr><td><code>techno</code></td><td>130–150</td></tr>
            <tr><td><code>dnb</code></td><td>160–180</td></tr>
            <tr><td><code>ambient</code></td><td>60–90</td></tr>
            <tr><td><code>trap</code></td><td>130–170</td></tr>
          </tbody>
        </table>
        <p>BPM outside the range fires a <code>TEMPO_GENRE_MISMATCH</code> warning — the track still plays at exactly your tempo.</p>
      </section>

      <!-- ── TIME SIGNATURES ── -->
      <section id="doc-timesig" class="doc-sec">
        <div class="sec-head"><span class="sec-num">12</span><h2>Time Signatures</h2></div>
        <p>SLAPT defaults to 4/4. To change it, add <code>@timesig</code> before your blocks:</p>
        <pre><code><span class="kw">@timesig</span> <span class="num">3</span>/<span class="num">4</span>   <span class="cmt"># waltz / jazz waltz</span>
<span class="kw">@timesig</span> <span class="num">5</span>/<span class="num">4</span>   <span class="cmt"># Dave Brubeck / Radiohead territory</span>
<span class="kw">@timesig</span> <span class="num">4</span>/<span class="num">4</span>   <span class="cmt"># explicit default, same as not writing it</span></code></pre>
        <table>
          <thead><tr><th>Time sig</th><th>Beats per bar</th><th>Beat validation range</th></tr></thead>
          <tbody>
            <tr><td><code>3/4</code></td><td>3</td><td>Beats 1–3 valid. Beat 4 triggers BEAT_OUT_OF_RANGE.</td></tr>
            <tr><td><code>4/4</code></td><td>4</td><td>Beats 1–4 valid (default)</td></tr>
            <tr><td><code>5/4</code></td><td>5</td><td>Beats 1–5 valid</td></tr>
          </tbody>
        </table>
        <div class="callout tip">💡 In 3/4 the bar timeline shows 3 beats instead of 4. In 5/4 you get 5 — great for off-kilter grooves.</div>
        <h3>3/4 drum example</h3>
        <pre><code><span class="kw">@timesig</span> <span class="num">3</span>/<span class="num">4</span>

<span class="blk">drums</span>:
  <span class="op">kick on</span> <span class="num">1</span>
  <span class="op">snare on</span> <span class="num">2</span> <span class="op">and</span> <span class="num">3</span>
  <span class="op">hihat closed</span> <span class="num">6</span> <span class="op">times</span></code></pre>
        <h3>5/4 drum example</h3>
        <pre><code><span class="kw">@timesig</span> <span class="num">5</span>/<span class="num">4</span>

<span class="blk">drums</span>:
  <span class="op">kick on</span> <span class="num">1</span> <span class="op">and</span> <span class="num">4</span>
  <span class="op">snare on</span> <span class="num">2</span> <span class="op">and</span> <span class="num">5</span>
  <span class="op">hihat closed</span> <span class="num">10</span> <span class="op">times</span></code></pre>
      </section>

      <!-- ── MIDI EXPORT ── -->
      <section id="doc-midi" class="doc-sec">
        <div class="sec-head"><span class="sec-num">13</span><h2>MIDI Export</h2></div>
        <p>Click the <strong>MIDI</strong> button in the top bar to download a standard <code>.mid</code> file. You can import it into any DAW — Ableton, Logic, FL Studio, GarageBand, etc.</p>
        <table>
          <thead><tr><th>Track</th><th>MIDI Channel</th><th>What's exported</th></tr></thead>
          <tbody>
            <tr><td>Drums</td><td>Channel 10 (GM standard)</td><td>Kick, snare, closed hihat, open hihat — all hits with velocity</td></tr>
            <tr><td>Chords</td><td>Channel 1</td><td>All chord voicings for 4 bars</td></tr>
            <tr><td>Bass</td><td>Channel 2</td><td>Root note per chord for 4 bars</td></tr>
          </tbody>
        </table>
        <div class="callout tip">💡 Atmosphere (vinyl crackle, rain, tape wobble) is synthesis-only — it doesn't export to MIDI. Everything else does.</div>
        <div class="callout warn">⚠ The MIDI button is disabled while there are parse errors. Fix your code first.</div>
        <h3>GM drum note map used</h3>
        <table>
          <thead><tr><th>Drum</th><th>MIDI note</th><th>GM name</th></tr></thead>
          <tbody>
            <tr><td>Kick</td><td>36</td><td>Bass Drum 1</td></tr>
            <tr><td>Snare</td><td>38</td><td>Acoustic Snare</td></tr>
            <tr><td>Hihat closed</td><td>42</td><td>Closed Hi-Hat</td></tr>
            <tr><td>Hihat open</td><td>46</td><td>Open Hi-Hat</td></tr>
          </tbody>
        </table>
      </section>

      <!-- ── AUTO-SAVE ── -->
      <section id="doc-persist" class="doc-sec">
        <div class="sec-head"><span class="sec-num">14</span><h2>Auto-Save</h2></div>
        <p>Your code is saved to <code>localStorage</code> every time you type. Refreshing or closing the tab preserves your work automatically — no manual save needed.</p>
        <p>The key used is <code>slapt_code_v1</code>. Data stays on your device and is never sent anywhere beyond the local parser service.</p>
        <div class="callout tip">💡 If you want to start fresh, open the browser console and run <code>localStorage.removeItem("slapt_code_v1")</code>, then refresh.</div>
      </section>

      <!-- ── ERRORS ── -->
      <section id="doc-errors" class="doc-sec">
        <div class="sec-head"><span class="sec-num">15</span><h2>Errors &amp; Warnings</h2></div>
        <p><strong>Errors</strong> stop playback. <strong>Warnings</strong> let the track play but flag something off.</p>

        <h3>BEAT_OUT_OF_RANGE <span class="badge err">error</span></h3>
        <pre><code><span class="op">kick pattern</span> [<span class="num">1</span>, <span class="num">2.75</span>, <span class="num">5</span>]
<span class="cmt">→ Beat 5 doesn't exist in 4/4 time</span>
<span class="cmt">  context: "kick pattern"</span></code></pre>
        <p>Also checked for <code>snare on</code> and <code>hihat open on</code>. Beat range adjusts automatically when you use <code>@timesig</code>.</p>

        <h3>TIMESIG_UNSUPPORTED <span class="badge err">error</span></h3>
        <p>The requested time signature is not yet implemented. Use 3/4, 4/4, or 5/4.</p>

        <h3>TEMPO_GENRE_MISMATCH <span class="badge warn">warning</span></h3>
        <p>BPM is outside the genre's typical range. Track plays at your exact tempo regardless.</p>

        <h3>NOTE_OUT_OF_SCALE <span class="badge warn">warning</span></h3>
        <p>A chord note isn't in the declared key's scale. The note still plays — SLAPT doesn't enforce music theory.</p>
      </section>

      <!-- ── ASCII RULE ── -->
      <section id="doc-ascii" class="doc-sec">
        <div class="sec-head"><span class="sec-num">16</span><h2>ASCII Rule</h2></div>
        <p>SLAPT only accepts ASCII characters. Pasting from Google Docs, Notes, or Word often breaks things:</p>
        <table>
          <thead><tr><th>Don't use</th><th>Use instead</th></tr></thead>
          <tbody>
            <tr><td>→ (Unicode arrow)</td><td><code>-&gt;</code> (dash + greater-than)</td></tr>
            <tr><td>— (em dash)</td><td><code>--</code> (two hyphens)</td></tr>
            <tr><td>" " (smart quotes)</td><td><code>" "</code> (straight quotes)</td></tr>
            <tr><td>♭ ♮ (music symbols)</td><td><code>b</code> for flat</td></tr>
            <tr><td><code>gritty-sub</code></td><td><code>gritty</code> (hyphen breaks identifier)</td></tr>
            <tr><td>Title line before @genre</td><td>Start file with <code>@genre</code> or nothing</td></tr>
          </tbody>
        </table>
        <div class="callout err">❌ The most common crash: a <code>LEXER_ERROR unexpected character at offset 0</code> almost always means there's a Unicode character or a non-@genre line at the very top of the file.</div>
      </section>

      <!-- ── CHEAT SHEET ── -->
      <section id="doc-cheatsheet" class="doc-sec">
        <div class="sec-head"><span class="sec-num">17</span><h2>Cheat Sheet</h2></div>
        <div class="cheatsheet">
          <div class="cs-row"><code>@genre lofi-hiphop</code><span>Set genre context</span></div>
          <div class="cs-row"><code>@tempo 75 bpm</code><span>Set BPM</span></div>
          <div class="cs-row"><code>@key Am</code><span>Set key (now includes F#m, Bb, Ab, Ebm)</span></div>
          <div class="cs-row"><code>@timesig 3/4</code><span>3/4 or 5/4 — changes beat validation range</span></div>
          <div class="cs-row cs-group">Drums</div>
          <div class="cs-row"><code>drums with swing(60%):</code><span>Open drum block with shuffle</span></div>
          <div class="cs-row"><code>kick on 1 and 3</code><span>Kick on beats</span></div>
          <div class="cs-row"><code>kick pattern [1, 2.75, 3]</code><span>Kick at decimal positions</span></div>
          <div class="cs-row"><code>snare on 2 and 4</code><span>Snare on beats</span></div>
          <div class="cs-row"><code>snare velocity random(0.7 to 0.9)</code><span>Random velocity per hit</span></div>
          <div class="cs-row"><code>hihat closed 8 times</code><span>Closed hihat N per bar</span></div>
          <div class="cs-row"><code>hihat open on 4</code><span>Open hihat on beat 4 (or: on 2 and 4)</span></div>
          <div class="cs-row"><code>apply bitcrush(10bit)</code><span>BitCrusher on drums</span></div>
          <div class="cs-row"><code>compress heavily</code><span>Compressor on kick + snare</span></div>
          <div class="cs-row cs-group">Chords</div>
          <div class="cs-row"><code>chords using rhodes piano:</code><span>Open chord block</span></div>
          <div class="cs-row"><code>progression Am7 -&gt; Fmaj7</code><span>Chord progression (ASCII ->)</span></div>
          <div class="cs-row"><code>reverb(medium, dreamy)</code><span>Reverb on chords</span></div>
          <div class="cs-row"><code>tremolo(gentle, 4Hz)</code><span>Tremolo on chords</span></div>
          <div class="cs-row cs-group">Bass</div>
          <div class="cs-row"><code>bass walking the roots:</code><span>Open bass block</span></div>
          <div class="cs-row"><code>follow chord progression</code><span>Bass follows chord roots</span></div>
          <div class="cs-row"><code>sound mellow</code><span>Bass character</span></div>
          <div class="cs-row"><code>filter warm</code><span>Lowpass on bass</span></div>
          <div class="cs-row cs-group">Atmosphere</div>
          <div class="cs-row"><code>vinyl crackle at 20% volume</code><span>2-layer crackle</span></div>
          <div class="cs-row"><code>rain sounds softly in background</code><span>3-layer rain</span></div>
          <div class="cs-row"><code>tape wobble subtle</code><span>BPM flutter</span></div>
          <div class="cs-row cs-group">Modifiers</div>
          <div class="cs-row"><code>make it groovy</code><span>Swing + humanize</span></div>
          <div class="cs-row"><code>make it dusty</code><span>Bitcrush + crackle</span></div>
          <div class="cs-row"><code>add some laziness</code><span>Pushed timing</span></div>
          <div class="cs-row"><code>bring energy up</code><span>Velocity + fills</span></div>
          <div class="cs-row cs-group">Editor</div>
          <div class="cs-row"><code>Copy icon (top-right)</code><span>Copy entire code to clipboard</span></div>
          <div class="cs-row"><code>MIDI button (top bar)</code><span>Download .mid — works in any DAW</span></div>
          <div class="cs-row"><code>Auto-save</code><span>Code persists through page refresh</span></div>
        </div>
      </section>

      <!-- ── EXAMPLE: LOFI ── -->
      <section id="doc-ex-lofi" class="doc-sec">
        <div class="sec-head"><span class="sec-num">18</span><h2>Example — Lo-Fi Hip-Hop</h2></div>
        <p>The classic midnight study session. Features open hihat on beat 4 for that smoky jazz feel.</p>
        <pre><code><span class="kw">@genre</span> <span class="str">lofi-hiphop</span>
<span class="kw">@tempo</span> <span class="num">72</span> bpm
<span class="kw">@key</span> <span class="str">Am</span>

<span class="blk">atmosphere</span>:
  <span class="op">vinyl crackle at</span> <span class="num">20</span>% <span class="op">volume</span>
  <span class="op">rain sounds softly in background</span>

<span class="blk">drums</span> <span class="op">with swing</span>(<span class="num">60</span>%):
  <span class="op">kick pattern</span> [<span class="num">1</span>, <span class="num">2.75</span>, <span class="num">3</span>]
  <span class="op">snare on</span> <span class="num">2</span> <span class="op">and</span> <span class="num">4</span>
  <span class="op">snare velocity random</span>(<span class="num">0.7</span> <span class="op">to</span> <span class="num">0.9</span>)
  <span class="op">hihat closed</span> <span class="num">8</span> <span class="op">times</span>
  <span class="op">hihat open on</span> <span class="num">4</span>
  <span class="op">apply bitcrush</span>(<span class="str">10bit</span>)
  <span class="op">compress heavily</span>

<span class="blk">chords</span> <span class="op">using</span> <span class="str">rhodes piano</span>:
  <span class="op">progression</span> <span class="str">Am7</span> -> <span class="str">Fmaj7</span> -> <span class="str">Dm7</span> -> <span class="str">E7</span>
  <span class="op">voicing</span> <span class="str">spread</span>
  <span class="op">reverb</span>(<span class="str">medium</span>, <span class="str">dreamy</span>)
  <span class="op">tremolo</span>(<span class="str">gentle</span>, <span class="str">4Hz</span>)

<span class="blk">bass</span> <span class="op">walking the roots</span>:
  <span class="op">follow chord progression</span>
  <span class="op">sound</span> <span class="str">mellow</span>
  <span class="op">filter</span> <span class="str">warm</span>

<span class="blk">section intro</span>:
  <span class="op">only drums and atmosphere</span>
  <span class="op">fade in over</span> <span class="num">4</span> <span class="op">bars</span>

<span class="blk">section outro</span>:
  <span class="op">fade out everything over</span> <span class="num">8</span> <span class="op">bars</span>

<span class="op">make it dusty</span></code></pre>
      </section>

      <!-- ── EXAMPLE: BOOM BAP ── -->
      <section id="doc-ex-boombap" class="doc-sec">
        <div class="sec-head"><span class="sec-num">19</span><h2>Example — Boom Bap</h2></div>
        <pre><code><span class="kw">@genre</span> <span class="str">boom-bap</span>
<span class="kw">@tempo</span> <span class="num">90</span> bpm
<span class="kw">@key</span> <span class="str">Dm</span>

<span class="blk">drums</span>:
  <span class="op">kick on</span> <span class="num">1</span> <span class="op">and</span> <span class="num">3</span>
  <span class="op">snare on</span> <span class="num">2</span> <span class="op">and</span> <span class="num">4</span>
  <span class="op">snare velocity random</span>(<span class="num">0.6</span> <span class="op">to</span> <span class="num">1.0</span>)
  <span class="op">hihat closed</span> <span class="num">8</span> <span class="op">times</span>
  <span class="op">hihat open on</span> <span class="num">2</span> <span class="op">and</span> <span class="num">4</span>

<span class="blk">chords</span> <span class="op">using</span> <span class="str">rhodes piano</span>:
  <span class="op">progression</span> <span class="str">Dm7</span> -> <span class="str">Cmaj7</span> -> <span class="str">Am7</span> -> <span class="str">Gmaj7</span>
  <span class="op">voicing</span> <span class="str">spread</span>

<span class="blk">bass</span> <span class="op">walking the roots</span>:
  <span class="op">follow chord progression</span>

<span class="op">bring energy up</span></code></pre>
      </section>

      <!-- ── EXAMPLE: TECHNO ── -->
      <section id="doc-ex-techno" class="doc-sec">
        <div class="sec-head"><span class="sec-num">20</span><h2>Example — Techno</h2></div>
        <pre><code><span class="kw">@genre</span> <span class="str">techno</span>
<span class="kw">@tempo</span> <span class="num">134</span> bpm
<span class="kw">@key</span> <span class="str">Em</span>

<span class="blk">atmosphere</span>:
  <span class="op">vinyl crackle at</span> <span class="num">10</span>% <span class="op">volume</span>
  <span class="op">tape wobble subtle</span>

<span class="blk">drums</span> <span class="op">with swing</span>(<span class="num">15</span>%):
  <span class="op">kick on</span> <span class="num">1</span> <span class="op">and</span> <span class="num">2</span> <span class="op">and</span> <span class="num">3</span> <span class="op">and</span> <span class="num">4</span>
  <span class="op">snare on</span> <span class="num">2</span> <span class="op">and</span> <span class="num">4</span>
  <span class="op">snare velocity random</span>(<span class="num">0.9</span> <span class="op">to</span> <span class="num">1.0</span>)
  <span class="op">hihat</span> <span class="num">16</span> <span class="op">times</span>
  <span class="op">apply bitcrush</span>(<span class="str">10bit</span>)
  <span class="op">compress heavily</span>

<span class="blk">chords</span> <span class="op">using</span> <span class="str">rhodes piano</span>:
  <span class="op">progression</span> <span class="str">Em</span> -> <span class="str">Dm</span> -> <span class="str">Am</span> -> <span class="str">Em</span>
  <span class="op">reverb</span>(<span class="str">short</span>, <span class="str">metallic</span>)

<span class="blk">bass</span> <span class="op">walking the roots</span>:
  <span class="op">follow chord progression</span>
  <span class="op">sound</span> <span class="str">gritty</span>
  <span class="op">filter</span> <span class="str">warm</span>

<span class="op">bring energy up</span></code></pre>
      </section>

      <!-- ── EXAMPLE: 3/4 WALTZ ── -->
      <section id="doc-ex-waltz" class="doc-sec">
        <div class="sec-head"><span class="sec-num">21</span><h2>Example — 3/4 Waltz Beat</h2></div>
        <p>Moody jazz waltz. Classic 1-2-3 with an open hat on the 3.</p>
        <pre><code><span class="kw">@genre</span> <span class="str">lofi-hiphop</span>
<span class="kw">@tempo</span> <span class="num">80</span> bpm
<span class="kw">@key</span> <span class="str">F#m</span>
<span class="kw">@timesig</span> <span class="num">3</span>/<span class="num">4</span>

<span class="blk">atmosphere</span>:
  <span class="op">vinyl crackle at</span> <span class="num">15</span>% <span class="op">volume</span>

<span class="blk">drums</span> <span class="op">with swing</span>(<span class="num">55</span>%):
  <span class="op">kick on</span> <span class="num">1</span>
  <span class="op">snare on</span> <span class="num">2</span>
  <span class="op">hihat closed</span> <span class="num">6</span> <span class="op">times</span>
  <span class="op">hihat open on</span> <span class="num">3</span>

<span class="blk">chords</span> <span class="op">using</span> <span class="str">rhodes piano</span>:
  <span class="op">progression</span> <span class="str">Am7</span> -> <span class="str">Fmaj7</span> -> <span class="str">Em</span>
  <span class="op">voicing</span> <span class="str">spread</span>
  <span class="op">reverb</span>(<span class="str">medium</span>, <span class="str">dreamy</span>)

<span class="blk">bass</span> <span class="op">walking the roots</span>:
  <span class="op">follow chord progression</span>
  <span class="op">sound</span> <span class="str">mellow</span>

<span class="op">make it dusty</span></code></pre>
      </section>

      <!-- ── EXAMPLE: 5/4 ODD TIME ── -->
      <section id="doc-ex-five" class="doc-sec">
        <div class="sec-head"><span class="sec-num">22</span><h2>Example — 5/4 Odd Time</h2></div>
        <p>That restless, slightly-off feeling. Group as 3+2 — kick on 1 and 4, snare on 2 and 5.</p>
        <pre><code><span class="kw">@genre</span> <span class="str">lofi-hiphop</span>
<span class="kw">@tempo</span> <span class="num">78</span> bpm
<span class="kw">@key</span> <span class="str">Bb</span>
<span class="kw">@timesig</span> <span class="num">5</span>/<span class="num">4</span>

<span class="blk">drums</span> <span class="op">with swing</span>(<span class="num">40</span>%):
  <span class="op">kick on</span> <span class="num">1</span> <span class="op">and</span> <span class="num">4</span>
  <span class="op">snare on</span> <span class="num">2</span> <span class="op">and</span> <span class="num">5</span>
  <span class="op">hihat closed</span> <span class="num">10</span> <span class="op">times</span>
  <span class="op">hihat open on</span> <span class="num">3</span>

<span class="blk">atmosphere</span>:
  <span class="op">tape wobble subtle</span>
  <span class="op">vinyl crackle at</span> <span class="num">10</span>% <span class="op">volume</span>

<span class="blk">chords</span> <span class="op">using</span> <span class="str">rhodes piano</span>:
  <span class="op">progression</span> <span class="str">Dm7</span> -> <span class="str">Am7</span> -> <span class="str">Cmaj7</span>
  <span class="op">reverb</span>(<span class="str">medium</span>, <span class="str">dreamy</span>)

<span class="op">add some laziness</span></code></pre>
      </section>

      <!-- ── EXAMPLE: MINIMAL ── -->
      <section id="doc-ex-minimal" class="doc-sec">
        <div class="sec-head"><span class="sec-num">23</span><h2>Example — Minimal Beat</h2></div>
        <p>Just drums. The starting point for every track.</p>
        <pre><code><span class="kw">@genre</span> <span class="str">lofi-hiphop</span>
<span class="kw">@tempo</span> <span class="num">75</span> bpm

<span class="blk">drums</span> <span class="op">with swing</span>(<span class="num">60</span>%):
  <span class="op">kick on</span> <span class="num">1</span> <span class="op">and</span> <span class="num">3</span>
  <span class="op">snare on</span> <span class="num">2</span> <span class="op">and</span> <span class="num">4</span>
  <span class="op">hihat</span> <span class="num">8</span> <span class="op">times</span></code></pre>
        <div class="callout tip">💡 Start here. Get kick and snare right first. Then add atmosphere. Then chords. Then bass. Layering gradually is how you stay sane.</div>
      </section>

    </div><!-- end doc-content -->
  </div><!-- end drawer-body -->
</div><!-- end drawer -->

<style>
  :root {
    --doc-bg:      #0e0e10;
    --doc-bg2:     #141416;
    --doc-bg3:     #1a1a1e;
    --doc-bg4:     #222228;
    --doc-border:  #2a2a32;
    --doc-border2: #333340;
    --doc-text:    #e8e6e0;
    --doc-text2:   #9b9890;
    --doc-text3:   #5a5856;
    --doc-accent:  #c8a96e;
    --doc-accent2: #e8c980;
    --doc-green:   #6bcf7f;
    --doc-orange:  #e8834a;
    --doc-red:     #e85a5a;
    --doc-blue:    #6ab0e8;
  }

  .backdrop {
    position: fixed; inset: 0; z-index: 900;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(3px);
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .drawer {
    position: fixed;
    top: 0; right: 0; bottom: 0;
    z-index: 901;
    width: min(860px, 92vw);
    background: var(--doc-bg);
    border-left: 1px solid var(--doc-border);
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.32, 0, 0.15, 1);
    box-shadow: -20px 0 60px rgba(0,0,0,0.5);
  }
  .drawer.open { transform: translateX(0); }

  .drawer-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px;
    height: 54px;
    border-bottom: 1px solid var(--doc-border);
    background: var(--doc-bg2);
    flex-shrink: 0;
  }
  .drawer-title {
    display: flex; align-items: center; gap: 8px;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
  }
  .title-accent { color: var(--doc-accent2); font-weight: 700; letter-spacing: 0.05em; }
  .title-sep { color: var(--doc-text3); }
  .title-label { color: var(--doc-text2); }
  .close-btn {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    background: var(--doc-bg3);
    border: 1px solid var(--doc-border);
    border-radius: 6px;
    color: var(--doc-text3);
    cursor: pointer;
    transition: all 0.15s;
  }
  .close-btn:hover { border-color: var(--doc-accent); color: var(--doc-accent2); background: var(--doc-bg4); }

  .drawer-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .doc-nav {
    width: 200px;
    flex-shrink: 0;
    background: var(--doc-bg2);
    border-right: 1px solid var(--doc-border);
    overflow-y: auto;
    padding: 16px 0 40px;
  }
  .nav-group-label {
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--doc-text3);
    padding: 14px 16px 5px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 7px;
    width: 100%; padding: 6px 16px;
    background: none; border: none; border-left: 2px solid transparent;
    color: var(--doc-text2);
    font-size: 12.5px;
    font-family: 'DM Sans', sans-serif;
    text-align: left; cursor: pointer;
    transition: all 0.12s;
  }
  .nav-item:hover { color: var(--doc-text); background: var(--doc-bg3); border-left-color: var(--doc-border2); }
  .nav-item.active { color: var(--doc-accent2); background: rgba(200,169,110,0.07); border-left-color: var(--doc-accent); }
  .nav-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; opacity: 0.5; flex-shrink: 0; }

  .doc-content {
    flex: 1;
    overflow-y: auto;
    padding: 32px 36px 80px;
  }
  .doc-content::-webkit-scrollbar { width: 5px; }
  .doc-content::-webkit-scrollbar-track { background: var(--doc-bg); }
  .doc-content::-webkit-scrollbar-thumb { background: var(--doc-border2); border-radius: 3px; }

  .doc-sec {
    margin-bottom: 56px;
    scroll-margin-top: 20px;
  }
  .sec-head {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 18px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--doc-border);
  }
  .sec-num {
    font-family: 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 0.05em;
    color: var(--doc-accent); opacity: 0.7;
  }
  h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px; letter-spacing: 0.04em;
    color: var(--doc-text);
  }
  h3 {
    font-family: 'Space Mono', monospace;
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--doc-accent2);
    margin: 24px 0 10px;
  }
  p { color: var(--doc-text2); margin-bottom: 12px; font-size: 14px; line-height: 1.65; }
  p:last-child { margin-bottom: 0; }
  strong { color: var(--doc-text); }

  pre {
    background: var(--doc-bg2);
    border: 1px solid var(--doc-border);
    border-radius: 8px;
    padding: 14px 16px;
    overflow-x: auto;
    margin: 10px 0 16px;
  }
  code {
    font-family: 'Space Mono', monospace;
    font-size: 12px; line-height: 1.65;
    color: var(--doc-text);
  }
  p code, td code {
    background: var(--doc-bg3);
    border: 1px solid var(--doc-border);
    padding: 1px 5px; border-radius: 3px;
    font-size: 11.5px; color: var(--doc-accent2);
    font-family: 'Space Mono', monospace;
  }
  .kw  { color: #c8a96e; }
  .str { color: #6bcf7f; }
  .num { color: #6ab0e8; }
  .cmt { color: #4a4a56; font-style: italic; }
  .blk { color: #e8c980; font-weight: 700; }
  .op  { color: #b8b0a0; }

  table { width: 100%; border-collapse: collapse; margin: 10px 0 16px; }
  th {
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--doc-text3); text-align: left;
    padding: 8px 12px; border-bottom: 1px solid var(--doc-border);
    background: var(--doc-bg2);
  }
  td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--doc-border);
    color: var(--doc-text2); font-size: 13px; vertical-align: top;
  }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--doc-bg3); }

  .callout {
    padding: 10px 14px; border-radius: 6px;
    border-left: 3px solid; margin: 12px 0;
    font-size: 13px; color: var(--doc-text2); line-height: 1.55;
  }
  .callout.tip  { background: rgba(107,207,127,0.05); border-color: #6bcf7f; }
  .callout.warn { background: rgba(232,131,74,0.05);  border-color: #e8834a; }
  .callout.err  { background: rgba(232,90,90,0.05);   border-color: #e85a5a; }

  .badge {
    display: inline-block;
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 2px 6px; border-radius: 3px; margin-left: 6px; vertical-align: middle;
  }
  .badge.err  { background: rgba(232,90,90,0.15);  color: #e85a5a; }
  .badge.warn { background: rgba(232,131,74,0.15); color: #e8834a; }

  .mod-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 12px 0; }
  .mod-card {
    background: var(--doc-bg3);
    border: 1px solid var(--doc-border);
    border-radius: 7px; padding: 14px;
  }
  .mod-name { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--doc-accent2); margin-bottom: 5px; }
  .mod-desc { font-size: 12.5px; color: var(--doc-text2); line-height: 1.5; }

  .cheatsheet { background: var(--doc-bg2); border: 1px solid var(--doc-border); border-radius: 8px; overflow: hidden; }
  .cs-row {
    display: flex; align-items: baseline; gap: 12px;
    padding: 7px 14px; border-bottom: 1px solid var(--doc-border);
    font-size: 12.5px;
  }
  .cs-row:last-child { border-bottom: none; }
  .cs-row code { flex: 0 0 auto; color: #6bcf7f; font-size: 11.5px; background: none; border: none; padding: 0; }
  .cs-row span { color: var(--doc-text3); flex: 1; }
  .cs-group {
    background: var(--doc-bg3);
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--doc-text3); padding: 8px 14px;
  }

  @media (max-width: 600px) {
    .doc-nav { display: none; }
    .doc-content { padding: 24px 20px 60px; }
    .mod-grid { grid-template-columns: 1fr; }
    .drawer { width: 100vw; }
  }
</style>