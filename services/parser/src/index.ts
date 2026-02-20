import express from "express";
import cors from "cors";
import { SlaptLexer } from "./lexer";
import { parser } from "./parser";
import { validateTempo, validateBeat } from "./errors";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.post("/api/parse", (req, res) => {
  const { code } = req.body as { code?: unknown };

  if (typeof code !== "string") {
    return res.status(400).json({ error: "code must be a string" });
  }

  const lexResult = SlaptLexer.tokenize(code);

  const errors: object[]   = [];
  const warnings: object[] = [];

  for (const lexError of lexResult.errors) {
    errors.push({
      code: "LEXER_ERROR",
      message: lexError.message,
      line: lexError.line,
      column: lexError.column,
      suggestions: ["Check your syntax near this location"],
    });
  }

  parser.input = lexResult.tokens;
  parser.program();

  for (const parseError of parser.errors) {
    errors.push({
      code: "PARSE_ERROR",
      message: parseError.message,
      line: parseError.token?.startLine,
      column: parseError.token?.startColumn,
      suggestions: ["Check your syntax near this location"],
    });
  }

  // ── Validation ─────────────────────────────────────────────────────────────

  const genreMatch = code.match(/@genre\s+(\S+)/);
  const tempoMatch = code.match(/@tempo\s+(\d+(?:\.\d+)?)\s+bpm/i);
  const genre  = genreMatch?.[1];
  const tempo  = tempoMatch ? parseFloat(tempoMatch[1]) : undefined;

  if (genre && tempo) {
    const tempoWarning = validateTempo(tempo, genre);
    if (tempoWarning) warnings.push(tempoWarning);
  }

  // FIX: validate beats from "kick on", "kick pattern [...]", and "snare on"
  const kickOnMatches = code.matchAll(/kick\s+on\s+([\d.]+(?:\s+and\s+[\d.]+)*)/gi);
  for (const match of kickOnMatches) {
    for (const beatStr of match[1].split(/\s+and\s+/i)) {
      const beat = parseFloat(beatStr.trim());
      const beatError = validateBeat(beat);
      if (beatError) errors.push({ ...beatError, context: "kick on" });
    }
  }

  const kickPatternMatches = code.matchAll(/kick\s+pattern\s+\[([\d.,\s]+)\]/gi);
  for (const match of kickPatternMatches) {
    for (const beatStr of match[1].split(",")) {
      const beat = parseFloat(beatStr.trim());
      if (!isNaN(beat)) {
        const beatError = validateBeat(beat);
        if (beatError) errors.push({ ...beatError, context: "kick pattern" });
      }
    }
  }

  const snareOnMatches = code.matchAll(/snare\s+on\s+([\d.]+(?:\s+and\s+[\d.]+)*)/gi);
  for (const match of snareOnMatches) {
    for (const beatStr of match[1].split(/\s+and\s+/i)) {
      const beat = parseFloat(beatStr.trim());
      const beatError = validateBeat(beat);
      if (beatError) errors.push({ ...beatError, context: "snare on" });
    }
  }

  // ── Tokens ─────────────────────────────────────────────────────────────────

  const tokens = lexResult.tokens.map((t) => ({
    tokenType:   t.tokenType.name,
    image:       t.image,
    startLine:   t.startLine,
    startColumn: t.startColumn,
  }));

  // ── Program ────────────────────────────────────────────────────────────────

  let program = null;
  if (errors.length === 0) {
    try {
      program = buildProgramFromCode(code);
    } catch (e) {
      // non-fatal
    }
  }

  res.json({
    tokens,
    errors,
    warnings,
    success: errors.length === 0,
    program,
  });
});

