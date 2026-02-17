import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  validateTempo,
  validateBeat,
  validateNoteInScale,
} from "../../services/parser/src/errors";

describe("validateTempo — in range", () => {
  it("returns null for 75 bpm with lofi-hiphop", () => {
    assert.equal(validateTempo(75, "lofi-hiphop"), null);
  });

  it("returns null at lower bound 60 bpm", () => {
    assert.equal(validateTempo(60, "lofi-hiphop"), null);
  });

  it("returns null at upper bound 90 bpm", () => {
    assert.equal(validateTempo(90, "lofi-hiphop"), null);
  });

  it("returns null for 90 bpm with boom-bap", () => {
    assert.equal(validateTempo(90, "boom-bap"), null);
  });

  it("returns null for 128 bpm with house", () => {
    assert.equal(validateTempo(128, "house"), null);
  });

  it("returns null for 138 bpm with techno", () => {
    assert.equal(validateTempo(138, "techno"), null);
  });

  it("returns null for 170 bpm with dnb", () => {
    assert.equal(validateTempo(170, "dnb"), null);
  });
});

describe("validateTempo — out of range", () => {
  it("returns TEMPO_GENRE_MISMATCH for 180 bpm with lofi-hiphop", () => {
    const w = validateTempo(180, "lofi-hiphop");
    assert.ok(w !== null);
    assert.equal(w.code, "TEMPO_GENRE_MISMATCH");
  });

  it("includes the offending bpm in the message", () => {
    const w = validateTempo(180, "lofi-hiphop");
    assert.ok(w !== null);
    assert.ok(w.message.includes("180"));
  });

  it("includes the genre name in the message", () => {
    const w = validateTempo(180, "lofi-hiphop");
    assert.ok(w !== null);
    assert.ok(w.message.includes("lofi-hiphop"));
  });

  it("returns warning for 40 bpm below lofi-hiphop range", () => {
    const w = validateTempo(40, "lofi-hiphop");
    assert.ok(w !== null);
    assert.equal(w.code, "TEMPO_GENRE_MISMATCH");
  });

  it("returns warning for 60 bpm below boom-bap range", () => {
    assert.ok(validateTempo(60, "boom-bap") !== null);
  });

  it("returns warning for 90 bpm below house range", () => {
    assert.ok(validateTempo(90, "house") !== null);
  });

  it("includes suggestions array with at least one entry", () => {
    const w = validateTempo(200, "lofi-hiphop");
    assert.ok(w !== null);
    assert.ok(w.suggestions.length > 0);
  });

  it("suggestions mention the valid BPM range", () => {
    const w = validateTempo(200, "lofi-hiphop");
    assert.ok(w !== null);
    const text = w.suggestions.join(" ");
    assert.ok(text.includes("60") || text.includes("90"));
  });
});

describe("validateTempo — edge cases", () => {
  it("returns null for unknown genre", () => {
    assert.equal(validateTempo(999, "unknown-genre"), null);
  });

  it("returns null when genre is undefined", () => {
    assert.equal(validateTempo(75, undefined as unknown as string), null);
  });

  it("returns null when genre is empty string", () => {
    assert.equal(validateTempo(75, ""), null);
  });
});

describe("validateBeat — valid beats", () => {
  it("accepts beat 1", () => {
    assert.equal(validateBeat(1), null);
  });

  it("accepts beat 2", () => {
    assert.equal(validateBeat(2), null);
  });

  it("accepts beat 3", () => {
    assert.equal(validateBeat(3), null);
  });

  it("accepts beat 4", () => {
    assert.equal(validateBeat(4), null);
  });

  it("accepts beat 2.5 (off-beat)", () => {
    assert.equal(validateBeat(2.5), null);
  });

  it("accepts beat 2.75 (syncopated)", () => {
    assert.equal(validateBeat(2.75), null);
  });

  it("accepts beat 3.5", () => {
    assert.equal(validateBeat(3.5), null);
  });

  it("accepts beat 5 in 5/4 time", () => {
    assert.equal(validateBeat(5, 5), null);
  });
});

describe("validateBeat — invalid beats", () => {
  it("rejects beat 5 in 4/4", () => {
    const e = validateBeat(5);
    assert.ok(e !== null);
    assert.equal(e.code, "BEAT_OUT_OF_RANGE");
  });

  it("rejects beat 0", () => {
    assert.ok(validateBeat(0) !== null);
  });

  it("rejects beat -1", () => {
    assert.ok(validateBeat(-1) !== null);
  });

  it("rejects beat 6 in 5/4 time", () => {
    assert.ok(validateBeat(6, 5) !== null);
  });

  it("error message includes the offending beat number", () => {
    const e = validateBeat(5);
    assert.ok(e !== null);
    assert.ok(e.message.includes("5"));
  });

  it("error includes suggestions array", () => {
    const e = validateBeat(5);
    assert.ok(e !== null);
    assert.ok(e.suggestions.length > 0);
  });
});

describe("validateNoteInScale — in scale", () => {
  it("accepts A in Am", () => {
    assert.equal(validateNoteInScale("A", "Am"), null);
  });

  it("accepts C in Am", () => {
    assert.equal(validateNoteInScale("C", "Am"), null);
  });

  it("accepts E in Am", () => {
    assert.equal(validateNoteInScale("E", "Am"), null);
  });

  it("accepts G in Am", () => {
    assert.equal(validateNoteInScale("G", "Am"), null);
  });

  it("accepts E in C major", () => {
    assert.equal(validateNoteInScale("E", "C"), null);
  });

  it("accepts F in Dm", () => {
    assert.equal(validateNoteInScale("F", "Dm"), null);
  });
});

describe("validateNoteInScale — out of scale", () => {
  it("rejects G# in Am", () => {
    const w = validateNoteInScale("G#", "Am");
    assert.ok(w !== null);
    assert.equal(w.code, "NOTE_OUT_OF_SCALE");
  });

  it("rejects C# in Am", () => {
    assert.ok(validateNoteInScale("C#", "Am") !== null);
  });

  it("rejects F# in C major", () => {
    assert.ok(validateNoteInScale("F#", "C") !== null);
  });

  it("rejects F# in Dm", () => {
    assert.ok(validateNoteInScale("F#", "Dm") !== null);
  });

  it("message includes the offending note", () => {
    const w = validateNoteInScale("G#", "Am");
    assert.ok(w !== null);
    assert.ok(w.message.includes("G#"));
  });

  it("suggestions list the scale notes", () => {
    const w = validateNoteInScale("G#", "Am");
    assert.ok(w !== null);
    const text = w.suggestions.join(" ");
    assert.ok(text.includes("A") && text.includes("C"));
  });

  it("suggestions include a closest in-scale note", () => {
    const w = validateNoteInScale("G#", "Am");
    assert.ok(w !== null);
    const text = w.suggestions.join(" ");
    assert.ok(text.includes("G") || text.includes("A"));
  });
});

describe("validateNoteInScale — edge cases", () => {
  it("returns null for unknown key", () => {
    assert.equal(validateNoteInScale("X#", "ZZZ"), null);
  });

  it("returns null for empty key string", () => {
    assert.equal(validateNoteInScale("C", ""), null);
  });
});