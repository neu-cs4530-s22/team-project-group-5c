export type PlayMatrix = Array<Array<string | null>>;
export interface StartGameOptions {
  start: boolean;
  symbol: "x" | "o";
}