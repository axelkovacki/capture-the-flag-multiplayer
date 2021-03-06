import express from 'express';
import http from 'http';
import createGame from './public/game.js';
import socketIo from 'socket.io';

const app = express();
const server = http.createServer(app);
const sockets = socketIo(server);

app.use(express.static('public'));

const game = createGame();
game.start();

game.subscribe((command) => {
  // console.log(`> Emitting: ${command.type}`);
  sockets.emit(command.type, command);
});

sockets.on('connection', (socket) => {
  const playerId = socket.id;
  console.log(`> Player connected: ${playerId}`);

  game.addPlayer({ playerId });

  socket.emit('setup', game.state);

  socket.on('move-player', (command) => {
    command.playerId = playerId;
    command.type = 'move-player';

    game.movePlayer(command);
  });

  socket.on('disconnect', () => {
    game.removePlayer({ playerId });
    console.log(`> Player disconnected: ${playerId}`);
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log(`> Server listening on port: ${process.env.PORT || 8080}`);
});