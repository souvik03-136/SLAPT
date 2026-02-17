import express from "express";
import cors from "cors";
import { SlaptLexer } from "./lexer";
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

  const errors: object[] = [];
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

  const genreMatch = code.match(/@genre\s+(\S+)/);
  const tempoMatch = code.match(/@tempo\s+(\d+(?:\.\d+)?)\s+bpm/i);

  const genre = genreMatch?.[1];
  const tempo = tempoMatch ? parseFloat(tempoMatch[1]) : undefined;

  if (genre && tempo) {
    const tempoWarning = validateTempo(tempo, genre);
    if (tempoWarning) warnings.push(tempoWarning);
  }

  const beatMatches = code.matchAll(/kick\s+on\s+([\d.]+)/gi);
  for (const match of beatMatches) {
    const beat = parseFloat(match[1]);
    const beatError = validateBeat(beat);
    if (beatError) errors.push(beatError);
  }

  const tokens = lexResult.tokens.map((t) => ({
    tokenType: t.tokenType.name,
    image: t.image,
    startLine: t.startLine,
    startColumn: t.startColumn,
  }));

  res.json({
    tokens,
    errors,
    warnings,
    success: errors.length === 0,
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "slapt-parser" });
});

app.listen(PORT, () => {
  console.log(`SLAPT parser running on :${PORT}`);
});