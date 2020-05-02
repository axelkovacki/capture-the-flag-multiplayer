const renderScreen = (screen, game, requestAnimationFrame, currentPlayerId) => {
  const context = screen.getContext('2d');
  const canvasWidth = game.state.screen.width;
  const canvasHeight = game.state.screen.height;

  screen.width = canvasWidth;
  screen.height = canvasHeight;

  context.fillStyle = 'white';
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  for (let row = 0; row < canvasHeight; row++) {
    context.fillStyle = '#F0DB4F';
    context.globalAlpha = 0.6;
    context.fillRect(canvasWidth/2, row, 1, 1);
  }
  
  for (const playerId in game.state.players) {
    const player = game.state.players[playerId];
    context.fillStyle = player.team === 0 ? '#00FD61' : '#3B8EEA';
    context.globalAlpha = 0.4;
    context.fillRect(player.x, player.y, 1, 1);
  }

  for (const flagId in game.state.flags) {
    const flag = game.state.flags[flagId];
    context.fillStyle = '#F0DB4F';
    context.globalAlpha = 1;
    context.fillRect(flag.x, flag.y, 1, 1);
  }

  const currentPlayer = game.state.players[currentPlayerId];

  if(currentPlayer) {
    context.fillStyle = currentPlayer.team === 0 ? '#00FD61' : '#3B8EEA';
    context.globalAlpha = 1
    context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1);
  }

  requestAnimationFrame(() => {
    renderScreen(screen, game, requestAnimationFrame, currentPlayerId);
  });
};

export default renderScreen;