import { writable, derived } from "svelte/store";
import type { SlaptStore, ParseResult, PlaybackState } from "../../types/slapt";

const INITIAL_CODE = `@genre lofi-hiphop
@tempo 75 bpm
@key Am

atmosphere:
  vinyl crackle at 20% volume
  rain sounds softly in background

drums with swing(60%):
  kick pattern [1, 2.75, 3]
  snare on 2 and 4
  snare velocity random(0.7 to 0.9)
  hihat closed 8 times
  apply bitcrush(10bit)
  compress heavily

chords using rhodes piano:
  progression Am7 → Fmaj7 → Dm7 → E7
  voicing spread
  rhythm whole notes with slight anticipation
  reverb(medium, dreamy)
  tremolo(gentle, 4Hz)

bass walking the roots:
  follow chord progression
  sound mellow
  filter warm

section intro:
  only drums and atmosphere
  fade in over 4 bars

section verse:
  add chords after 4 bars
  add bass after 4 bars

section outro:
  fade out everything over 8 bars
  keep vinyl crackle till end

make it dusty`;

function createSlaptStore() {
  const { subscribe, update, set } = writable<SlaptStore>({
    code: INITIAL_CODE,
    parseResult: null,
    playbackState: "stopped",
    tempo: 75,
    genre: "lofi-hiphop",
    key: "Am",
    currentBar: 0,
    isLoading: false,
  });

  return {
    subscribe,
    setCode: (code: string) => {
      // Auto-detect genre and key from code
      const genreMatch = code.match(/@genre\s+(\S+)/);
      const keyMatch = code.match(/@key\s+(\S+)/);
      const tempoMatch = code.match(/@tempo\s+(\d+(?:\.\d+)?)\s+bpm/i);
      update((s) => ({
        ...s,
        code,
        genre: genreMatch?.[1] ?? s.genre,
        key: keyMatch?.[1] ?? s.key,
        tempo: tempoMatch ? parseFloat(tempoMatch[1]) : s.tempo,
      }));
    },
    setParseResult: (parseResult: ParseResult) => update((s) => ({ ...s, parseResult })),
    setPlaybackState: (playbackState: PlaybackState) => update((s) => ({ ...s, playbackState })),
    setTempo: (tempo: number) => update((s) => ({ ...s, tempo })),
    setGenre: (genre: string) => update((s) => ({ ...s, genre })),
    setCurrentBar: (currentBar: number) => update((s) => ({ ...s, currentBar })),
    setLoading: (isLoading: boolean) => update((s) => ({ ...s, isLoading })),
  };
}

export const slaptStore = createSlaptStore();

export const hasErrors = derived(slaptStore, ($s) => ($s.parseResult?.errors?.length ?? 0) > 0);
export const hasWarnings = derived(
  slaptStore,
  ($s) => ($s.parseResult?.warnings?.length ?? 0) > 0
);
export const isPlaying = derived(slaptStore, ($s) => $s.playbackState === "playing");