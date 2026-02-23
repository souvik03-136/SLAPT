import { createToken, Lexer } from "chevrotain";

// Identifier must be defined first so keywords can reference it as longer_alt
export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z#][a-zA-Z0-9#_-]*/,
});

const kw = (name: string, pattern: RegExp) =>
  createToken({ name, pattern, longer_alt: Identifier });

export const Genre        = kw("Genre",        /genre/);
export const Tempo        = kw("Tempo",        /tempo/);
export const Key          = kw("Key",          /key/);
export const Timesig      = kw("Timesig",      /timesig/);
export const BPM          = kw("BPM",          /bpm/);
export const Drums        = kw("Drums",        /drums/);
export const Chords       = kw("Chords",       /chords/);
export const Bass         = kw("Bass",         /bass/);
export const Melody       = kw("Melody",       /melody/);
export const Atmosphere   = kw("Atmosphere",   /atmosphere/);
export const Section      = kw("Section",      /section/);
export const Kick         = kw("Kick",         /kick/);
export const Snare        = kw("Snare",        /snare/);
export const Hihat        = kw("Hihat",        /hihat/);
export const Occasionally = kw("Occasionally", /occasionally/);
export const Only         = kw("Only",         /only/);
export const On           = kw("On",           /on/);
export const Inherit      = kw("Inherit",      /inherit/);
export const Increase     = kw("Increase",     /increase/);
export const In           = kw("In",           /in/);
export const And          = kw("And",          /and/);
export const With         = kw("With",         /with/);
export const Using        = kw("Using",        /using/);
export const Times        = kw("Times",        /times/);
export const Per          = kw("Per",          /per/);
export const Bars         = kw("Bars",         /bars/);
export const Bar          = kw("Bar",          /bar/);
export const Every        = kw("Every",        /every/);
export const Beat         = kw("Beat",         /beat/);
export const Pattern      = kw("Pattern",      /pattern/);
export const Velocity     = kw("Velocity",     /velocity/);
export const Random       = kw("Random",       /random/);
export const To           = kw("To",           /to/);
export const Apply        = kw("Apply",        /apply/);
export const Compress     = kw("Compress",     /compress/);
export const Heavily      = kw("Heavily",      /heavily/);
export const Filter       = kw("Filter",       /filter/);
export const Reverb       = kw("Reverb",       /reverb/);
export const Delay        = kw("Delay",        /delay/);
export const Tremolo      = kw("Tremolo",      /tremolo/);
export const Make         = kw("Make",         /make/);
export const It           = kw("It",           /it/);
export const Add          = kw("Add",          /add/);
export const Some         = kw("Some",         /some/);
export const Bring        = kw("Bring",        /bring/);
export const Up           = kw("Up",           /up/);
export const Groovy       = kw("Groovy",       /groovy/);
export const Dusty        = kw("Dusty",        /dusty/);
export const Laziness     = kw("Laziness",     /laziness/);
export const Energy       = kw("Energy",       /energy/);
export const Progression  = kw("Progression",  /progression/);
export const Voicing      = kw("Voicing",      /voicing/);
export const Rhythm       = kw("Rhythm",       /rhythm/);
export const Sound        = kw("Sound",        /sound/);
export const Vinyl        = kw("Vinyl",        /vinyl/);
export const Crackle      = kw("Crackle",      /crackle/);
export const Rain         = kw("Rain",         /rain/);
export const Softly       = kw("Softly",       /softly/);
export const Tape         = kw("Tape",         /tape/);
export const Wobble       = kw("Wobble",       /wobble/);
export const Subtle       = kw("Subtle",       /subtle/);
export const Background   = kw("Background",   /background/);
export const At2          = kw("At2",          /at/);
export const Volume       = kw("Volume",       /volume/);
export const Fade         = kw("Fade",         /fade/);
export const Out          = kw("Out",          /out/);
export const Over         = kw("Over",         /over/);
export const Keep         = kw("Keep",         /keep/);
export const Till         = kw("Till",         /till/);
export const End          = kw("End",          /end/);
export const After        = kw("After",        /after/);
export const Closed       = kw("Closed",       /closed/);
export const Open         = kw("Open",         /open/);
export const Swing        = kw("Swing",        /swing/);
export const Spread       = kw("Spread",       /spread/);
export const Slight       = kw("Slight",       /slight/);
export const Anticipation = kw("Anticipation", /anticipation/);
export const Walking      = kw("Walking",      /walking/);
export const Roots        = kw("Roots",        /roots/);
export const Follow       = kw("Follow",       /follow/);
export const Mellow       = kw("Mellow",       /mellow/);
export const Warm         = kw("Warm",         /warm/);
export const Chord        = kw("Chord",        /chord/);
export const Remove       = kw("Remove",       /remove/);
export const More         = kw("More",         /more/);
export const Energetic    = kw("Energetic",    /energetic/);

