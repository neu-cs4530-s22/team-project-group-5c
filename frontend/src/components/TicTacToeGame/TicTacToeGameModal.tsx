/* eslint-disable no-nested-ternary */
import { Button, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Grid } from '@chakra-ui/react';
import styled from "styled-components";
import React, { useCallback, useEffect, useState } from 'react';
import { PlayMatrix } from './TicTacToeTypes';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import MinigameService from '../../classes/MinigameService';
import MinigameArea, { MinigameAreaListener } from '../../classes/MinigameArea';
import GameOverModal from '../world/GameOverModal'
import GridModal from './GridModal'
import TicTacToeLeaderBoard from '../../classes/Leaderboard';
import useLeaderboard from '../../hooks/useLeaderboard';


const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Zen Tokyo Zoo", cursive;
  position: relative;
`;

const RowContainer = styled.div`
  width: 100%;
  display: flex;
`;

interface ICellProps {
  borderTop?: boolean;
  borderRight?: boolean;
  borderLeft?: boolean;
  borderBottom?: boolean;
}

const Cell = styled.div<ICellProps>`
  width: 13em;
  height: 9em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  cursor: pointer;
  border-top: ${({ borderTop }) => borderTop && "3px solid #8e44ad"};
  border-left: ${({ borderLeft }) => borderLeft && "3px solid #8e44ad"};
  border-bottom: ${({ borderBottom }) => borderBottom && "3px solid #8e44ad"};
  border-right: ${({ borderRight }) => borderRight && "3px solid #8e44ad"};
  transition: all 270ms ease-in-out;
  &:hover {
    background-color: #8d44ad28;
  }
`;

const PlayStopper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 99;
  cursor: default;
`;

const X = styled.span`
  font-size: 100px;
  color: #8e44ad;
  &::after {
    content: "X";
  }
`;

const O = styled.span`
  font-size: 100px;
  color: #8e44ad;
  &::after {
    content: "O";
  }
`;

type TicTacToeGameModalProps = {
  minigameArea: MinigameArea;
  closeModal: ()=>void;
  roomLabel: string;
  playerSymbolStart: 'x' | 'o';
  playerTurnStart: boolean;
}

export default function TicTacToeGameModal({minigameArea, closeModal, roomLabel, playerSymbolStart, playerTurnStart}: TicTacToeGameModalProps): JSX.Element {

  const {socket} = useCoveyAppState();

  const [matrix, setMatrix] = useState<PlayMatrix>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  const [playerSymbol, setPlayerSymbol] = useState<'x'|'o'>(playerSymbolStart);
  const [playerTurn, setPlayerTurn] = useState<boolean>(playerTurnStart);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameOverMessage, setGameOverMessage] = useState<string>('You Lost!');

  const curPlayer = playerSymbol === 'x' ? minigameArea.playersByID[0] : minigameArea.playersByID[1];
  const [leaderboard, setLeaderboard] = useState<TicTacToeLeaderBoard>(useLeaderboard());
  
  useEffect(() => {
    const updateListener: MinigameAreaListener = {
      onMinigameAreaDestroyed: () => {
        closeModal();
      }
    };
    minigameArea.addListener(updateListener);
    return () => {
      minigameArea.removeListener(updateListener);
    };
  }, [minigameArea, closeModal]);

  const checkGameState = useCallback((gameMatrix: PlayMatrix) => {
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
        console.log("here")
        await MinigameService.gameOver(socket, roomLabel, "You Lost!");
        MinigameService.updateLeaderBoard(socket, roomLabel, curPlayer);
      }
      setPlayerTurn(false);
    }
  };

  const handleGameUpdate = useCallback(() => {
    if (socket) {
      MinigameService.onGameUpdate(socket, (newMatrix: PlayMatrix) => {
        setMatrix(newMatrix);
        checkGameState(newMatrix);
        setPlayerTurn(true);
      })
    }
  }, [checkGameState, socket]);

  const handleGameOver = useCallback(() => {
    if (socket) {
      MinigameService.onGameOver(socket, (message: string) => {
        setGameOverMessage(message);
        setGameOver(true);
        setPlayerTurn(false);
      })  
    }
  }, [socket]);

  const handleLeaderBoard = useCallback(() => {
    if (socket) {
      MinigameService.onUpdateLeaderBoard(socket, (playerID: string) => {
        leaderboard.addScore(playerID);
        const updatedLeaderboard = new TicTacToeLeaderBoard(leaderboard.scores);
        setLeaderboard(updatedLeaderboard);        
      })
    }
  }, [socket, leaderboard])

  const gameoverModal = <GameOverModal gameOverMessage={gameOverMessage} closeModal={closeModal} minigameLabel={minigameArea.label} leaderboard={leaderboard}/>

  useEffect(() => {
    handleGameUpdate();
    handleGameOver();
    handleLeaderBoard();
    return () => { socket?.off('on_update_leaderboard'); }
  }, [handleGameUpdate, handleGameOver, handleLeaderBoard, socket])

  return (
    <> 
      {!gameOver && <GridModal playerTurn={playerTurn} matrix={matrix} playerSymbol={playerSymbol} closeModal={closeModal} updateGameMatrix={updateGameMatrix}/>}
      {gameOver && <GameOverModal gameOverMessage={gameOverMessage} closeModal={closeModal} minigameLabel={minigameArea.label} leaderboard={leaderboard}/>}
    </>
  )
}