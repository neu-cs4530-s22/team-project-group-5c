import { Socket } from "socket.io-client";
import { IPlayMatrix, IStartGame } from "../../index";

class GameService {
  public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
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
    socket.on("on_game_update", (matrix: any) => listiner(matrix));
  }

  public async onStartGame(
    socket: Socket,
    listiner: (options: IStartGame) => void
  ) {
    socket.on("start_game", listiner);
  }

  public async gameWin(socket: Socket, message: string) {
    socket.emit("game_win", { message });
  }

  public async onGameWin(socket: Socket, listiner: (message: string) => void) {
    socket.on("on_game_win", (message: any) => listiner(message));
  }
}

export default new GameService();