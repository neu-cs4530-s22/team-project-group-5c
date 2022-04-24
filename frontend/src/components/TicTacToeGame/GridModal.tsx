import React from 'react';
import { Button, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text } from '@chakra-ui/react';
import styled from "styled-components";
import { GameBoardMatrix } from './TicTacToeTypes';


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

const ActiveCell = styled.div<ICellProps>`
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

const InactiveCell = styled.div<ICellProps>`
  width: 13em;
  height: 9em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  border-top: ${({ borderTop }) => borderTop && "3px solid #8e44ad"};
  border-left: ${({ borderLeft }) => borderLeft && "3px solid #8e44ad"};
  border-bottom: ${({ borderBottom }) => borderBottom && "3px solid #8e44ad"};
  border-right: ${({ borderRight }) => borderRight && "3px solid #8e44ad"};
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
  playerTurn: boolean;
  matrix: GameBoardMatrix;
  playerSymbol: 'x' | 'o';
  closeModal: ()=>void;
  updateGameMatrix: (column: number, row: number, symbol: "x" | "o")=>void;
}

export default function GridModal({playerTurn, matrix, playerSymbol, closeModal, updateGameMatrix}: TicTacToeGameModalProps): JSX.Element {
  type ShowCellProps = {
    column: string | null;
  }
  function ShowCell({column}: ShowCellProps): JSX.Element | null {
    if (column && column !== 'null') {
      if (column === 'x') {
        return (
          <X />
        );
      }
      return (
        <O />
      );
    }
    return null;
  }

  type ActiveOrInactiveCellProps = {
    rowIdx: number,
    columnIdx: number,
    column: string | null,
  }
  function ActiveOrInactiveCell({rowIdx, columnIdx, column}: ActiveOrInactiveCellProps): JSX.Element {
    if (matrix[rowIdx][columnIdx] === null || matrix[rowIdx][columnIdx] === "null") {
      return (
        <ActiveCell
          borderRight={columnIdx < 2}
          borderLeft={columnIdx > 0}
          borderBottom={rowIdx < 2}
          borderTop={rowIdx > 0}
          onClick={() =>
            updateGameMatrix(columnIdx, rowIdx, playerSymbol)
          }
        >
          <ShowCell column={column}/>
        </ActiveCell>
      )
    }
    return (
      <InactiveCell
        key={`cell ${columnIdx}`}
        borderRight={columnIdx < 2}
        borderLeft={columnIdx > 0}
        borderBottom={rowIdx < 2}
        borderTop={rowIdx > 0}
      >
        <ShowCell column={column}/>
      </InactiveCell>
    )
  }

  return (
    <> 
    <ModalHeader>Minigame </ModalHeader>
      <ModalBody>
        <Text fontSize='lg'>{playerSymbol === 'x'? 'You are player X' : 'You are player O'}</Text>
        <Text fontSize='sm' as='i'>{playerTurn? 'Your Turn!' : 'Opponent\'s turn'}</Text>
        <GameContainer>
          {(!playerTurn) && <PlayStopper />}
          {matrix.map((row, rowIdx) => (
              <RowContainer key={`row-container ${1 * rowIdx}`}>
                {row.map((column, columnIdx) => (
                  <ActiveOrInactiveCell key={`cell ${(3 * rowIdx) + columnIdx}`} rowIdx={rowIdx} columnIdx={columnIdx} column={column}/>
                ))}
              </RowContainer>
            ))}
        </GameContainer>
      </ModalBody><ModalCloseButton /><ModalFooter>
      <Button onClick={closeModal}>Cancel</Button>
    </ModalFooter>
    </>
  )
}