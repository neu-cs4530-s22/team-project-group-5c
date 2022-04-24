import styled from "styled-components";
import React, { useCallback, useEffect, useState } from 'react';
import { GameBoardMatrix } from './TicTacToeTypes';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import MinigameService from '../../classes/MinigameService';
import MinigameArea, { MinigameAreaListener } from '../../classes/MinigameArea';
import GameOverModal from '../world/GameOverModal'
import GridModal from './GridModal'
import TicTacToeLeaderBoard from '../../classes/Leaderboard';
import useLeaderboard from '../../hooks/useLeaderboard';



type TicTacToeGameModalProps = {
  minigameArea: MinigameArea;
  closeModal: ()=>void;
  roomLabel: string;
  playerSymbolStart: 'x' | 'o';
  playerTurnStart: boolean;
  setGameStarted: (arg0: boolean) => void;
  changeWaitingPlayers: (newPlayers: string[]|undefined) => void;
}

export default function TicTacToeGameModal({minigameArea, closeModal, roomLabel, playerSymbolStart, playerTurnStart, setGameStarted, changeWaitingPlayers}: TicTacToeGameModalProps): JSX.Element {

  const {socket} = useCoveyAppState();

  const [matrix, setMatrix] = useState<GameBoardMatrix>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  const [playerSymbol, setPlayerSymbol] = useState<'x'|'o'>(playerSymbolStart);
  const [playerTurn, setPlayerTurn] = useState<boolean>(playerTurnStart);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameOverMessage, setGameOverMessage] = useState<string>('You Lost!');

  /**
   * Initializes listeners for the minigame area
   */
  const curPlayer = playerSymbol === 'x' ? minigameArea.playersByID[0] : minigameArea.playersByID[1];
  // const [leaderboard, setLeaderboard] = useState<TicTacToeLeaderBoard>(useLeaderboard());
  
  useEffect(() => {
    const updateListener: MinigameAreaListener = {
      onPlayersChange: (newPlayers: string[]) => {
        setGameStarted(false);
        changeWaitingPlayers(newPlayers);
      },
      onMinigameAreaDestroyed: () => {
        closeModal();
      }
    };
    minigameArea.addListener(updateListener);
    return () => {
      minigameArea.removeListener(updateListener);
    };
  }, [minigameArea, closeModal, setGameStarted, changeWaitingPlayers]);

  /**
   * Checks for the winner on each game board update 
   * Outputs [hostWin, guestWin] as a boolean array
   */
  const checkGameState = useCallback((gameMatrix: GameBoardMatrix) => {
    for (let i = 0; i < gameMatrix.length; i += 1) {
      const row = [];
      for (let j = 0; j < gameMatrix[i].length; j += 1) {
        row.push(gameMatrix[i][j]);
      }

      if (row.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } if (row.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    for (let i = 0; i < gameMatrix.length; i += 1) {
      const column = [];
      for (let j = 0; j < gameMatrix[i].length; j += 1) {
        column.push(gameMatrix[j][i]);
      }

      if (column.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } if (column.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    if (gameMatrix[1][1]) {
      if (gameMatrix[0][0] === gameMatrix[1][1] && gameMatrix[2][2] === gameMatrix[1][1]) {
        if (gameMatrix[1][1] === playerSymbol) return [true, false];
        return [false, true];
      }

      if (gameMatrix[2][0] === gameMatrix[1][1] && gameMatrix[0][2] === gameMatrix[1][1]) {
        if (gameMatrix[1][1] === playerSymbol) return [true, false];
        return [false, true];
      }
    }

    // Check for a tie
    if (gameMatrix.every((m) => m.every((v) => v !== null))) {
      return [true, true];
    }

    return [false, false];
  }, [playerSymbol]);

  /**
   * Updates the game board with the given column and row value
   * @param column column of the input value
   * @param row row of the input value
   * @param symbol player's symbol
   */
  const updateGameMatrix = async (column: number, row: number, symbol: "x" | "o") => {
    const newMatrix = [...matrix];

    if (newMatrix[row][column] === null || newMatrix[row][column] === "null") {
      newMatrix[row][column] = symbol;
      setMatrix(newMatrix);
    }

    if (socket) {
      MinigameService.updateGame(socket, roomLabel, newMatrix);
      const [currentPlayerWon, otherPlayerWon] = checkGameState(newMatrix);

      if (currentPlayerWon && otherPlayerWon) {
        await MinigameService.gameOver(socket, roomLabel, "The Game is a TIE!");
      } else if (currentPlayerWon && !otherPlayerWon) {
        await MinigameService.gameOver(socket, roomLabel, "You Lost!");
        MinigameService.updateLeaderBoard(socket, curPlayer);
      }
      setPlayerTurn(false);
    }
  };

  /**
   * Handler for game updates that initializes a listener for this player to update the game board
   */
  const handleGameUpdate = useCallback(() => {
    if (socket) {
      MinigameService.onGameUpdate(socket, (newMatrix: GameBoardMatrix) => {
        setMatrix(newMatrix);
        checkGameState(newMatrix);
        setPlayerTurn(true);
      })
    }
  }, [checkGameState, socket]);

  /**
   * Handler for game win checks that initializes a listener for this player
   */
  const handleGameOver = useCallback(() => {
    if (socket) {
      MinigameService.onGameOver(socket, (message: string) => {
        setGameOverMessage(message);
        setGameOver(true);
        setPlayerTurn(false);
      })  
    }
  }, [socket]);

  /**
   * Call back function to handle the leaderboard
   */
  // const handleLeaderBoard = useCallback(() => {
  //   if (socket) {
  //     MinigameService.onUpdateLeaderBoard(socket, (playerID: string) => {
  //       leaderboard.addScore(playerID);
  //       const updatedLeaderboard = new TicTacToeLeaderBoard(leaderboard.scores);
  //       setLeaderboard(updatedLeaderboard);        
  //     })
  //   }
  // }, [socket, leaderboard])

  /**
   * Call back function to restart the tic tac toe
   */
  const restart = useCallback(() => {
    if (socket) {
      setMatrix([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);
      setPlayerSymbol(playerSymbolStart);
      setPlayerTurn(playerTurnStart);
      setGameOver(false);
      setGameOverMessage('You Lost!');
    }
  }, [playerSymbolStart, playerTurnStart, socket])

  const handleGameRestarted = useCallback(() => {
    if (socket) {
      MinigameService.onRestartgame(socket, roomLabel, () => {
        restart();
      })
    }
  }, [restart, roomLabel, socket]);


  useEffect(() => {
    handleGameUpdate();
    handleGameOver();
    // handleLeaderBoard();
    handleGameRestarted();
    // return () => { socket?.off('on_update_leaderboard'); }
  }, [handleGameUpdate, handleGameOver, socket, handleGameRestarted])

  
  return (
    <> 
      {!gameOver && <GridModal playerTurn={playerTurn} matrix={matrix} playerSymbol={playerSymbol} closeModal={closeModal} updateGameMatrix={updateGameMatrix}/>}
      {gameOver && <GameOverModal minigameArea={minigameArea} gameOverMessage={gameOverMessage} closeModal={closeModal}/>}
    </>
  )
}