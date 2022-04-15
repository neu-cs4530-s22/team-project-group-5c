import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React from 'react';
import useMaybeVideo from '../../hooks/useMaybeVideo';

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