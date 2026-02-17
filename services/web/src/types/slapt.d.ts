export interface ParseResult {
  tokens: TokenInfo[];
  errors: SlaptError[];
  warnings: SlaptWarning[];
  success: boolean;
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