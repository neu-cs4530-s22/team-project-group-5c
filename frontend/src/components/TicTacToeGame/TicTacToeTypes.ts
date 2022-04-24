/**
 * Game board is an array of strings which is the player symbols
 */
export type GameBoardMatrix = Array<Array<string | null>>;

/**
 * Start game options for players, indicating if they start first and their symbol
 */
export interface StartGameOptions {
  start: boolean;
  symbol: "x" | "o";
}