export const At       = createToken({ name: "At",       pattern: /@/ });
export const Colon    = createToken({ name: "Colon",    pattern: /:/ });
export const Slash    = createToken({ name: "Slash",    pattern: /\// });
export const Arrow    = createToken({ name: "Arrow",    pattern: /->/ });
export const LBracket = createToken({ name: "LBracket", pattern: /\[/ });
export const RBracket = createToken({ name: "RBracket", pattern: /\]/ });
export const LParen   = createToken({ name: "LParen",   pattern: /\(/ });
export const RParen   = createToken({ name: "RParen",   pattern: /\)/ });
export const Comma    = createToken({ name: "Comma",    pattern: /,/ });
export const Percent  = createToken({ name: "Percent",  pattern: /%/ });

export const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /\d+(\.\d+)?/,
});
export const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"[^"]*"|'[^']*'/,
});
export const Newline = createToken({
  name: "Newline",
  pattern: /\n+/,
  group: Lexer.SKIPPED,
});
export const Whitespace = createToken({
  name: "Whitespace",
  pattern: /[ \t\r]+/,
  group: Lexer.SKIPPED,
});
export const LineComment = createToken({
  name: "LineComment",
  pattern: /\/\/[^\n]*/,
  group: Lexer.SKIPPED,
});

export const ALL_TOKENS = [
  LineComment,
  Whitespace,
  Newline,
  At,
  Colon,
  Arrow,
  Slash,
  LBracket,
  RBracket,
  LParen,
  RParen,
  Comma,
  Percent,
  Genre,
  Tempo,
  Key,
  Timesig,
  BPM,
  Drums,
  Chords,
  Bass,
  Melody,
  Atmosphere,
  Section,
  Kick,
  Snare,
  Hihat,
  Closed,
  Open,
  Occasionally,
  Only,
  On,
  Inherit,
  Increase,
  In,
  And,
  With,
  Using,
  Times,
  Per,
  Bars,
  Bar,
  Every,
  Beat,
  Pattern,
  Velocity,
  Random,
  To,
  Apply,
  Compress,
  Heavily,
  Filter,
  Reverb,
  Delay,
  Tremolo,
  Make,
  It,
  Add,
  Some,
  Bring,
  Up,
  Groovy,
  Dusty,
  Laziness,
  Energy,
  Progression,
  Voicing,
  Rhythm,
  Sound,
  Vinyl,
  Crackle,
  Rain,
  Softly,
  Tape,
  Wobble,
  Subtle,
  Background,
  At2,
  Volume,
  Fade,
  Out,
  Over,
  Keep,
  Till,
  End,
  After,
  Swing,
  Spread,
  Slight,
  Anticipation,
  Walking,
  Roots,
  Follow,
  Mellow,
  Warm,
  Chord,
  Remove,
  More,
  Energetic,
  StringLiteral,
  NumberLiteral,
  Identifier,
];

export const SlaptLexer = new Lexer(ALL_TOKENS);