// import React, { useContext, useEffect, useState } from "react";
// import styled from "styled-components";
// import gameContext from "./gameContext";
// import socketService from "./services/socketService";
// import gameService from "./services/gameService";

// const GameContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   font-family: "Zen Tokyo Zoo", cursive;
//   position: relative;
// `;

// const RowContainer = styled.div`
//   width: 100%;
//   display: flex;
// `;

// interface ICellProps {
//   borderTop?: boolean;
//   borderRight?: boolean;
//   borderLeft?: boolean;
//   borderBottom?: boolean;
// }

// const Cell = styled.div<ICellProps>`
//   width: 13em;
//   height: 9em;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-radius: 20px;
//   cursor: pointer;
//   border-top: ${({ borderTop }) => borderTop && "3px solid #8e44ad"};
//   border-left: ${({ borderLeft }) => borderLeft && "3px solid #8e44ad"};
//   border-bottom: ${({ borderBottom }) => borderBottom && "3px solid #8e44ad"};
//   border-right: ${({ borderRight }) => borderRight && "3px solid #8e44ad"};
//   transition: all 270ms ease-in-out;

//   &:hover {
//     background-color: #8d44ad28;
//   }
// `;

// const PlayStopper = styled.div`
//   width: 100%;
//   height: 100%;
//   position: absolute;
//   bottom: 0;
//   left: 0;
//   z-index: 99;
//   cursor: default;
// `;

// const X = styled.span`
//   font-size: 100px;
//   color: #8e44ad;
//   &::after {
//     content: "X";
//   }
// `;

// const O = styled.span`
//   font-size: 100px;
//   color: #8e44ad;
//   &::after {
//     content: "O";
//   }
// `;

// export type IPlayMatrix = Array<Array<string | null>>;
// export interface IStartGame {
//   start: boolean;
//   symbol: "x" | "o";
// }

// export function Game() {
//   const [matrix, setMatrix] = useState<IPlayMatrix>([
//     [null, null, null],
//     [null, null, null],
//     [null, null, null],
//   ]);


//   const {
//     playerSymbol,
//     setPlayerSymbol,
//     setPlayerTurn,
//     isPlayerTurn,
//     setGameStarted,
//     isGameStarted,
//   } = useContext(gameContext);


//   const checkGameState = (matrix: IPlayMatrix) => {
//     for (let i = 0; i < matrix.length; i++) {
//       let row = [];
//       for (let j = 0; j < matrix[i].length; j++) {
//         row.push(matrix[i][j]);
//       }

//       if (row.every((value) => value && value === playerSymbol)) {
//         return [true, false];
//       } else if (row.every((value) => value && value !== playerSymbol)) {
//         return [false, true];
//       }
//     }

//     for (let i = 0; i < matrix.length; i++) {
//       let column = [];
//       for (let j = 0; j < matrix[i].length; j++) {
//         column.push(matrix[j][i]);
//       }

//       if (column.every((value) => value && value === playerSymbol)) {
//         return [true, false];
//       } else if (column.every((value) => value && value !== playerSymbol)) {
//         return [false, true];
//       }
//     }

//     if (matrix[1][1]) {
//       if (matrix[0][0] === matrix[1][1] && matrix[2][2] === matrix[1][1]) {
//         if (matrix[1][1] === playerSymbol) return [true, false];
//         else return [false, true];
//       }

//       if (matrix[2][0] === matrix[1][1] && matrix[0][2] === matrix[1][1]) {
//         if (matrix[1][1] === playerSymbol) return [true, false];
//         else return [false, true];
//       }
//     }

//     //Check for a tie
//     if (matrix.every((m) => m.every((v) => v !== null))) {
//       return [true, true];
//     }

//     return [false, false];
//    };

//   const updateGameMatrix = (column: number, row: number, symbol: "x" | "o") => {
//     const newMatrix = [...matrix];

//     if (newMatrix[row][column] === null || newMatrix[row][column] === "null") {
//       newMatrix[row][column] = symbol;
//       setMatrix(newMatrix);
//     }

//     if (socketService.socket) {
//       gameService.updateGame(socketService.socket, newMatrix);
//       const [currentPlayerWon, otherPlayerWon] = checkGameState(newMatrix);
//       if (currentPlayerWon && otherPlayerWon) {
//         gameService.gameWin(socketService.socket, "The Game is a TIE!");
//         alert("The Game is a TIE!");
//       } else if (currentPlayerWon && !otherPlayerWon) {
//         gameService.gameWin(socketService.socket, "You Lost!");
//         alert("You Won!");
//       }

