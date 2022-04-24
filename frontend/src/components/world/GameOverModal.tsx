import {
    Button,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    } from '@chakra-ui/react';
import React, {useState } from 'react';
import useCoveyAppState from '../../hooks/useCoveyAppState';
    
  type GameOverModalProps = {
    // minigameArea: MinigameArea;
    // myPlayerID: string;
    closeModal: ()=>void;
    // setGameStarted: (arg0: boolean) => void;
    gameOverMessage: string;
    // isJoiningGameRoom: boolean;
  }
  
  /** 
   * Minigame modal component that opens when a new user starts playing a minigame. 
   */
  export default function GameOverModal({closeModal, gameOverMessage} : GameOverModalProps) : JSX.Element {
    // const [playersByID, setPlayersByID] = useState<string[]>(minigameArea.playersByID);
    // const [bodyMessage, setBodyMessage] = useState<string>("");
    const [isStartButtonHidden, setIsStartButtonHidden] = useState<boolean>(true);
    const {socket} = useCoveyAppState();
    
  
    /**
     * Host can start the game, which will trigger the socket client to emit the start_game message
     */
    const startGame = async () => {
      if (socket) {
        const gameStarted = false;
        // await MinigameService.startMinigame(socket, minigameArea.label);
        if (gameStarted) {
            const x = 1;
            //
        //   setGameStarted(true);
        }
      }
    }
    
    return (
      <><ModalHeader> Game Over: {gameOverMessage} </ModalHeader>
      <ModalBody>
          Leaderboard
        {/* LEADERBOARD STUFF */}
      </ModalBody><ModalCloseButton /><ModalFooter>
        <Button onClick={startGame} hidden={isStartButtonHidden}>Start New Game</Button>
        <Button onClick={closeModal}>Close</Button>
      </ModalFooter></>
    );
  }