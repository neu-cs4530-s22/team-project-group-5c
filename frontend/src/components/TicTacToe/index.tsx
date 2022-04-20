import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import gameContext from "./gameContext";
import MinigameService from "../../classes/MinigameService";
import useCoveyAppState from "../../hooks/useCoveyAppState";
import { nanoid } from "nanoid";

// import socketService from "./services/socketService";
// import MinigameService from "./services/MinigameService";




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

export type IPlayMatrix = Array<Array<string | null>>;
export interface IStartGame {
  start: boolean;
  symbol: "x" | "o";
}

export function Game(roomLabel: any) {
  const [matrix, setMatrix] = useState<IPlayMatrix>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const {socket} = useCoveyAppState();

  // const [playerSymbol, setPlayerSymbol] = useState<"x" | "o">("x");
  // const [isPlayerTurn, setPlayerTurn] = useState(false);

  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [canPlay, setCanPlay] = useState(true);

  // const changeMatrix = () => {

  //   socket?.on("updateGame", (matrix: any) => {
  //     console.log("use Effect",matrix);
  //     const newMatrix = [...matrix];
  //     setMatrix(newMatrix);
  //     setCanPlay(true);
  //   }
  // };

  // useEffect(() => {
  //   console.log("in use effect empty");
  //   socket?.on("updateGame", (matrix: any) => {
  //     console.log("use Effect",matrix);
  //     const newMatrix = [...matrix];
  //     setMatrix(newMatrix);
  //     setCanPlay(true);
  //   })
  //   // changeMatrix();
  //   },);


  const {
   playerSymbol,
   setPlayerSymbol,
   setPlayerTurn,
   isPlayerTurn,
    setGameStarted,
    isGameStarted,
  } = useContext(gameContext);


  const checkGameState = (matrix: IPlayMatrix) => {
    for (let i = 0; i < matrix?.length; i++) {
      let row = [];
      for (let j = 0; j < matrix[i].length; j++) {
        row.push(matrix[i][j]);
      }

      if (row.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } else if (row.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    for (let i = 0; i < matrix.length; i++) {
      let column = [];
      for (let j = 0; j < matrix[i].length; j++) {
        column.push(matrix[j][i]);
      }

      if (column.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } else if (column.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    if (matrix[1][1]) {
      if (matrix[0][0] === matrix[1][1] && matrix[2][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) return [true, false];
        else return [false, true];
      }

      if (matrix[2][0] === matrix[1][1] && matrix[0][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) return [true, false];
        else return [false, true];
      }
    }

    //Check for a tie
    if (matrix.every((m) => m.every((v) => v !== null))) {
      return [true, true];
    }

    return [false, false];
   };

  const updateGameMatrix = (column: number, row: number, symbol: "x" | "o") => {
    console.log("UPDATE GAME");
    console.log(symbol, "SYMBOLLLL");
    const newMatrix = [...matrix];


    

    if (newMatrix[row][column] === null || newMatrix[row][column] === "null") {
      newMatrix[row][column] = symbol;
      setMatrix(newMatrix);
    }

    if (socket) {
      console.log("new matrix in update game matrix is:::", newMatrix)
      MinigameService.updateGame(socket, newMatrix, roomLabel);
      const [currentPlayerWon, otherPlayerWon] = checkGameState(newMatrix);
      if (currentPlayerWon && otherPlayerWon) {
        MinigameService.gameWin(socket, "The Game is a TIE!");
        alert("The Game is a TIE!");
      } else if (currentPlayerWon && !otherPlayerWon) {
        MinigameService.gameWin(socket, "You Lost!");
        alert("You Won!");
      }

      setPlayerTurn(false);
    }
  };

  const handleGameUpdate = () => {
    console.log("handle game update ::::::::::::::::");
    if (socket)
    console.log("socket is valid (in handle game update line 179")
      MinigameService.onGameUpdate(socket, (newMatrix) => {
        console.log("matris is being set, handlegameupdate line 182")
        setMatrix(newMatrix);
        console.log("matrix is:::", newMatrix)
        checkGameState(newMatrix);
        setPlayerTurn(true);
      });
   };

  const handleGameStart = () => {

    console.log("handle game starrt ::::::::::::::::");
    if (socket)

   // MinigameService.onStartgame(socke)
      MinigameService.onStartGame(socket, (options) => {
        console.log("options SYMBOL", options.symbol);
        setGameStarted(true);
        setPlayerSymbol(options.symbol);
        if (options.start) setPlayerTurn(true);
        else setPlayerTurn(false);
      });
  };

  const handleGameWin = () => {
    if (socket)
      MinigameService.onGameWin(socket, (message) => {
        console.log("Here", message);
        setPlayerTurn(false);
        alert(message);
      });
  };

  // const handleCellClick = (e: any) => {
  //   const id = e.currentTarget.key;
  //   if (canPlay && board[id] == "") {
  //     setBoard((data) => ({ ...data, [id]: "X" }));
  //     socket?.emit("play", { id, roomLabel });
  //     setCanPlay(false);
  //   }

  //   if (
  //     (board[0] == "X" && board[1] == "X" && board[2] == "X") ||
  //     (board[0] == "O" && board[1] == "O" && board[2] == "O")
  //   ) {
  //     setBoard(["", "", "", "", "", "", "", "", ""]);
  //   }
  // };

  // useEffect(() => {
  //   handleGameUpdate();
  //   handleGameStart();
  //   handleGameWin();
  // }, []);

    useEffect(() => {
      handleGameUpdate();
    handleGameStart();
    handleGameWin();
  }, [handleGameUpdate(), handleGameStart(), handleGameWin()]);

  const iff = (condition: boolean, then: JSX.Element , otherwise: JSX.Element) => condition ? then : otherwise;

  //   { column && column !== "null" ? (
    // iff(column === "x", <X />, <O />)) : null
  // }

  return (
    <GameContainer>
     
       {/* {(!isPlayerTurn) && <PlayStopper />}  */}
      {matrix.map((row, rowIdx) => (
        // return (
          <RowContainer key={nanoid()}>
            {row.map((column, columnIdx) => (
              <Cell key={nanoid()}
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
        )
      )}
    </GameContainer>
  );
}