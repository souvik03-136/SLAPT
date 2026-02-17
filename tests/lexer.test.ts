import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { TestContext } from "node:test";
import { SlaptLexer } from "../services/parser/src/lexer";

describe("Lexer — directives", () => {
  it("tokenizes @genre directive", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("@genre lofi-hiphop");
    assert.equal(errors.length, 0);
    const types = tokens.map((t) => t.tokenType.name);
    assert.ok(types.includes("At"));
    assert.ok(types.includes("Genre"));
    assert.ok(types.includes("Identifier"));
  });

  it("tokenizes @tempo directive", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("@tempo 75 bpm");
    assert.equal(errors.length, 0);
    const types = tokens.map((t) => t.tokenType.name);
    assert.ok(types.includes("Tempo"));
    assert.ok(types.includes("NumberLiteral"));
    assert.ok(types.includes("BPM"));
  });

  it("tokenizes @key directive", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("@key Am");
    assert.equal(errors.length, 0);
    const types = tokens.map((t) => t.tokenType.name);
    assert.ok(types.includes("Key"));
    assert.ok(types.includes("Identifier"));
  });
});

describe("Lexer — drum block", () => {
  it("tokenizes drum block header with swing", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("drums with swing(60%):");
    assert.equal(errors.length, 0);
    const types = tokens.map((t) => t.tokenType.name);
    assert.ok(types.includes("Drums"));
    assert.ok(types.includes("With"));
    assert.ok(types.includes("Swing"));
    assert.ok(types.includes("NumberLiteral"));
    assert.ok(types.includes("Percent"));
    assert.ok(types.includes("Colon"));
  });

  it("tokenizes kick pattern with decimal beats", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("kick pattern [1, 2.75, 3]");
    assert.equal(errors.length, 0);
    const numbers = tokens
      .filter((t) => t.tokenType.name === "NumberLiteral")
      .map((t) => parseFloat(t.image));
    assert.deepEqual(numbers, [1, 2.75, 3]);
  });

  it("tokenizes kick on beats with and", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("kick on 1 and 3");
    assert.equal(errors.length, 0);
    const types = tokens.map((t) => t.tokenType.name);
    assert.ok(types.includes("Kick"));
    assert.ok(types.includes("On"));
    assert.ok(types.includes("And"));
  });

  it("tokenizes snare on beats with and", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("snare on 2 and 4");
    assert.equal(errors.length, 0);
    const types = tokens.map((t) => t.tokenType.name);
    assert.ok(types.includes("Snare"));
    assert.ok(types.includes("On"));
    assert.ok(types.includes("And"));
  });

  it("tokenizes hihat closed N times", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("hihat closed 8 times");
    assert.equal(errors.length, 0);
    const types = tokens.map((t) => t.tokenType.name);
    assert.ok(types.includes("Hihat"));
    assert.ok(types.includes("Closed"));
    assert.ok(types.includes("NumberLiteral"));
    assert.ok(types.includes("Times"));
  });

  it("tokenizes snare velocity random range", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("snare velocity random(0.7 to 0.9)");
    assert.equal(errors.length, 0);
    const numbers = tokens
      .filter((t) => t.tokenType.name === "NumberLiteral")
      .map((t) => parseFloat(t.image));
    assert.ok(numbers.includes(0.7));
    assert.ok(numbers.includes(0.9));
  });
});

describe("Lexer — chord block", () => {
  it("tokenizes chord progression with arrows", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("progression Am7 → Fmaj7 → Dm7 → E7");
    assert.equal(errors.length, 0);
    const arrows = tokens.filter((t) => t.tokenType.name === "Arrow");
    assert.equal(arrows.length, 3);
  });

  it("tokenizes reverb effect call", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("reverb(medium, dreamy)");
    assert.equal(errors.length, 0);
    const types = tokens.map((t) => t.tokenType.name);
    assert.ok(types.includes("Reverb"));
    assert.ok(types.includes("LParen"));
    assert.ok(types.includes("RParen"));
  });
});

describe("Lexer — atmosphere block", () => {
  it("tokenizes vinyl crackle line", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("vinyl crackle at 20% volume");
    assert.equal(errors.length, 0);
    const types = tokens.map((t) => t.tokenType.name);
    assert.ok(types.includes("Vinyl"));
    assert.ok(types.includes("Crackle"));
    assert.ok(types.includes("Percent"));
    assert.ok(types.includes("Volume"));
  });

  it("tokenizes rain sounds line", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("rain sounds softly in background");
    assert.equal(errors.length, 0);
    const types = tokens.map((t) => t.tokenType.name);
    assert.ok(types.includes("Rain"));
    assert.ok(types.includes("Softly"));
  });
});

describe("Lexer — modifiers", () => {
  it("tokenizes make it dusty", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("make it dusty");
    assert.equal(errors.length, 0);
    const types = tokens.map((t) => t.tokenType.name);
    assert.ok(types.includes("Make"));
    assert.ok(types.includes("It"));
    assert.ok(types.includes("Dusty"));
  });

  it("tokenizes make it groovy", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("make it groovy");
    assert.equal(errors.length, 0);
    assert.ok(tokens.map((t) => t.tokenType.name).includes("Groovy"));
  });

  it("tokenizes add some laziness", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("add some laziness");
    assert.equal(errors.length, 0);
    const types = tokens.map((t) => t.tokenType.name);
    assert.ok(types.includes("Add"));
    assert.ok(types.includes("Some"));
    assert.ok(types.includes("Laziness"));
  });

  it("tokenizes bring energy up", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize("bring energy up");
    assert.equal(errors.length, 0);
    const types = tokens.map((t) => t.tokenType.name);
    assert.ok(types.includes("Bring"));
    assert.ok(types.includes("Energy"));
    assert.ok(types.includes("Up"));
  });
});

describe("Lexer — general", () => {
  it("skips line comments entirely", (_t: TestContext) => {
    const { tokens, errors } = SlaptLexer.tokenize(
      "@genre lofi-hiphop // this is a comment\n@tempo 75 bpm"
    );
    assert.equal(errors.length, 0);
    assert.ok(!tokens.map((t) => t.tokenType.name).includes("LineComment"));
  });

  it("produces no errors on a full minimal program", (_t: TestContext) => {
    const code = `@genre lofi-hiphop
@tempo 75 bpm
@key Am
drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  hihat closed 8 times`;
    assert.equal(SlaptLexer.tokenize(code).errors.length, 0);
  });

  it("produces no errors on a full program with all blocks", (_t: TestContext) => {
    const code = `@genre lofi-hiphop
@tempo 72 bpm
@key Am
atmosphere:
  vinyl crackle at 20% volume
drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  hihat closed 8 times
chords using rhodes piano:
  progression Am7 → Fmaj7 → Dm7 → E7
  reverb(medium, dreamy)
bass walking the roots:
  follow chord progression
  sound mellow
make it dusty`;
    assert.equal(SlaptLexer.tokenize(code).errors.length, 0);
  });
});