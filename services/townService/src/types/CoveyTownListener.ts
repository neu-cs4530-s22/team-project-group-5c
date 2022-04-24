import { ServerConversationArea, ServerMinigameArea } from '../client/TownsServiceClient';
import { ChatMessage } from '../CoveyTypes';
import TicTacToeLeaderBoard from './Leaderboard';
import Player from './Player';

/**
 * A listener for player-related events in each town
 */
export default interface CoveyTownListener {
  /**
   * Called when a player joins a town
   * @param newPlayer the new player
   */
  onPlayerJoined(newPlayer: Player): void;

  /**
   * Called when a player's location changes
   * @param movedPlayer the player that moved
   */
  onPlayerMoved(movedPlayer: Player): void;

  /**
   * Called when a player disconnects from the town
   * @param removedPlayer the player that disconnected
   */
  onPlayerDisconnected(removedPlayer: Player): void;

  /**
   * Called when a town is destroyed, causing all players to disconnect
   */
  onTownDestroyed(): void;

  /**
   * Called when a conversation area is created or updated
   * @param conversationArea the conversation area that is updated or created
   */
  onConversationAreaUpdated(conversationArea: ServerConversationArea) : void;

  /**
   * Called when a minigame area is created and when it is updated. Look in CoveyTownRequestHandlers to see the socket.emit 
   * message when a listener function is called. 
   * @param minigameArea the minigame area that is updated or created
   */
  onMinigameAreaUpdated(minigameArea: ServerMinigameArea) : void;

  /**
   * Called when a conversation area is destroyed
   * @param conversationArea the conversation area that has been destroyed
   */
  onConversationAreaDestroyed(conversationArea: ServerConversationArea): void;

  /**
   * Called when a minigame area is destroyed
   * @param minigameArea the minigame area that has been destroyed 
   */
  onMinigameAreaDestroyed(minigameArea: ServerMinigameArea): void;

  /**
   * Called when a chat message is received from a user
   * @param message the new chat message
   */
  onChatMessage(message: ChatMessage): void;

  onLeaderboardUpdated(updatedLeaderboard: TicTacToeLeaderBoard): void;
}
