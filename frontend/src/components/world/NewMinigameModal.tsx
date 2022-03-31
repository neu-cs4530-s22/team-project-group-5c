import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  
  useToast
  } from '@chakra-ui/react';
  import React,{ useCallback,useState } from 'react';
  import ConversationArea from '../../classes/ConversationArea';
import MinigameArea from '../../classes/MinigameArea';
  import useCoveyAppState from '../../hooks/useCoveyAppState';
  import useMaybeVideo from '../../hooks/useMaybeVideo';
  
  
  type NewMinigameModalProps = {
      isOpen: boolean;
      bodyMessage: string;
      isStartButtonVisible: boolean;
      closeModal: ()=>void;
      newMinigameArea: MinigameArea;
  }
  export default function NewMinigameModal( {isOpen, bodyMessage, isStartButtonVisible, closeModal, newMinigameArea} : NewMinigameModalProps): JSX.Element {
      // const [topic, setTopic] = useState<string>('');
      // const {apiClient, sessionToken, currentTownID} = useCoveyAppState();
  
      // const toast = useToast()
      const video = useMaybeVideo()
  
      // const createConversation = useCallback(async () => {
      //   if (topic) {
      //       const conversationToCreate = newConversation;
      //       conversationToCreate.topic = topic;
      //     try {
      //       await apiClient.createConversation({
      //         sessionToken,
      //         coveyTownID: currentTownID,
      //         conversationArea: conversationToCreate.toServerConversationArea(),
      //       });
      //       toast({
      //         title: 'Conversation Created!',
      //         status: 'success',
      //       });
      //       video?.unPauseGame();
      //       closeModal();
      //     } catch (err) {
      //       toast({
      //         title: 'Unable to create conversation',
      //         description: err.toString(),
      //         status: 'error',
      //       });
      //     }
      //   }
      // }, [topic, apiClient, newConversation, closeModal, currentTownID, sessionToken, toast, video]);
      return (
        <Modal isOpen={isOpen} onClose={()=>{closeModal(); video?.unPauseGame()}}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Start a new game at: {newMinigameArea.label} </ModalHeader>
            <ModalBody>{bodyMessage}</ModalBody>
            <ModalCloseButton />
              <ModalFooter>
                <Button onClick={closeModal} hidden={isStartButtonVisible}>Start Game</Button>
                <Button onClick={closeModal}>Cancel</Button>
              </ModalFooter>
          </ModalContent>
        </Modal>
      );
  }
  