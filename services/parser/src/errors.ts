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

const GENRE_BPM_RANGES: Record<string, [number, number]> = {
  "lofi-hiphop": [60, 90],
  "boom-bap": [80, 100],
  house: [120, 135],
  techno: [130, 150],
  dnb: [160, 180],
  ambient: [60, 90],
  trap: [130, 170],
};

const SCALE_NOTES: Record<string, string[]> = {
  Am: ["A", "B", "C", "D", "E", "F", "G"],
  Cm: ["C", "D", "Eb", "F", "G", "Ab", "Bb"],
  Dm: ["D", "E", "F", "G", "A", "Bb", "C"],
  Em: ["E", "F#", "G", "A", "B", "C", "D"],
  C: ["C", "D", "E", "F", "G", "A", "B"],
  G: ["G", "A", "B", "C", "D", "E", "F#"],
  F: ["F", "G", "A", "Bb", "C", "D", "E"],
};

export function validateTempo(bpm: number, genre?: string): SlaptWarning | null {
  if (!genre || !GENRE_BPM_RANGES[genre]) return null;

  const [min, max] = GENRE_BPM_RANGES[genre];
  if (bpm < min || bpm > max) {
    return {
      code: "TEMPO_GENRE_MISMATCH",
      message: `${bpm} BPM feels off for ${genre}`,
      suggestions: [
        `Typical ${genre} range: ${min}–${max} BPM`,
        `Try ${Math.round((min + max) / 2)} BPM for a classic ${genre} feel`,
        `Or switch genre to match your tempo`,
      ],
    };
  }
  return null;
}

export function validateBeat(beat: number, timeSig: number = 4): SlaptError | null {
  if (beat > timeSig || beat < 1) {
    return {
      code: "BEAT_OUT_OF_RANGE",
      message: `Beat ${beat} doesn't exist in ${timeSig}/4 time`,
      suggestions: [
        `Beats go from 1 to ${timeSig} in your current time signature`,
        `Try @timesig 5/4 if you want 5 beats per bar`,
        `Did you mean beat ${((beat - 1) % timeSig) + 1}?`,
      ],
    };
  }
  return null;
}

export function validateNoteInScale(note: string, key: string): SlaptWarning | null {
  const scale = SCALE_NOTES[key];
  if (!scale) return null;

  const normalizedNote = note.replace("♮", "").trim();
  if (!scale.includes(normalizedNote)) {
    return {
      code: "NOTE_OUT_OF_SCALE",
      message: `${note} is not in the ${key} scale`,
      suggestions: [
        `${key} scale: ${scale.join(", ")}`,
        `Closest in-scale note: ${findClosestNote(normalizedNote, scale)}`,
        `Using out-of-scale notes creates dissonance — intentional?`,
      ],
    };
  }
  return null;
}

function findClosestNote(note: string, scale: string[]): string {
  const chromatic = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const noteIdx = chromatic.indexOf(note.replace("b", "#"));
  if (noteIdx === -1) return scale[0];

  let closest = scale[0];
  let minDist = Infinity;

  for (const scaleNote of scale) {
    const scaleIdx = chromatic.indexOf(scaleNote.replace("b", "#"));
    if (scaleIdx === -1) continue;
    const dist = Math.min(Math.abs(noteIdx - scaleIdx), 12 - Math.abs(noteIdx - scaleIdx));
    if (dist < minDist) {
      minDist = dist;
      closest = scaleNote;
    }
  }

  return closest;
}