/* eslint-disable no-nested-ternary */
import { Button, ModalBody, ModalCloseButton, ModalFooter, ModalHeader } from '@chakra-ui/react';
import styled from "styled-components";
import { PlayMatrix } from './TicTacToeTypes';

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
  playerTurn: boolean;
  matrix: PlayMatrix;
  playerSymbol: 'x' | 'o';
  closeModal: ()=>void;
  updateGameMatrix: (column: number, row: number, symbol: "x" | "o")=>void;
}

export default function GridModal({playerTurn, matrix, playerSymbol, closeModal, updateGameMatrix}: TicTacToeGameModalProps): JSX.Element {
// {gameOverMessage} 
  return (
    <> 
    <ModalHeader>Minigame </ModalHeader>
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
    </ModalFooter>
    </>
  )
}