import React from "react";
import { TicTacToeGameState } from "../CoveyTypes";

const defaultState: TicTacToeGameState = {
  isInRoom: false,
  setInRoom: () => {},
  playerSymbol: "x",
  setPlayerSymbol: () => {},
  isPlayerTurn: false,
  setPlayerTurn: () => {},
  isGameStarted: false,
  setGameStarted: () => {},
};

const Context = React.createContext<TicTacToeGameState>(defaultState);
export default Context;