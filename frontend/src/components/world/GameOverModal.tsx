import {
    Button,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    OrderedList,
    ListItem,
    } from '@chakra-ui/react';
import React from 'react';
import TicTacToeLeaderBoard from '../../classes/Leaderboard';
import usePlayersInTown from '../../hooks/usePlayersInTown';
    
type GameOverModalProps = {
  leaderboard: TicTacToeLeaderBoard;
  closeModal: () => void;
  gameOverMessage: string;
  restart: () => void;
}

/** 
 * Game Over modal component that opens when the game finished and see the players win or lose and leaderboard 
 */
export default function GameOverModal({leaderboard, closeModal, gameOverMessage, restart} : GameOverModalProps): JSX.Element {
  
  const players = usePlayersInTown();

  const scoreItem = Object.keys(leaderboard.top10).map(key => 
      (<ListItem key={key}>{players.find(player => player.id === key)?.userName || null} {leaderboard.top10[key]}</ListItem>))

  return (
    <>
      <ModalHeader> Game Over: {gameOverMessage} </ModalHeader>
      <ModalBody>
        Leaderboard
        <OrderedList>
          {scoreItem}
        </OrderedList>
      </ModalBody><ModalCloseButton /><ModalFooter>
      <Button onClick={restart} colorScheme='purple' mr={3}>Start New Game</Button>
      <Button onClick={closeModal}>Close</Button>
    </ModalFooter></>
  );
}