import type {
  Program,
  DrumBlock,
  ChordBlock,
  BassBlock,
  AtmosphereBlock,
  SectionBlock,
  GenreDirective,
  TempoDirective,
  KeyDirective,
  MelodyBlock,
  DrumPattern,
} from "./ast";

export interface SlaptProgram {
  genre: string;
  tempo: number;
  key: string;
  drums: DrumOutput | null;
  chords: ChordOutput | null;
  bass: BassOutput | null;
  melody: MelodyOutput | null;
  atmosphere: AtmosphereOutput | null;
  sections: SectionOutput[];
  modifiers: string[];
}

export interface DrumOutput {
  swing: number;
  kick: number[];
  snare: number[];
  snareVelocity: { min: number; max: number } | null;
  hihat: HihatOutput;
  effects: string[];
}

export interface HihatOutput {
  count: number;
  type: "closed" | "open" | "mixed";
  feel?: string;
  velocityVariation: boolean;
}

export interface ChordOutput {
  instrument: string;
  progression: string[];
  voicing: string;
  rhythm: string;
  effects: string[];
}

export interface BassOutput {
  style: string;
  sound: string;
  filter: string;
}

export interface MelodyOutput {
  instrument: string;
  scale?: string;
  rhythm?: string;
  effects: string[];
}

export interface AtmosphereOutput {
  vinylCrackle: number;
  rain: boolean;
  tapeWobble: boolean;
}

export interface SectionOutput {
  name: string;
  instructions: string[];
}

const GENRE_DEFAULTS: Record<string, Partial<SlaptProgram>> = {
  "lofi-hiphop": { tempo: 75, key: "Am" },
  "boom-bap":    { tempo: 90, key: "Dm" },
  house:         { tempo: 128, key: "Cm" },
  techno:        { tempo: 138, key: "Am" },
};

export function interpret(ast: Program): SlaptProgram {
  const result: SlaptProgram = {
    genre: "lofi-hiphop",
    tempo: 75,
    key: "Am",
    drums: null,
    chords: null,
    bass: null,
    melody: null,
    atmosphere: null,
    sections: [],
    modifiers: [],
  };

  for (const node of ast.body) {
    switch (node.type) {
      case "GenreDirective": {
        result.genre = (node as GenreDirective).genre;
        const defaults = GENRE_DEFAULTS[result.genre];
        if (defaults) Object.assign(result, defaults);
        break;
      }
      case "TempoDirective":
        result.tempo = (node as TempoDirective).bpm;
        break;
      case "KeyDirective":
        result.key = (node as KeyDirective).key;
        break;
      case "DrumBlock":
        result.drums = interpretDrums(node as DrumBlock);
        break;
      case "ChordBlock":
        result.chords = interpretChords(node as ChordBlock);
        break;
      case "BassBlock":
        result.bass = interpretBass(node as BassBlock);
        break;
      case "AtmosphereBlock":
        result.atmosphere = interpretAtmosphere(node as AtmosphereBlock);
        break;
      case "SectionBlock":
        result.sections.push(interpretSection(node as SectionBlock));
        break;
      case "MelodyBlock":
        result.melody = interpretMelody(node as MelodyBlock);
        break;
      case "ModifierStatement":
        result.modifiers.push((node as any).modifier);
        break;
    }
  }

  applyModifiers(result);
  return result;
}

function interpretDrums(node: DrumBlock): DrumOutput {
  const output: DrumOutput = {
    swing: node.swing ?? 0,
    kick: [],
    snare: [],
    snareVelocity: null,
    hihat: {
      count: 0,
      type: "closed",
      velocityVariation: false,
    },
    effects: [],
  };

  for (const pattern of node.patterns) {
    switch (pattern.instrument) {
      case "kick":
        output.kick = pattern.beats.map((b) => b.value);
        break;
      case "snare":
        output.snare = pattern.beats.map((b) => b.value);
        // FIX: carry actual min/max velocity values instead of just a boolean
        if (pattern.velocity) {
          output.snareVelocity = {
            min: pattern.velocity.min,
            max: pattern.velocity.max,
          };
        }
        break;
      case "hihat_closed":
        output.hihat.count = pattern.count ?? 0;
        output.hihat.type = "closed";
        output.hihat.feel = pattern.feel;
        break;
      case "hihat_open":
        output.hihat.type = output.hihat.count > 0 ? "mixed" : "open";
        break;
    }
  }

  for (const effect of node.effects) {
    output.effects.push(effect.name);
  }

  return output;
}

function interpretChords(node: ChordBlock): ChordOutput {
  return {
    instrument: node.instrument ?? "piano",
    progression: node.progression,
    voicing: node.voicing ?? "default",
    rhythm: node.rhythm ?? "whole",
    effects: node.effects.map((e) => e.name),
  };
}

function interpretBass(node: BassBlock): BassOutput {
  return {
    style: node.style,
    sound: node.sound ?? "default",
    filter: node.filter ?? "none",
  };
}

function interpretAtmosphere(node: AtmosphereBlock): AtmosphereOutput {
  const output: AtmosphereOutput = {
    vinylCrackle: 0,
    rain: false,
    tapeWobble: false,
  };

  for (const layer of node.layers) {
    if (layer.sound === "vinyl_crackle") output.vinylCrackle = layer.volume;
    if (layer.sound === "rain") output.rain = true;
    if (layer.sound === "tape_wobble") output.tapeWobble = true;
  }

  return output;
}

function interpretSection(node: SectionBlock): SectionOutput {
  return {
    name: node.name,
    instructions: node.instructions,
  };
}

function interpretMelody(node: MelodyBlock): MelodyOutput {
  return {
    instrument: node.instrument,
    scale: node.scale,
    rhythm: node.rhythm,
    effects: node.effects.map((e) => e.name),
  };
}

function applyModifiers(program: SlaptProgram): void {
  for (const modifier of program.modifiers) {
    switch (modifier) {
      case "groovy":
        if (program.drums) {
          program.drums.swing = Math.max(program.drums.swing, 60);
        }
        break;
      case "dusty":
        if (program.drums && !program.drums.effects.includes("bitcrush")) {
          program.drums.effects.push("bitcrush");
        }
        if (program.atmosphere) {
          program.atmosphere.vinylCrackle = Math.max(program.atmosphere.vinylCrackle, 20);
        } else {
          // dusty implies some vinyl crackle even if no atmosphere block written
          program.atmosphere = { vinylCrackle: 20, rain: false, tapeWobble: false };
        }
        break;
      case "lazy":
        if (program.drums) {
          program.drums.swing = Math.max(program.drums.swing, 40);
        }
        break;
      case "energetic":
        if (program.drums) {
          program.drums.effects.push("more_ghost_notes");
        }
        break;
    }
  }
}