export type NodeType =
  | "Program"
  | "GenreDirective"
  | "TempoDirective"
  | "KeyDirective"
  | "DrumBlock"
  | "ChordBlock"
  | "BassBlock"
  | "AtmosphereBlock"
  | "SectionBlock"
  | "MelodyBlock"
  | "DrumPattern"
  | "ChordProgression"
  | "EffectChain"
  | "ModifierStatement"
  | "VelocityRange"
  | "BeatPosition";

export interface ASTNode {
  type: NodeType;
}

export interface Program extends ASTNode {
  type: "Program";
  body: TopLevelNode[];
}

export type TopLevelNode =
  | GenreDirective
  | TempoDirective
  | KeyDirective
  | DrumBlock
  | ChordBlock
  | BassBlock
  | AtmosphereBlock
  | SectionBlock
  | MelodyBlock;

export interface GenreDirective extends ASTNode {
  type: "GenreDirective";
  genre: string;
}

export interface TempoDirective extends ASTNode {
  type: "TempoDirective";
  bpm: number;
}

export interface KeyDirective extends ASTNode {
  type: "KeyDirective";
  key: string;
}

export interface DrumBlock extends ASTNode {
  type: "DrumBlock";
  swing?: number;
  patterns: DrumPattern[];
  effects: EffectChain[];
  modifiers: ModifierStatement[];
}

export interface DrumPattern extends ASTNode {
  type: "DrumPattern";
  instrument: "kick" | "snare" | "hihat_closed" | "hihat_open";
  beats: BeatPosition[];
  velocity?: VelocityRange;
  count?: number;
  feel?: string;
}

export interface BeatPosition extends ASTNode {
  type: "BeatPosition";
  value: number;
}

export interface VelocityRange extends ASTNode {
  type: "VelocityRange";
  min: number;
  max: number;
}

export interface ChordBlock extends ASTNode {
  type: "ChordBlock";
  instrument: string;
  progression: string[];
  voicing?: string;
  rhythm?: string;
  effects: EffectChain[];
}

export interface BassBlock extends ASTNode {
  type: "BassBlock";
  style: string;
  sound?: string;
  filter?: string;
}

export interface AtmosphereBlock extends ASTNode {
  type: "AtmosphereBlock";
  layers: AtmosphereLayer[];
}

export interface AtmosphereLayer {
  sound: string;
  volume: number;
}

export interface SectionBlock extends ASTNode {
  type: "SectionBlock";
  name: string;
  instructions: string[];
}

export interface MelodyBlock extends ASTNode {
  type: "MelodyBlock";
  instrument: string;
  scale?: string;
  rhythm?: string;
  effects: EffectChain[];
}

export interface EffectChain extends ASTNode {
  type: "EffectChain";
  name: string;
  params: EffectParam[];
}

export interface EffectParam {
  value: string | number;
  unit?: string;
}

export interface ModifierStatement extends ASTNode {
  type: "ModifierStatement";
  modifier: "groovy" | "dusty" | "lazy" | "energetic";
}