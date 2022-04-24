import { Socket } from "socket.io-client";
import { GameBoardMatrix, StartGameOptions } from "../components/TicTacToeGame/TicTacToeTypes";
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

  public static async leaveMinigameRoom(socket: Socket, minigameLabel: string) {
    socket.emit('leave_game_room', minigameLabel);
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
      socket.on('host_start_game', () => rs(true));
    });
  }

  public static restartMinigame(socket: Socket, minigameLabel: string): void {
    socket.emit('restart_game', minigameLabel);
  }

  /**
   * Initializes socket listener waiting for game started
   * @param socket Socket.io client
   * @param minigameLabel unique minigame label
   * @param startGameListener listener callback
   */
  public static onStartgame(socket: Socket, minigameLabel: string, startGameListener: (options: StartGameOptions) => void): void {
    socket.on(`${minigameLabel}_game_started`, startGameListener);
  }

  public static onRestartgame(socket: Socket, minigameLabel: string, restartGameListener: () => void): void {
    socket.on(`${minigameLabel}_game_restarted`, restartGameListener);
  }

  /**
   * Emits a socket message to update the game matrix
   * @param socket Socket.io client
   * @param minigameLabel unique minigame label
   * @param gameMatrix game board state
   */
  public static async updateGame(socket: Socket, minigameLabel: string, gameMatrix: GameBoardMatrix) {
    socket.emit("update_game", gameMatrix, minigameLabel);
  }

  /**
   * Listens for a socket message to update the game board
   * @param socket Socket.io client
   * @param updateGameListener callback listener to update the game board state
   */
  public static async onGameUpdate(
    socket: Socket,
    updateGameListener: (matrix: GameBoardMatrix) => void
  ) {
    socket.on("on_game_update", ( matrix: GameBoardMatrix) => updateGameListener(matrix));
  }

  /**
   * Emits a game over message through the socket
   * @param socket Socket.io client
   * @param minigameLabel unique minigame label
   * @param message Gameover message to send to other player
   */
  public static async gameOver(socket: Socket, minigameLabel: string, message: string) {
    socket.emit("game_over", message, minigameLabel);
  }

  /**
   * Listens for a game over message
   * @param socket Socket.io client
   * @param gameOverListener callback listener to run when the game is over 
   */
  public static onGameOver(socket: Socket, gameOverListener: (message: string) => void) {
    socket.on("on_game_over", ( message: string) => {
      gameOverListener(message);
    });
  }

  // Leaderboard 
  public static updateLeaderBoard(socket: Socket, playerID: string) {
    socket.emit('update_leaderboard', playerID);
  }

  // public static onUpdateLeaderBoard(
  //   socket: Socket, 
  //   leaderboardListener: (playerID: string) => void 
  // ) {
  //   socket.on('on_update_leaderboard', (playerID: string) => {
  //     leaderboardListener(playerID)
  //   });
  // }
}

