import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { TestContext } from "node:test";

const BASE = `http://localhost:${process.env.TEST_PARSER_PORT ?? 3001}`;

async function parse(code: string) {
  const res = await fetch(`${BASE}/api/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  return {
    status: res.status,
    body: await res.json() as {
      tokens: Array<{ tokenType: string; image: string }>;
      errors: Array<{ code: string; message: string; suggestions: string[] }>;
      warnings: Array<{ code: string; message: string; suggestions: string[] }>;
      success: boolean;
    },
  };
}

describe("API — health", () => {
  it("GET /health returns status ok", async (_t: TestContext) => {
    const res = await fetch(`${BASE}/health`);
    const body = await res.json() as { status: string; service: string };
    assert.equal(res.status, 200);
    assert.equal(body.status, "ok");
    assert.equal(body.service, "slapt-parser");
  });
});

describe("API — valid code", () => {
  it("returns success true for minimal valid code", async (_t: TestContext) => {
    const { body } = await parse("@genre lofi-hiphop\n@tempo 75 bpm");
    assert.equal(body.success, true);
    assert.equal(body.errors.length, 0);
  });

  it("returns a non-empty tokens array", async (_t: TestContext) => {
    const { body } = await parse("@genre lofi-hiphop");
    assert.ok(body.tokens.length > 0);
  });

  it("tokens include correct tokenType names", async (_t: TestContext) => {
    const { body } = await parse("@genre lofi-hiphop");
    const types = body.tokens.map((t) => t.tokenType);
    assert.ok(types.includes("At"));
    assert.ok(types.includes("Genre"));
  });

  it("returns empty errors for full valid program", async (_t: TestContext) => {
    const { body } = await parse(`@genre lofi-hiphop
@tempo 72 bpm
@key Am
atmosphere:
  vinyl crackle at 20% volume
drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  hihat closed 8 times
make it dusty`);
    assert.equal(body.errors.length, 0);
  });

  it("returns 200 and success true for empty string input", async (_t: TestContext) => {
    const { status, body } = await parse("");
    assert.equal(status, 200);
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.tokens));
    assert.ok(Array.isArray(body.errors));
    assert.equal(body.tokens.length, 0);
  });
});

describe("API — warnings", () => {
  it("returns TEMPO_GENRE_MISMATCH warning for 180 bpm lofi-hiphop", async (_t: TestContext) => {
    const { body } = await parse("@genre lofi-hiphop\n@tempo 180 bpm");
    const codes = body.warnings.map((w) => w.code);
    assert.ok(codes.includes("TEMPO_GENRE_MISMATCH"));
  });

  it("success is still true when only warnings present", async (_t: TestContext) => {
    const { body } = await parse("@genre lofi-hiphop\n@tempo 180 bpm");
    assert.equal(body.success, true);
  });

  it("warning includes suggestions", async (_t: TestContext) => {
    const { body } = await parse("@genre lofi-hiphop\n@tempo 180 bpm");
    const warn = body.warnings.find((w) => w.code === "TEMPO_GENRE_MISMATCH");
    assert.ok(warn);
    assert.ok(warn.suggestions.length > 0);
  });

  it("no warnings for in-range tempo", async (_t: TestContext) => {
    const { body } = await parse("@genre lofi-hiphop\n@tempo 75 bpm");
    const tempoWarnings = body.warnings.filter((w) => w.code === "TEMPO_GENRE_MISMATCH");
    assert.equal(tempoWarnings.length, 0);
  });
});

describe("API — errors", () => {
  it("returns BEAT_OUT_OF_RANGE for beat 5", async (_t: TestContext) => {
    const { body } = await parse("kick on 5");
    const codes = body.errors.map((e) => e.code);
    assert.ok(codes.includes("BEAT_OUT_OF_RANGE"));
  });

  it("success is false when errors present", async (_t: TestContext) => {
    const { body } = await parse("kick on 5");
    assert.equal(body.success, false);
  });

  it("beat error includes suggestions", async (_t: TestContext) => {
    const { body } = await parse("kick on 5");
    const err = body.errors.find((e) => e.code === "BEAT_OUT_OF_RANGE");
    assert.ok(err);
    assert.ok(err.suggestions.length > 0);
  });
});

describe("API — bad requests", () => {
  it("returns 400 for missing code field", async (_t: TestContext) => {
    const res = await fetch(`${BASE}/api/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.equal(res.status, 400);
  });

  it("returns 400 for non-string code", async (_t: TestContext) => {
    const res = await fetch(`${BASE}/api/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: 123 }),
    });
    assert.equal(res.status, 400);
  });

  it("returns 400 for null code", async (_t: TestContext) => {
    const res = await fetch(`${BASE}/api/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: null }),
    });
    assert.equal(res.status, 400);
  });

  it("returns 400 for array code", async (_t: TestContext) => {
    const res = await fetch(`${BASE}/api/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: ["kick on 1"] }),
    });
    assert.equal(res.status, 400);
  });
});