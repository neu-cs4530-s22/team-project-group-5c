import { Socket } from 'socket.io';

export default function minigameSubscriptionHandler(socket: Socket): void {
  socket.on('join_game_room', async (minigameLabel: string) => {
    await socket.join(minigameLabel);
    socket.emit(`${minigameLabel}_room_joined`);
  });

  socket.on('start_game', async (minigameLabel: string) => {
    socket.emit('host_start_game');
    socket.to(minigameLabel).emit(`${minigameLabel}_game_started`);
  });
}