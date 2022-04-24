import {
    Button,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    OrderedList,
    ListItem,
    } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import TicTacToeLeaderBoard from '../../classes/Leaderboard';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import MinigameArea from '../../classes/MinigameArea';
import MinigameService from '../../classes/MinigameService';
import useLeaderboard from '../../hooks/useLeaderboard';
    
type GameOverModalProps = {
  minigameArea: MinigameArea;
  closeModal: () => void;
  gameOverMessage: string;
}

/** 
 * Game Over modal component that opens when the game finished and see the players win or lose and leaderboard 
 */
export default function GameOverModal({minigameArea, closeModal, gameOverMessage} : GameOverModalProps): JSX.Element {
  const [isRestartButtonHidden, setIsRestartButtonHidden] = useState<boolean>(true);
  const {socket, myPlayerID } = useCoveyAppState();
  const leaderboard = useLeaderboard();
  console.log(leaderboard);

  useEffect(() => {
    // The server minigame has already been created 
    if (minigameArea.playersByID && minigameArea.playersByID[0] === myPlayerID) { // Host
      setIsRestartButtonHidden(false);
    } 
  }, [minigameArea.playersByID, myPlayerID]);
  
  /** 
   * Minigame modal component that opens when a new user starts playing a minigame. 
   */
    // const [playersByID, setPlayersByID] = useState<string[]>(minigameArea.playersByID);
    // const [bodyMessage, setBodyMessage] = useState<string>("");
    // const [isStartButtonHidden, setIsStartButtonHidden] = useState<boolean>(true);
    // const {socket} = useCoveyAppState();
    
  
    /**
     * Host can start the game, which will trigger the socket client to emit the start_game message
     */
    // const startGame = async () => {
    //   if (socket) {
    //     const gameStarted = false;
    //     // await MinigameService.startMinigame(socket, minigameArea.label);
    //     if (gameStarted) {
    //         const x = 1;
    //         //
    //     //   setGameStarted(true);
    //     }
    //   }
    // }

    const restartGame = async () => {
      if (socket) {
        MinigameService.restartMinigame(socket, minigameArea.label);
        // restart();
      }
    }  

    const players = usePlayersInTown();

    const top10 = leaderboard.top10();
    console.log(top10);

    const scoreItem = Object.keys(leaderboard.top10()).map(key => 
      (<ListItem key={key}>{players.find(player => player.id === key)?.userName || null} {leaderboard.top10()[key]}</ListItem>))



    return (
      <>
        <ModalHeader> Game Over: {gameOverMessage} </ModalHeader>
        <ModalBody>
          Leaderboard
          <OrderedList>
            {scoreItem}
          </OrderedList>
        </ModalBody><ModalCloseButton /><ModalFooter>
        <Button onClick={restartGame} hidden={isRestartButtonHidden} colorScheme='purple' mr={3}>Start New Game</Button>
        <Button onClick={closeModal}>Close</Button>
      </ModalFooter></>
    );
}