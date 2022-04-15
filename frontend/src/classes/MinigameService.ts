import { Socket } from "socket.io-client";

/**
 * Minigame service client that performs all of the socket connections. These functions are all static functions
 * that perform socket call initializations. 
 */
export default class MinigameService {

  /**
   * This function returns a boolean wrapped in a promise that returns true when the socket receives a room_joined message. 
   * Both the guest and the host call this function to emit a message to join game room.
   * @param socket Socket.io client connection
   * @param minigameLabel Unique minigame label which acts as a room label
   * @returns true if the socket receives a joined message
   */
  public static async joinMinigameRoom(socket: Socket, minigameLabel: string): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit("join_game_room", minigameLabel);
      socket.on(`${minigameLabel}_room_joined`, () => rs(true));
    });
  }

  /**
   * Only the host can call start minigame. This function will emit a start_game message to the server's socket and wait for a message
   * that the game was started. When the message is received, the promise returns true. 
   * @param socket Socket.io client
   * @param minigameLabel Unique minigame label
   * @returns true if the socket receives a message that host started game
   */
  public static async startMinigame(socket: Socket, minigameLabel: string): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit("start_game", minigameLabel);
      socket.on('host_start_game', ()=>rs(true));
    });
  }

  /**
   * Initializes socket listener waiting for game started
   * @param socket Socket.io client
   * @param minigameLabel unique minigame label
   * @param startGameListener listener callback
   */
  public static onStartgame(socket: Socket, minigameLabel: string, startGameListener: () => void): void {
    socket.on(`${minigameLabel}_game_started`, startGameListener);
  }
}

