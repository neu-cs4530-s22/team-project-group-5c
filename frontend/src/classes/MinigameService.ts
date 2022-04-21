import { LabelImportant } from "@material-ui/icons";
import { AnyARecord } from "dns";
import { Socket } from "socket.io-client";
import { IPlayMatrix, IStartGame } from "../components/TicTacToe/ETC";
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
      socket.on('host_start_game', () => rs(true));
    });
  }

  /**
   * Initializes socket listener waiting for game started
   * @param socket Socket.io client
   * @param minigameLabel unique minigame label
   * @param startGameListener listener callback
   */
  public static onStartgame(socket: Socket, minigameLabel: string, startGameListener: (options: IStartGame) => void): void {
    // console.log("onStartgame in minigameService options: ", startGameListener)
    socket.on(`${minigameLabel}_game_started`, startGameListener);
  }


  public static async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit("join_game", { roomId });
      socket.on("room_joined", () => rs(true));
      socket.on("room_join_error", (error: any) => rj(error));
    });
  }

  public async updateGame(socket: Socket, gameMatrix: IPlayMatrix) {
    socket.emit("update_game", { matrix: gameMatrix });
  }

  public async onGameUpdate(
    socket: Socket,
    listiner: (matrix: IPlayMatrix) => void
  ) {
    socket.on("on_game_update", ( matrix: any) => listiner(matrix));
  }

  public async onStartGame(
    socket: Socket,
    listiner: (options: IStartGame) => void
  ) {
    socket.on("start_game", listiner);
  }

  public static async updateGame(socket: Socket, gameMatrix: IPlayMatrix, roomId: string) {
    console.log("updateGameSockett matrix is:  ", gameMatrix);
    console.log("roomid in minigame service  update game is: ", roomId)
    socket.emit("update_game", gameMatrix, roomId);
  }

  public static async onGameUpdate(
    socket: Socket | null,
    listiner: (matrix: IPlayMatrix) => void
  ) {
    console.log("ON GAME UPDATTE IN SERVICE ::::::::::::::::");
    socket?.on("on_game_update", (matrix: any) => listiner(matrix));   
  }

  public static async onStartGame(
    
    socket: Socket,
    listiner: (options: IStartGame) => void
  ) {
    console.log("onStartGame is being called");
    socket.on("start_game", listiner);
  }

  public static async gameWin(socket: Socket, message: string) {
    socket.emit("game_win", { message });
  }

  public static async onGameWin(socket: Socket, listiner: (message: string) => void) {
    socket.on("on_game_win", (message: any) => listiner(message));
  }
}

