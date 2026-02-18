export interface ParseResult {
  tokens: TokenInfo[];
  errors: SlaptError[];
  warnings: SlaptWarning[];
  success: boolean;
  program?: SlaptProgram | null;
}

export interface TokenInfo {
  tokenType: string;
  image: string;
  startLine?: number;
  startColumn?: number;
}

export interface SlaptError {
  code: string;
  message: string;
  line?: number;
  column?: number;
  suggestions: string[];
  preview?: string;
}

export interface SlaptWarning {
  code: string;
  message: string;
  line?: number;
  suggestions: string[];
}

export type PlaybackState = "stopped" | "playing" | "paused";

export interface SlaptStore {
  code: string;
  parseResult: ParseResult | null;
  playbackState: PlaybackState;
  tempo: number;
  genre: string;
  key: string;
  currentBar: number;
  isLoading: boolean;
}

export interface SlaptProgram {
  genre: string;
  tempo: number;
  key: string;
  drums: DrumProgramOutput | null;
  chords: ChordProgramOutput | null;
  bass: BassProgramOutput | null;
  atmosphere: AtmosphereProgramOutput | null;
  modifiers: string[];
}

export interface DrumProgramOutput {
  swing: number;
  kick: number[];
  snare: number[];
  // FIX: was `string` — narrowed to the same union used by the audio scheduler
  // so Controls.svelte can pass drums.hihat directly without a type error.
  hihat: { count: number; type: "closed" | "open" | "mixed" };
  effects: string[];
}

export interface ChordProgramOutput {
  instrument: string;
  progression: string[];
  voicing: string;
  rhythm: string;
  effects: string[];
}

export interface BassProgramOutput {
  style: string;
  sound: string;
  filter: string;
}

export interface AtmosphereProgramOutput {
  vinylCrackle: number;
  rain: boolean;
  tapeWobble: boolean;
}