//       setPlayerTurn(false);
//     }
//   };

//   const handleGameUpdate = () => {
//     if (socketService.socket)
//       gameService.onGameUpdate(socketService.socket, (newMatrix) => {
//         setMatrix(newMatrix);
//         checkGameState(newMatrix);
//         setPlayerTurn(true);
//       });
//    };

//   const handleGameStart = () => {
//     if (socketService.socket)
//       gameService.onStartGame(socketService.socket, (options) => {
//         setGameStarted(true);
//         setPlayerSymbol(options.symbol);
//         if (options.start) setPlayerTurn(true);
//         else setPlayerTurn(false);
//       });
//   };

//   const handleGameWin = () => {
//     if (socketService.socket)
//       gameService.onGameWin(socketService.socket, (message) => {
//         console.log("Here", message);
//         setPlayerTurn(false);
//         alert(message);
//       });
//   };

//   useEffect(() => {
//     handleGameUpdate();
//     handleGameStart();
//     handleGameWin();
//   }, []);

//   const iff = (condition: boolean, then: JSX.Element , otherwise: JSX.Element) => condition ? then : otherwise;

//   return (
//     <GameContainer>
//       {/* {!isGameStarted && (
//         <h2>Waiting for Other Player to Join to Start the Game!</h2>
//       )}
//       {(!isGameStarted || !isPlayerTurn) && <PlayStopper />} */}
//       {matrix.map((row, rowIdx) => (
//        // return (
//           <RowContainer key={row.toString()}>
//             {row.map((column, columnIdx) => (
//               <Cell key={column?.toString()}
//                 borderRight={columnIdx < 2}
//                 borderLeft={columnIdx > 0}
//                 borderBottom={rowIdx < 2}
//                 borderTop={rowIdx > 0}
//                 onClick={() =>
//                   updateGameMatrix(columnIdx, rowIdx, playerSymbol)
//                 }
//               >
//                 {column && column !== "null" ? (
//                   iff(column === "x", <X />, <O />)) : null
//                 }
//               </Cell>
//             ))}
//           </RowContainer>
//         )
//       )}
//     </GameContainer>
//   );
// }

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { StringDecoder } from "string_decoder";
import Cell from "./Cell/Cell";
import "./Main.css";


const Main = ( socket: any, roomCode: string ) => {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [canPlay, setCanPlay] = useState(true);

  const handleUpdate = (id: any) => {
    console.log("use Effect", id);
      setBoard((data) => ({ ...data, [id]: "O" }));
      setCanPlay(true);
  };


  useEffect(() => {
    socket.on("updateGame", (id :string) => {
      handleUpdate(id);
    });

    socket.off("updateGame");
  });

  const handleCellClick = (e: any) => {
    const { id } = e.currentTarget;
    if (canPlay && board[id] === "") {
      setBoard((data) => ({ ...data, [id]: "X" }));
      socket.emit("play", {id, roomCode});
      setCanPlay(false);
    }

    if (
      (board[0] === "X" && board[1] === "X" && board[2] === "X") ||
      (board[0] === "O" && board[1] === "O" && board[2] === "O")
    ) {
      setBoard(["", "", "", "", "", "", "", "", ""]);
    }
  };

  return (
    <main>
      <section className="main-section">
        <h1>HIIII TIC TAC TOe</h1>
        <Cell handleCellClick={handleCellClick} id="0" text={board[0]} />
        <Cell handleCellClick={handleCellClick} id="1" text={board[1]} />
        <Cell handleCellClick={handleCellClick} id="2" text={board[2]} />

        <Cell handleCellClick={handleCellClick} id="3" text={board[3]} />
        <Cell handleCellClick={handleCellClick} id="4" text={board[4]} />
        <Cell handleCellClick={handleCellClick} id="5" text={board[5]} />

        <Cell handleCellClick={handleCellClick} id="6" text={board[6]} />
        <Cell handleCellClick={handleCellClick} id="7" text={board[7]} />
        <Cell handleCellClick={handleCellClick} id="8" text={board[8]} />
      </section>
    </main>
  );
};

export default Main;