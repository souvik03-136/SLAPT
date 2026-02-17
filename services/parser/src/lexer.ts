import { createToken, Lexer } from "chevrotain";

export const At = createToken({ name: "At", pattern: /@/ });
export const Genre = createToken({ name: "Genre", pattern: /genre/ });
export const Tempo = createToken({ name: "Tempo", pattern: /tempo/ });
export const Key = createToken({ name: "Key", pattern: /key/ });
export const BPM = createToken({ name: "BPM", pattern: /bpm/ });
export const Drums = createToken({ name: "Drums", pattern: /drums/ });
export const Chords = createToken({ name: "Chords", pattern: /chords/ });
export const Bass = createToken({ name: "Bass", pattern: /bass/ });
export const Melody = createToken({ name: "Melody", pattern: /melody/ });
export const Atmosphere = createToken({ name: "Atmosphere", pattern: /atmosphere/ });
export const Section = createToken({ name: "Section", pattern: /section/ });
export const Kick = createToken({ name: "Kick", pattern: /kick/ });
export const Snare = createToken({ name: "Snare", pattern: /snare/ });
export const Hihat = createToken({ name: "Hihat", pattern: /hihat/ });
export const On = createToken({ name: "On", pattern: /on/ });
export const And = createToken({ name: "And", pattern: /and/ });
export const With = createToken({ name: "With", pattern: /with/ });
export const Using = createToken({ name: "Using", pattern: /using/ });
export const Times = createToken({ name: "Times", pattern: /times/ });
export const Per = createToken({ name: "Per", pattern: /per/ });
export const Bar = createToken({ name: "Bar", pattern: /bar/ });
export const Bars = createToken({ name: "Bars", pattern: /bars/ });
export const Every = createToken({ name: "Every", pattern: /every/ });
export const Beat = createToken({ name: "Beat", pattern: /beat/ });
export const Pattern = createToken({ name: "Pattern", pattern: /pattern/ });
export const Velocity = createToken({ name: "Velocity", pattern: /velocity/ });
export const Random = createToken({ name: "Random", pattern: /random/ });
export const To = createToken({ name: "To", pattern: /to/ });
export const Apply = createToken({ name: "Apply", pattern: /apply/ });
export const Compress = createToken({ name: "Compress", pattern: /compress(heavily)?/ });
export const Filter = createToken({ name: "Filter", pattern: /filter/ });
export const Reverb = createToken({ name: "Reverb", pattern: /reverb/ });
export const Delay = createToken({ name: "Delay", pattern: /delay/ });
export const Tremolo = createToken({ name: "Tremolo", pattern: /tremolo/ });
export const Make = createToken({ name: "Make", pattern: /make/ });
export const It = createToken({ name: "It", pattern: /it/ });
export const Add = createToken({ name: "Add", pattern: /add/ });
export const Some = createToken({ name: "Some", pattern: /some/ });
export const Bring = createToken({ name: "Bring", pattern: /bring/ });
export const Up = createToken({ name: "Up", pattern: /up/ });
export const Groovy = createToken({ name: "Groovy", pattern: /groovy/ });
export const Dusty = createToken({ name: "Dusty", pattern: /dusty/ });
export const Laziness = createToken({ name: "Laziness", pattern: /laziness/ });
export const Energy = createToken({ name: "Energy", pattern: /energy/ });
export const Progression = createToken({ name: "Progression", pattern: /progression/ });
export const Voicing = createToken({ name: "Voicing", pattern: /voicing/ });
export const Rhythm = createToken({ name: "Rhythm", pattern: /rhythm/ });
export const Sound = createToken({ name: "Sound", pattern: /sound/ });
export const Vinyl = createToken({ name: "Vinyl", pattern: /vinyl/ });
export const Crackle = createToken({ name: "Crackle", pattern: /crackle/ });
export const Rain = createToken({ name: "Rain", pattern: /rain/ });
export const Softly = createToken({ name: "Softly", pattern: /softly/ });
export const Tape = createToken({ name: "Tape", pattern: /tape/ });
export const Wobble = createToken({ name: "Wobble", pattern: /wobble/ });
export const Subtle = createToken({ name: "Subtle", pattern: /subtle/ });
export const In = createToken({ name: "In", pattern: /in/ });
export const Background = createToken({ name: "Background", pattern: /background/ });
export const At2 = createToken({ name: "At2", pattern: /at/ });
export const Volume = createToken({ name: "Volume", pattern: /volume/ });
export const Fade = createToken({ name: "Fade", pattern: /fade/ });
export const Out = createToken({ name: "Out", pattern: /out/ });
export const Over = createToken({ name: "Over", pattern: /over/ });
export const Only = createToken({ name: "Only", pattern: /only/ });
export const Keep = createToken({ name: "Keep", pattern: /keep/ });
export const Till = createToken({ name: "Till", pattern: /till/ });
export const End = createToken({ name: "End", pattern: /end/ });
export const After = createToken({ name: "After", pattern: /after/ });
export const Occasionally = createToken({ name: "Occasionally", pattern: /occasionally/ });
export const Closed = createToken({ name: "Closed", pattern: /closed/ });
export const Open = createToken({ name: "Open", pattern: /open/ });
export const Swing = createToken({ name: "Swing", pattern: /swing/ });
export const Spread = createToken({ name: "Spread", pattern: /spread/ });
export const Slight = createToken({ name: "Slight", pattern: /slight/ });
export const Anticipation = createToken({ name: "Anticipation", pattern: /anticipation/ });
export const Walking = createToken({ name: "Walking", pattern: /walking/ });
export const Roots = createToken({ name: "Roots", pattern: /roots/ });
export const Follow = createToken({ name: "Follow", pattern: /follow/ });
export const Mellow = createToken({ name: "Mellow", pattern: /mellow/ });
export const Warm = createToken({ name: "Warm", pattern: /warm/ });
export const Chord = createToken({ name: "Chord", pattern: /chord/ });
export const Inherit = createToken({ name: "Inherit", pattern: /inherit/ });
export const Increase = createToken({ name: "Increase", pattern: /increase/ });
export const Remove = createToken({ name: "Remove", pattern: /remove/ });
export const More = createToken({ name: "More", pattern: /more/ });
export const Energetic = createToken({ name: "Energetic", pattern: /energetic/ });
export const Colon = createToken({ name: "Colon", pattern: /:/ });
export const Arrow = createToken({ name: "Arrow", pattern: /→/ });
export const LBracket = createToken({ name: "LBracket", pattern: /\[/ });
export const RBracket = createToken({ name: "RBracket", pattern: /\]/ });
export const LParen = createToken({ name: "LParen", pattern: /\(/ });
export const RParen = createToken({ name: "RParen", pattern: /\)/ });
export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const Percent = createToken({ name: "Percent", pattern: /%/ });
export const NumberLiteral = createToken({ name: "NumberLiteral", pattern: /\d+(\.\d+)?/ });
export const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"[^"]*"|'[^']*'/,
});
export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z#♭♮][a-zA-Z0-9#♭♮_-]*/,
  longer_alt: Genre,
});
export const Newline = createToken({ name: "Newline", pattern: /\n+/, group: Lexer.SKIPPED });
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
  LBracket,
  RBracket,
  LParen,
  RParen,
  Comma,
  Percent,
  Genre,
  Tempo,
  Key,
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
  On,
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
  In,
  Background,
  At2,
  Volume,
  Fade,
  Out,
  Over,
  Only,
  Keep,
  Till,
  End,
  After,
  Occasionally,
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
  Inherit,
  Increase,
  Remove,
  More,
  Energetic,
  StringLiteral,
  NumberLiteral,
  Identifier,
];

export const SlaptLexer = new Lexer(ALL_TOKENS);