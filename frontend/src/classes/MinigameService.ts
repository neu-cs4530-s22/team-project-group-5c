import { Socket } from "socket.io-client";

export default class MinigameService {
  public static async joinMinigameRoom(socket: Socket, minigameLabel: string): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit("join_game_room", minigameLabel);
      socket.on(`${minigameLabel}_room_joined`, () => rs(true));
    });
  }

  public static async startMinigame(socket: Socket, minigameLabel: string): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit("start_game", minigameLabel);
      socket.on('host_start_game', ()=>rs(true));
    });
  }

  public static onStartgame(socket: Socket, minigameLabel: string, startGameListener: () => void): void {
    socket.on(`${minigameLabel}_game_started`, startGameListener);
  }
}

