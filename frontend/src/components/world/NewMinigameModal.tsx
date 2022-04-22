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
import React,{Dispatch, SetStateAction, useCallback, useEffect, useRef,useState } from 'react';
import MinigameArea, { MinigameAreaListener } from '../../classes/MinigameArea';
import TicTacToeGameModal from '../TicTacToeGame/TicTacToeGameModal';
import MinigameService from '../../classes/MinigameService';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import useMaybeVideo from '../../hooks/useMaybeVideo';
import useMinigameAreas from '../../hooks/useMinigameAreas';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import { StartGameOptions } from '../TicTacToeGame/TicTacToeTypes';
  
  
type NewMinigameWaitingProps = {
  myRef: React.MutableRefObject<Dispatch<SetStateAction<string[] | undefined>>|null>;
  minigameArea: MinigameArea;
  myPlayerID: string;
  closeModal: ()=>void;
  setGameStarted: (arg0: boolean) => void;
  isJoiningGameRoom: boolean;
}


/** 
 * Minigame modal component that opens when a new user starts playing a minigame. 
 */
function NewMinigameWaiting({myRef, minigameArea, myPlayerID, closeModal, setGameStarted, isJoiningGameRoom} : NewMinigameWaitingProps) : JSX.Element {
  const [playersByID, setPlayersByID] = useState<string[] | undefined>(minigameArea.playersByID);
  const [bodyMessage, setBodyMessage] = useState<string>("");
  const [isStartButtonHidden, setIsStartButtonHidden] = useState<boolean>(true);
  const {socket} = useCoveyAppState();
  const players = usePlayersInTown();

  useEffect(() => {
    myRef.current = setPlayersByID;
  }, [myRef])


  // Sets the listeners of the minigame area to perform the operations whenever they are called 
  // onPlayersChange will set the players list based on what is passed in
  // onMinigameAreaDestroyed will run the closeModal() operation which will remove them from the mini game area 
  useEffect(() => {
    const updateListener: MinigameAreaListener = {
      onPlayersChange: (newPlayers: string[]) => {
        setPlayersByID(newPlayers);
      },
      onMinigameAreaDestroyed: () => {
        closeModal();
      }
    };
    minigameArea.addListener(updateListener);
    return () => {
      minigameArea.removeListener(updateListener);
    };
  }, [setPlayersByID, minigameArea, closeModal]);

  useEffect(() => {
    if (playersByID && playersByID.length === 1) {
      setBodyMessage("Waiting for second player to connect ...");
      setIsStartButtonHidden(true);
    }
    // The server minigame has already been created 
    else if (playersByID && playersByID[0] === myPlayerID) { // Host
      const guestPlayer = players.find(player => player.id === playersByID[1]);
      setBodyMessage(`${guestPlayer?.userName} has joined the lobby. You can now start the game.`);
      setIsStartButtonHidden(false);
    } 
    else if (playersByID) {
      const hostPlayer = players.find(player => player.id === playersByID[0]);
      setBodyMessage(`Waiting for host ${hostPlayer?.userName} to start ...`);
    }
  }, [myPlayerID, players, playersByID]);

  /**
   * Host can start the game, which will trigger the socket client to emit the start_game message
   */
  const startGame = async () => {
    if (socket) {
      const gameStarted = await MinigameService.startMinigame(socket, minigameArea.label);
      if (gameStarted) {
        setGameStarted(true);

      }
    }
  }
  

  return (
    <><ModalHeader>Start a new game at: {minigameArea.label} </ModalHeader>
    <ModalBody>
      {isJoiningGameRoom ? "Joining...." : "Joined game waiting room! "}
      {bodyMessage}
    </ModalBody><ModalCloseButton /><ModalFooter>
      <Button onClick={startGame} hidden={isStartButtonHidden}>Start Game</Button>
      <Button onClick={closeModal}>Cancel</Button>
    </ModalFooter></>
  );
}

type NewMinigameModalProps = {
    isOpen: boolean;
    myPlayerID: string;
    closeModal: ()=>void;
    newMinigameLabel: string;
    isJoiningGameRoom: boolean;
}
export default function NewMinigameModal( {isOpen, myPlayerID, closeModal, newMinigameLabel, isJoiningGameRoom} : NewMinigameModalProps): JSX.Element {
  // Only the minigame label is passed into this modal for both the host and guest. After the host creates the minigame,
  // it is updated on the server, so the useMinigameAreas() hook will update the minigameAreas list here. Then, the label is 
  // used to actually find the area. 

  // You cannot just pass in the area here from the WorldMap as it needs to be created on the server first to avoid any discrepencies
  // between the server and frontend 
  const minigameAreas = useMinigameAreas();
  const newMinigame = minigameAreas.find(mg => mg.label === newMinigameLabel);

  const [isGameStarted, setGameStarted] = useState<boolean>(false);
  const [playerSymbol, setPlayerSymbol] = useState<'x'|'o'>('x');
  const [playerTurn, setPlayerTurn] = useState<boolean>(true);
  const {socket} = useCoveyAppState();

  const myRef = useRef<Dispatch<SetStateAction<string[] | undefined>>|null>(null);

  /**
   * When component gets rendered, this allows the guest to set up a listener waiting for the game to be started
   */
  const handleGameStart = useCallback(() => {
    if (socket && newMinigame) {
      MinigameService.onStartgame(socket, newMinigame.label, (options: StartGameOptions) => {
        setPlayerSymbol(options.symbol);
        if (options.start) setPlayerTurn(true);
        else setPlayerTurn(false);
        setGameStarted(true);
      })
    }
  }, [newMinigame, socket]);

  useEffect(() => {
    handleGameStart();
  }, [handleGameStart])

  const changeChildPlayersList = (newPlayers: string[]|undefined) => {
    if (myRef.current) {
      myRef.current(newPlayers);
    };
  };


  const video = useMaybeVideo()

  if (newMinigame) {
    return (
      <Modal isOpen={isOpen} onClose={()=>{closeModal(); video?.unPauseGame()}} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          {!isGameStarted && <NewMinigameWaiting myRef={myRef} minigameArea={newMinigame} myPlayerID={myPlayerID} closeModal={closeModal} setGameStarted={setGameStarted} isJoiningGameRoom={isJoiningGameRoom}/>}
          {isGameStarted && <TicTacToeGameModal minigameArea={newMinigame} closeModal={closeModal} roomLabel={newMinigame.label} playerSymbolStart={playerSymbol} playerTurnStart={playerTurn} setGameStarted={setGameStarted} changeWaitingPlayers={changeChildPlayersList}/>}
        </ModalContent>
      </Modal>
    );
  }
  return <></>
}
