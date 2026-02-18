import {
  CstParser,
} from "chevrotain";
import * as T from "./lexer";

class SlaptParser extends CstParser {
  constructor() {
    super(T.ALL_TOKENS);
    this.performSelfAnalysis();
  }

  program = this.RULE("program", () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.directive) },
        { ALT: () => this.SUBRULE(this.drumBlock) },
        { ALT: () => this.SUBRULE(this.chordBlock) },
        { ALT: () => this.SUBRULE(this.bassBlock) },
        { ALT: () => this.SUBRULE(this.atmosphereBlock) },
        { ALT: () => this.SUBRULE(this.sectionBlock) },
        { ALT: () => this.SUBRULE(this.melodyBlock) },
        { ALT: () => this.SUBRULE(this.globalModifier) },
      ]);
    });
  });

  directive = this.RULE("directive", () => {
    this.CONSUME(T.At);
    this.OR([
      { ALT: () => this.SUBRULE(this.genreDirective) },
      { ALT: () => this.SUBRULE(this.tempoDirective) },
      { ALT: () => this.SUBRULE(this.keyDirective) },
    ]);
  });

  genreDirective = this.RULE("genreDirective", () => {
    this.CONSUME(T.Genre);
    this.CONSUME(T.Identifier);
  });

  tempoDirective = this.RULE("tempoDirective", () => {
    this.CONSUME(T.Tempo);
    this.CONSUME(T.NumberLiteral);
    this.CONSUME(T.BPM);
  });

  keyDirective = this.RULE("keyDirective", () => {
    this.CONSUME(T.Key);
    this.CONSUME(T.Identifier);
  });

  drumBlock = this.RULE("drumBlock", () => {
    this.CONSUME(T.Drums);
    this.OPTION(() => {
      this.CONSUME(T.With);
      this.SUBRULE(this.drumModifier);
    });
    this.CONSUME(T.Colon);
    this.MANY(() => this.SUBRULE(this.drumStatement));
  });

  drumModifier = this.RULE("drumModifier", () => {
    this.CONSUME(T.Swing);
    this.OPTION(() => {
      this.CONSUME(T.LParen);
      this.CONSUME(T.NumberLiteral);
      this.CONSUME(T.Percent);
      this.CONSUME(T.RParen);
    });
  });

  drumStatement = this.RULE("drumStatement", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.kickPattern) },
      { ALT: () => this.SUBRULE(this.snarePattern) },
      { ALT: () => this.SUBRULE(this.velocityStatement) },
      { ALT: () => this.SUBRULE(this.hihatPattern) },
      { ALT: () => this.SUBRULE(this.drumEffect) },
    ]);
  });

  kickPattern = this.RULE("kickPattern", () => {
    this.CONSUME(T.Kick);
    this.OR([
      {
        ALT: () => {
          this.CONSUME(T.Pattern);
          this.CONSUME(T.LBracket);
          this.AT_LEAST_ONE_SEP({
            SEP: T.Comma,
            DEF: () => this.CONSUME(T.NumberLiteral),
          });
          this.CONSUME(T.RBracket);
        },
      },
      {
        ALT: () => {
          this.CONSUME(T.On);
          this.AT_LEAST_ONE_SEP2({
            SEP: T.And,
            DEF: () => this.CONSUME2(T.NumberLiteral),
          });
        },
      },
    ]);
  });

  snarePattern = this.RULE("snarePattern", () => {
    this.CONSUME(T.Snare);
    this.OR([
      {
        ALT: () => {
          this.CONSUME(T.On);
          this.AT_LEAST_ONE_SEP({
            SEP: T.And,
            DEF: () => this.CONSUME(T.NumberLiteral),
          });
          this.OPTION(() => {
            this.CONSUME(T.With);
            this.SUBRULE(this.velocityRange);
          });
        },
      },
    ]);
  });

  hihatPattern = this.RULE("hihatPattern", () => {
    this.CONSUME(T.Hihat);
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(T.Closed) },
        { ALT: () => this.CONSUME(T.Open) },
      ]);
    });
    this.OR2([
      {
        ALT: () => {
          this.CONSUME(T.NumberLiteral);
          this.CONSUME(T.Times);
          this.OPTION2(() => {
            this.CONSUME(T.With);
            this.CONSUME(T.Identifier);
          });
        },
      },
      { ALT: () => this.CONSUME(T.Occasionally) },
    ]);
  });

  velocityRange = this.RULE("velocityRange", () => {
    this.CONSUME(T.Velocity);
    this.CONSUME(T.Random);
    this.CONSUME(T.LParen);
    this.CONSUME(T.NumberLiteral);
    this.CONSUME(T.To);
    this.CONSUME2(T.NumberLiteral);
    this.CONSUME(T.RParen);
  });

  velocityStatement = this.RULE("velocityStatement", () => {
    this.CONSUME(T.Snare);
    this.SUBRULE(this.velocityRange);
  });

  // FIX 1: drumEffect apply branch now also accepts keyword tokens
  // (like Compress, Filter, Reverb, etc.) in addition to plain Identifiers.
  // FIX 2: compress branch now accepts an optional Identifier OR keyword
  // modifier so "apply compress(heavy)" and "compress heavily" both parse.
  drumEffect = this.RULE("drumEffect", () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(T.Apply);
          // Accept any known keyword that could follow "apply" (e.g. compress,
          // bitcrush written as an identifier, reverb, etc.) as well as plain
          // Identifiers.  We try keyword tokens first then fall back.
          this.OR2([
            { ALT: () => this.CONSUME(T.Compress) },
            { ALT: () => this.CONSUME(T.Reverb) },
            { ALT: () => this.CONSUME(T.Identifier) },
          ]);
          this.OPTION(() => {
            this.CONSUME(T.LParen);
            // params: optional number and/or identifier-like token
            this.OPTION2(() => this.CONSUME(T.NumberLiteral));
            this.OPTION3(() => {
              this.OR3([
                { ALT: () => this.CONSUME2(T.Identifier) },
                { ALT: () => this.CONSUME(T.Heavily) },
                { ALT: () => this.CONSUME(T.Subtle) },
              ]);
            });
            this.CONSUME(T.RParen);
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME2(T.Compress);
          this.OPTION4(() => {
            this.OR4([
              { ALT: () => this.CONSUME2(T.Heavily) },
              {
                ALT: () => {
                  this.CONSUME(T.With);
                  this.CONSUME3(T.Identifier);
                },
              },
            ]);
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME(T.Filter);
          this.CONSUME4(T.Identifier);
          this.CONSUME4(T.NumberLiteral);
          this.CONSUME5(T.Identifier);
        },
      },
    ]);
  });

  chordBlock = this.RULE("chordBlock", () => {
    this.CONSUME(T.Chords);
    this.OPTION(() => {
      this.CONSUME(T.Using);
      this.CONSUME(T.Identifier);
      this.OPTION2(() => this.CONSUME2(T.Identifier));
    });
    this.CONSUME(T.Colon);
    this.MANY(() => this.SUBRULE(this.chordStatement));
  });

  chordStatement = this.RULE("chordStatement", () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(T.Progression);
          this.AT_LEAST_ONE_SEP({
            SEP: T.Arrow,
            DEF: () => this.CONSUME(T.Identifier),
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME(T.Voicing);
          this.OR2([
            { ALT: () => this.CONSUME2(T.Identifier) },
            { ALT: () => this.CONSUME(T.Spread) },
          ]);
        },
      },
      {
        ALT: () => {
          this.CONSUME(T.Rhythm);
          this.CONSUME3(T.Identifier);
          this.OPTION2(() => this.CONSUME4(T.Identifier));
          this.OPTION(() => {
            this.CONSUME(T.With);
            this.CONSUME(T.Slight);
            this.CONSUME(T.Anticipation);
          });
        },
      },
      { ALT: () => this.SUBRULE(this.reverbEffect) },
      { ALT: () => this.SUBRULE(this.delayEffect) },
      { ALT: () => this.SUBRULE(this.tremoloEffect) },
    ]);
  });

  reverbEffect = this.RULE("reverbEffect", () => {
    this.CONSUME(T.Reverb);
    this.CONSUME(T.LParen);
    this.CONSUME(T.Identifier);
    this.OPTION(() => {
      this.CONSUME(T.Comma);
      this.CONSUME2(T.Identifier);
    });
    this.CONSUME(T.RParen);
  });

  delayEffect = this.RULE("delayEffect", () => {
    this.CONSUME(T.Delay);
    this.CONSUME(T.LParen);
    this.CONSUME(T.Identifier);
    this.CONSUME(T.Comma);
    this.CONSUME2(T.Identifier);
    this.CONSUME2(T.Comma);
    this.CONSUME(T.NumberLiteral);
    this.CONSUME(T.Percent);
    this.CONSUME3(T.Identifier);
    this.CONSUME(T.RParen);
  });

  tremoloEffect = this.RULE("tremoloEffect", () => {
    this.CONSUME(T.Tremolo);
    this.CONSUME(T.LParen);
    this.CONSUME(T.Identifier);
    this.CONSUME(T.Comma);
    this.CONSUME(T.NumberLiteral);
    this.CONSUME2(T.Identifier);
    this.CONSUME(T.RParen);
  });

  bassBlock = this.RULE("bassBlock", () => {
    this.CONSUME(T.Bass);
    this.OPTION(() => {
      this.CONSUME(T.Walking);
      this.CONSUME(T.Identifier);
      this.CONSUME(T.Roots);
    });
    this.CONSUME(T.Colon);
    this.MANY(() => this.SUBRULE(this.bassStatement));
  });

  bassStatement = this.RULE("bassStatement", () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(T.Follow);
          this.CONSUME(T.Chord);
          this.OR2([
            { ALT: () => this.CONSUME(T.Identifier) },
            { ALT: () => this.CONSUME(T.Progression) },
          ]);
        },
      },
      {
        ALT: () => {
          this.CONSUME(T.Sound);
          this.OR3([
            { ALT: () => this.CONSUME2(T.Identifier) },
            { ALT: () => this.CONSUME(T.Mellow) },
            { ALT: () => this.CONSUME(T.Warm) },
          ]);
        },
      },
      {
        ALT: () => {
          this.CONSUME(T.Filter);
          this.OR4([
            { ALT: () => this.CONSUME3(T.Identifier) },
            { ALT: () => this.CONSUME2(T.Warm) },
            { ALT: () => this.CONSUME2(T.Mellow) },
          ]);
        },
      },
    ]);
  });

  atmosphereBlock = this.RULE("atmosphereBlock", () => {
    this.CONSUME(T.Atmosphere);
    this.CONSUME(T.Colon);
    this.MANY(() => this.SUBRULE(this.atmosphereStatement));
  });

  // FIX 3: tape wobble line now accepts Subtle keyword token in addition to
  // a plain Identifier, so "tape wobble subtle" parses correctly.
  atmosphereStatement = this.RULE("atmosphereStatement", () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(T.Vinyl);
          this.CONSUME(T.Crackle);
          this.CONSUME(T.At2);
          this.CONSUME(T.NumberLiteral);
          this.CONSUME(T.Percent);
          this.CONSUME(T.Volume);
        },
      },
      {
        ALT: () => {
          this.CONSUME(T.Rain);
          this.CONSUME(T.Identifier);
          this.CONSUME(T.Softly);
          this.CONSUME(T.In);
          this.CONSUME(T.Background);
        },
      },
      {
        ALT: () => {
          this.CONSUME(T.Tape);
          this.CONSUME(T.Wobble);
          // Accept either a plain identifier OR the keyword "subtle"
          this.OR2([
            { ALT: () => this.CONSUME2(T.Identifier) },
            { ALT: () => this.CONSUME(T.Subtle) },
          ]);
        },
      },
    ]);
  });

  sectionBlock = this.RULE("sectionBlock", () => {
    this.CONSUME(T.Section);
    this.CONSUME(T.Identifier);
    this.CONSUME(T.Colon);
    this.MANY(() => this.SUBRULE(this.sectionStatement));
  });

  sectionStatement = this.RULE("sectionStatement", () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(T.Identifier) },
        { ALT: () => this.CONSUME(T.NumberLiteral) },
        { ALT: () => this.CONSUME(T.Add) },
        { ALT: () => this.CONSUME(T.Only) },
        { ALT: () => this.CONSUME(T.Fade) },
        { ALT: () => this.CONSUME(T.In) },
        { ALT: () => this.CONSUME(T.Out) },
        { ALT: () => this.CONSUME(T.Over) },
        { ALT: () => this.CONSUME(T.Keep) },
        { ALT: () => this.CONSUME(T.Till) },
        { ALT: () => this.CONSUME(T.End) },
        { ALT: () => this.CONSUME(T.After) },
        { ALT: () => this.CONSUME(T.Remove) },
        { ALT: () => this.CONSUME(T.Bars) },
        { ALT: () => this.CONSUME(T.Bar) },
        { ALT: () => this.CONSUME(T.And) },
        { ALT: () => this.CONSUME(T.Bring) },
        { ALT: () => this.CONSUME(T.Up) },
        { ALT: () => this.CONSUME(T.Energy) },
        { ALT: () => this.CONSUME(T.Increase) },
        { ALT: () => this.CONSUME(T.Drums) },
        { ALT: () => this.CONSUME(T.Atmosphere) },
        { ALT: () => this.CONSUME(T.Chords) },
        { ALT: () => this.CONSUME(T.Bass) },
        { ALT: () => this.CONSUME(T.Vinyl) },
        { ALT: () => this.CONSUME(T.Crackle) },
      ]);
    });
  });

  melodyBlock = this.RULE("melodyBlock", () => {
    this.CONSUME(T.Melody);
    this.OPTION(() => {
      this.CONSUME(T.Using);
      this.CONSUME(T.Identifier);
      this.OPTION2(() => {
        this.CONSUME(T.LParen);
        this.CONSUME2(T.Identifier);
        this.CONSUME(T.RParen);
      });
    });
    this.CONSUME(T.Colon);
    this.MANY(() => this.SUBRULE(this.melodyStatement));
  });

  melodyStatement = this.RULE("melodyStatement", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.reverbEffect) },
      { ALT: () => this.SUBRULE(this.delayEffect) },
      { ALT: () => this.SUBRULE(this.tremoloEffect) },
      {
        ALT: () => {
          this.CONSUME(T.Identifier);
          this.OPTION(() => this.CONSUME2(T.Identifier));
        },
      },
    ]);
  });

  globalModifier = this.RULE("globalModifier", () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(T.Make);
          this.CONSUME(T.It);
          this.OR2([
            { ALT: () => this.CONSUME(T.Groovy) },
            { ALT: () => this.CONSUME(T.Dusty) },
            { ALT: () => this.CONSUME(T.Energetic) },
          ]);
        },
      },
      {
        ALT: () => {
          this.CONSUME(T.Add);
          this.CONSUME(T.Some);
          this.CONSUME(T.Laziness);
        },
      },
      {
        ALT: () => {
          this.CONSUME2(T.Bring);
          this.CONSUME2(T.Energy);
          this.CONSUME(T.Up);
        },
      },
    ]);
  });
}

export const parser = new SlaptParser();
export const ParserInstance = SlaptParser;