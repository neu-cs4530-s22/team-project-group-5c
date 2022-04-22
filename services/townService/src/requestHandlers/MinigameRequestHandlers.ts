import { Socket } from 'socket.io';

type GameBoardMatrix = Array<Array<string | null>>;

export default function minigameSubscriptionHandler(socket: Socket): void {

  // When the socket receives a join minigame message, a unique minigame label needs to be passed
  // and a socket room will be created with that minigame label.
  // This will emit a message to the player that they have joined the game room
  socket.on('join_game_room', async (minigameLabel: string) => {
    await socket.join(minigameLabel);
    // console.log('in join_game label: ', minigameLabel);
    socket.emit(`${minigameLabel}_room_joined`);
  });

  socket.on('leave_game_room', async (minigameLabel: string) => {
    await socket.leave(minigameLabel);
  });

  // When the host starts the game, this socket listener listens for the start_game message. 
  // Once the message is received, the host client gets a host_start_game message while the guest in the room receives a game started message
  socket.on('start_game', async (minigameLabel: string) => {
    socket.emit('host_start_game');
    socket.to(minigameLabel).emit(`${minigameLabel}_game_started`, { start: false, symbol: 'o' });
  });

  socket.on('update_game', async (gameMatrix: GameBoardMatrix, minigameLabel: string) => {
    // socket.emit('on_game_update', gameMatrix);
    socket.to(minigameLabel).emit('on_game_update', gameMatrix);
  });

  socket.on('game_over', async (message: string, minigameLabel: string) => {
    if (message === 'You Lost!') {
      socket.emit('on_game_over', 'Congrats You Won!');
    } else {
      socket.emit('on_game_over', message);
    }
    socket.to(minigameLabel).emit('on_game_over', message);
  });


}