function buildProgramFromCode(code: string): object {
  const genreMatch = code.match(/@genre\s+(\S+)/);
  const tempoMatch = code.match(/@tempo\s+(\d+(?:\.\d+)?)\s+bpm/i);
  const keyMatch   = code.match(/@key\s+(\S+)/);

  const genre = genreMatch?.[1] ?? "lofi-hiphop";
  const tempo = tempoMatch ? parseFloat(tempoMatch[1]) : 75;
  const key   = keyMatch?.[1] ?? "Am";

  // ── Drums ───────────────────────────────────────────────────────────────────
  let drums = null;
  if (/drums/i.test(code)) {
    const swingMatch = code.match(/swing\((\d+)%\)/);
    const swing = swingMatch ? parseInt(swingMatch[1]) : 0;

    let kick: number[] = [];
    let snare: number[] = [];

    const kickPatternMatch = code.match(/kick\s+pattern\s+\[([\d.,\s]+)\]/);
    const kickOnMatch = code.match(/kick\s+on\s+([\d.]+(?:\s+and\s+[\d.]+)*)/i);

    if (kickPatternMatch) {
      kick = kickPatternMatch[1]
        .split(",")
        .map((n) => parseFloat(n.trim()))
        .filter((n) => !isNaN(n));
    } else if (kickOnMatch) {
      kick = kickOnMatch[1]
        .split(/\s+and\s+/i)
        .map((n) => parseFloat(n.trim()))
        .filter((n) => !isNaN(n));
    }

    const snareOnMatch = code.match(/snare\s+on\s+([\d.]+(?:\s+and\s+[\d.]+)*)/i);
    if (snareOnMatch) {
      snare = snareOnMatch[1]
        .split(/\s+and\s+/i)
        .map((n) => parseFloat(n.trim()))
        .filter((n) => !isNaN(n));
    }

    // FIX: parse snareVelocity range from code and carry it through
    // so scheduler uses the user's values instead of hardcoded 0.7/0.9
    let snareVelocity: { min: number; max: number } | null = null;
    const velMatch = code.match(/snare\s+velocity\s+random\((\d+(?:\.\d+)?)\s+to\s+(\d+(?:\.\d+)?)\)/i);
    if (velMatch) {
      snareVelocity = {
        min: parseFloat(velMatch[1]),
        max: parseFloat(velMatch[2]),
      };
    }

    const hihatMatch = code.match(/hihat\s+(?:closed\s+)?(\d+)\s+times/i);
    const hihatCount = hihatMatch ? parseInt(hihatMatch[1]) : 0;

    const effects: string[] = [];
    if (/bitcrush/i.test(code)) effects.push("bitcrush");
    if (/compress/i.test(code)) effects.push("compress");

    drums = {
      swing,
      kick,
      snare,
      snareVelocity,
      hihat: { count: hihatCount, type: "closed" as const },
      effects,
    };
  }

  // ── Chords ──────────────────────────────────────────────────────────────────
  let chords = null;
  if (/chords/i.test(code)) {
    const progressionMatch = code.match(/progression\s+([^\n]+)/);
    let progression: string[] = [];
    if (progressionMatch) {
      progression = progressionMatch[1]
        .split(/->/)
        .map((c) => c.trim())
        .filter(Boolean);
    }
    const voicingMatch = code.match(/voicing\s+(\S+)/i);
    const rhythmMatch  = code.match(/rhythm\s+(\S+)/i);
    chords = {
      instrument: "piano",
      progression,
      voicing: voicingMatch?.[1] ?? "default",
      rhythm:  rhythmMatch?.[1]  ?? "whole",
      effects: [],
    };
  }

  // ── Bass ────────────────────────────────────────────────────────────────────
  let bass = null;
  if (/bass/i.test(code)) {
    const soundMatch  = code.match(/sound\s+(\S+)/i);
    const filterMatch = code.match(/filter\s+(\S+)/i);
    bass = {
      style:  /walking/i.test(code) ? "walking" : "default",
      sound:  soundMatch?.[1]  ?? "default",
      filter: filterMatch?.[1] ?? "none",
    };
  }

  // ── Atmosphere ──────────────────────────────────────────────────────────────
  let atmosphere = null;
  if (/atmosphere/i.test(code)) {
    const vinylMatch = code.match(/vinyl\s+crackle\s+at\s+(\d+)%/i);
    atmosphere = {
      vinylCrackle: vinylMatch ? parseInt(vinylMatch[1]) : 0,
      rain:         /rain/i.test(code),
      tapeWobble:   /tape\s+wobble/i.test(code),
    };
  }

  // ── Modifiers ───────────────────────────────────────────────────────────────
  const modifiers: string[] = [];
  if (/make\s+it\s+dusty/i.test(code))     modifiers.push("dusty");
  if (/make\s+it\s+groovy/i.test(code))    modifiers.push("groovy");
  if (/add\s+some\s+laziness/i.test(code)) modifiers.push("lazy");
  if (/bring\s+energy\s+up/i.test(code))   modifiers.push("energetic");

  // ── Apply modifiers to output ───────────────────────────────────────────────
  // dusty: bump vinyl crackle to at least 20% even if no atmosphere block written
  if (modifiers.includes("dusty")) {
    if (atmosphere) {
      atmosphere.vinylCrackle = Math.max(atmosphere.vinylCrackle, 20);
    } else {
      atmosphere = { vinylCrackle: 20, rain: false, tapeWobble: false };
    }
    if (drums && !drums.effects.includes("bitcrush")) {
      drums.effects.push("bitcrush");
    }
  }
  // groovy: bump swing to at least 60%
  if (modifiers.includes("groovy") && drums) {
    drums.swing = Math.max(drums.swing, 60);
  }
  // lazy: bump swing to at least 40%
  if (modifiers.includes("lazy") && drums) {
    drums.swing = Math.max(drums.swing, 40);
  }

  return { genre, tempo, key, drums, chords, bass, atmosphere, modifiers };
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "slapt-parser" });
});

app.listen(PORT, () => {
  console.log(`SLAPT parser running on :${PORT}`);
});