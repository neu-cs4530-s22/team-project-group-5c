import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    } from '@chakra-ui/react';
import {useCallback, useEffect,useState } from 'react';
import MinigameArea, { MinigameAreaListener } from '../../classes/MinigameArea';
import MinigameService from '../../classes/MinigameService';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import usePlayersInTown from '../../hooks/usePlayersInTown';
    
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
    // const players = usePlayersInTown();
  
    // Sets the listeners of the minigame area to perform the operations whenever they are called 
    // onPlayersChange will set the players list based on what is passed in
    // onMinigameAreaDestroyed will run the closeModal() operation which will remove them from the mini game area 
    // useEffect(() => {
    //   const updateListener: MinigameAreaListener = {
    //     onPlayersChange: (newPlayers: string[]) => {
    //       setPlayersByID(newPlayers);
    //     },
    //     onMinigameAreaDestroyed: () => {
    //       closeModal();
    //     }
    //   };
    //   minigameArea.addListener(updateListener);
    //   return () => {
    //     minigameArea.removeListener(updateListener);
    //   };
    // }, [setPlayersByID, minigameArea, closeModal]);
  
    // useEffect(() => {
    //   if (playersByID.length === 1) {
    //     setBodyMessage("Waiting for second player to connect ...");
    //     setIsStartButtonHidden(true);
    //   }
    //   // The server minigame has already been created 
    //   else if (playersByID[0] === myPlayerID) { // Host
    //     const guestPlayer = players.find(player => player.id === playersByID[1]);
    //     setBodyMessage(`${guestPlayer?.userName} has joined the lobby. You can now start the game.`);
    //     setIsStartButtonHidden(false);
    //   } 
    //   else { // Guest
    //     const hostPlayer = players.find(player => player.id === playersByID[0]);
    //     setBodyMessage(`Waiting for host ${hostPlayer?.userName} to start ...`);
    //   }
    // }, [myPlayerID, players, playersByID]);
  
    /**
     * Host can start the game, which will trigger the socket client to emit the start_game message
     */
    const startGame = async () => {
      if (socket) {
        const gameStarted = false;
        //await MinigameService.startMinigame(socket, minigameArea.label);
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