/* eslint-disable no-nested-ternary */
import { Button, ModalBody, ModalCloseButton, ModalFooter, ModalHeader } from '@chakra-ui/react';
import styled from "styled-components";
import React, { useCallback, useEffect, useState } from 'react';
import { PlayMatrix } from './TicTacToeTypes';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import MinigameService from '../../classes/MinigameService';
import MinigameArea, { MinigameAreaListener } from '../../classes/MinigameArea';

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
    console.log('NUEJBOAWBOAWNDPIANBDABPN', symbol);
    const newMatrix = [...matrix];

    if (newMatrix[row][column] === null || newMatrix[row][column] === "null") {
      newMatrix[row][column] = symbol;
      setMatrix(newMatrix);
    }

    if (socket) {
      MinigameService.updateGame(socket, roomLabel, newMatrix);
      const [currentPlayerWon, otherPlayerWon] = checkGameState(newMatrix);
      console.log("MEEEEE", currentPlayerWon);
      console.log("OTHERRRRR", otherPlayerWon);
      if (currentPlayerWon && otherPlayerWon) {
        await MinigameService.gameWin(socket, roomLabel, "The Game is a TIE!");
      } else if (currentPlayerWon && !otherPlayerWon) {
        console.log("I WON THE GAME");
        await MinigameService.gameWin(socket, roomLabel, "You Lost!");
        console.log('after await')
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

  const handleGameWin = useCallback(() => {
    if (socket) {
      MinigameService.onGameWin(socket, (message: string) => {
        setPlayerTurn(false);
        console.log(message);
      })
    }
  }, [socket]);

  useEffect(() => {
    handleGameUpdate();
    handleGameWin();
  }, [handleGameUpdate, handleGameWin])



  return (
    <><ModalHeader>Minigame</ModalHeader>
    <ModalBody>
    <GameContainer>
      {(!playerTurn) && <PlayStopper />}
      {matrix.map((row, rowIdx) => (
          <RowContainer key='row-container'>
            {row.map((column, columnIdx) => (
              <Cell
                key='cell'
                borderRight={columnIdx < 2}
                borderLeft={columnIdx > 0}
                borderBottom={rowIdx < 2}
                borderTop={rowIdx > 0}
                onClick={() =>
                  updateGameMatrix(columnIdx, rowIdx, playerSymbol)
                }
              >
                {column && column !== "null" ? (
                  column === "x" ? (
                    <X />
                  ) : (
                    <O />
                  )
                ) : null}
              </Cell>
            ))}
          </RowContainer>
        ))}
    </GameContainer>
    </ModalBody><ModalCloseButton /><ModalFooter>
    <Button onClick={closeModal}>Cancel</Button>
    </ModalFooter></>
  )
}