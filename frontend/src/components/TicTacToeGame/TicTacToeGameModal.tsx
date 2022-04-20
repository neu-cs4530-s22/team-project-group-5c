import { Button, ModalBody, ModalCloseButton, ModalFooter, ModalHeader } from '@chakra-ui/react';
import React from 'react';

type TicTacToeGameModalProps = {
  closeModal: ()=>void;
}

export default function TicTacToeGameModal({closeModal}: TicTacToeGameModalProps): JSX.Element {

  return (
    <><ModalHeader>Minigame</ModalHeader><ModalBody>HELLO</ModalBody><ModalCloseButton /><ModalFooter>
      <Button onClick={closeModal}>Cancel</Button>
    </ModalFooter></>
  )
}