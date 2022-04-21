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
import React,{useCallback, useContext, useEffect,useState } from 'react';
import MinigameArea, { MinigameAreaListener } from '../../classes/MinigameArea';
import MinigameService from '../../classes/MinigameService';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import useMaybeVideo from '../../hooks/useMaybeVideo';
import useMinigameAreas from '../../hooks/useMinigameAreas';
import TicTacToeGameModal from '../TicTacToeGame/TicTacToeGameModal';
import gameContext, { IGameContextProps } from '../TicTacToe/gameContext';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import { StartGameOptions } from '../TicTacToeGame/TicTacToeTypes';
  
  
type NewMinigameWaitingProps = {
  minigameArea: MinigameArea;
  myPlayerID: string;
  closeModal: ()=>void;
  setGameStarted: (arg0: boolean) => void;
  isJoiningGameRoom: boolean;
}


/** 
 * Minigame modal component that opens when a new user starts playing a minigame. 
 */
function NewMinigameWaiting({minigameArea, myPlayerID, closeModal, setGameStarted, isJoiningGameRoom} : NewMinigameWaitingProps) : JSX.Element {
  const [playersByID, setPlayersByID] = useState<string[]>(minigameArea.playersByID);
  const [bodyMessage, setBodyMessage] = useState<string>("");
  const [isStartButtonHidden, setIsStartButtonHidden] = useState<boolean>(true);
  const {socket} = useCoveyAppState();
  const players = usePlayersInTown();
  // const [isInRoom, setInRoom] = useState(false);
  // const [playerSymbol, setPlayerSymbol] = useState<"x" | "o">("x");
  // const [isPlayerTurn, setPlayerTurn] = useState(false);
  // const [isGameStarted, setGameStarted] = useState(false);

  // const gameContextValue: IGameContextProps = {
  //   isInRoom,
  //   setInRoom,
  //   playerSymbol,
  //   setPlayerSymbol,
  //   isPlayerTurn,
  //   setPlayerTurn,
  //   setGameStarted,
  //   isGameStarted
  // };



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
    if (playersByID.length === 1) {
      setBodyMessage("Waiting for second player to connect ...");
      setIsStartButtonHidden(true);
    }
    // The server minigame has already been created 
    else if (playersByID[0] === myPlayerID) { // Host
      const guestPlayer = players.find(player => player.id === playersByID[1]);
      setBodyMessage(`${guestPlayer?.userName} has joined the lobby. You can now start the game.`);
      setIsStartButtonHidden(false);
    } 
    else { // Guest
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

    // const {
    //   playerSymbol,
    //   setPlayerSymbol,
    //   setPlayerTurn,
    //   isPlayerTurn,
    //   // setGameStarted,
    //  //  isGameStarted,
    // } = useContext(gameContext);

    /**
     * When component gets rendered, this allows the guest to set up a listener waiting for the game to be started
     */
    const handleGameStart = useCallback(() => {
      if (socket && newMinigame) {
        MinigameService.onStartgame(socket, newMinigame.label, (options: StartGameOptions) => {
          console.log("OPTIONS SYMBOL IN MODAL ON START CALLBACK", options.symbol);
          setPlayerSymbol(options.symbol);
          console.log('NEW PLAYER SYMBOL', playerSymbol);
          if (options.start) setPlayerTurn(true);
          else setPlayerTurn(false);
          setGameStarted(true);
        })
      }
    }, [newMinigame, playerSymbol, socket]);

    useEffect(() => {
      handleGameStart();
    }, [handleGameStart])


    const video = useMaybeVideo()

    if (newMinigame) {
      return (
        <Modal isOpen={isOpen} onClose={()=>{closeModal(); video?.unPauseGame()}} closeOnOverlayClick={false}>
          <ModalOverlay />
          <ModalContent>
            {!isGameStarted && <NewMinigameWaiting minigameArea={newMinigame} myPlayerID={myPlayerID} closeModal={closeModal} setGameStarted={setGameStarted} isJoiningGameRoom={isJoiningGameRoom}/>}
            {isGameStarted && <TicTacToeGameModal minigameArea={newMinigame} closeModal={closeModal} roomLabel={newMinigame.label} playerSymbolStart={playerSymbol} playerTurnStart={playerTurn}/>}
            {/* {isGameStarted && < roomLabel={newMinigame.label} />} */}
          </ModalContent>
        </Modal>
      );
    }
    return <></>
  }
  