// FIXME: Please change the file name (Have no idea so called ETC)
//        Fix the cycle dependency error (a -> b -> a)

export type IPlayMatrix = Array<Array<string | null>>;

export interface IStartGame {
  start: boolean;
  symbol: "x" | "o";
}
