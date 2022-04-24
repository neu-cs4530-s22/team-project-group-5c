import { Socket } from 'socket.io';
import CoveyTownController from '../lib/CoveyTownController';

type GameBoardMatrix = Array<Array<string | null>>;

export default function minigameSubscriptionHandler(socket: Socket, townController: CoveyTownController): void {

  // When the socket receives a join minigame message, a unique minigame label needs to be passed
  // and a socket room will be created with that minigame label.
  // This will emit a message to the player that they have joined the game room
  socket.on('join_game_room', async (minigameLabel: string) => {
    await socket.join(minigameLabel);
    socket.emit(`${minigameLabel}_room_joined`);
  });

  socket.on('leave_game_room', async (minigameLabel: string) => {
    await socket.leave(minigameLabel);
  });

  // When the host starts the game, this socket listener listens for the start_game message. 
  // Once the message is received, the host client gets a host_start_game message while the guest in the room receives a game started message
  socket.on('start_game', async (minigameLabel: string) => {
    socket.emit('host_start_game');
    socket.emit(`${minigameLabel}_game_started`, { start: true, symbol: 'x' });
    socket.to(minigameLabel).emit(`${minigameLabel}_game_started`, { start: false, symbol: 'o' });
  });

  socket.on('restart_game', async (minigameLabel: string) => {
    socket.emit(`${minigameLabel}_game_restarted`);
    socket.to(minigameLabel).emit(`${minigameLabel}_game_restarted`);
  });

  // When the game board is updated by a player, it will send the message to the other player
  socket.on('update_game', async (gameMatrix: GameBoardMatrix, minigameLabel: string) => {
    socket.to(minigameLabel).emit('on_game_update', gameMatrix);
  });

  // When the game is over, it will send a win message to the player that won, and a lose message to the other player 
  socket.on('game_over', async (message: string, minigameLabel: string) => {
    if (message === 'You Lost!') {
      socket.emit('on_game_over', 'Congrats You Won!');
    } else {
      socket.emit('on_game_over', message);
    }
    socket.to(minigameLabel).emit('on_game_over', message);
  });

  // socket.on('update_leaderboard', async (minigameLabel: string, playerID: string) => {
  //   socket.emit('on_update_leaderboard', playerID);
  //   socket.to(minigameLabel).emit('on_update_leaderboard', playerID);
  // });

  socket.on('update_leaderboard', async (playerID: string) => {
    townController.updateLeaderboard(playerID);
  });
}