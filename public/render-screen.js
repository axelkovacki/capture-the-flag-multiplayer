const renderScreen = (screen, game, requestAnimationFrame, currentPlayerId) => {
  const context = screen.getContext('2d');
  const canvasWidth = game.state.screen.width;
  const canvasHeight = game.state.screen.height;

  screen.width = canvasWidth;
  screen.height = canvasHeight;

  context.fillStyle = 'white';
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  for (let row = 0; row < canvasHeight; row++) {
    context.fillStyle = 'blue';
    context.globalAlpha = 0.1;
    context.fillRect(canvasWidth/2, row, 1, 1);
  }
  
  for (const playerId in game.state.players) {
    const player = game.state.players[playerId];
    context.fillStyle = 'black';
    context.globalAlpha = 0.1;
    context.fillRect(player.x, player.y, 1, 1);
  }

  for (const fruitId in game.state.fruits) {
    const fruit = game.state.fruits[fruitId];
    context.fillStyle = 'red';
    context.globalAlpha = 1;
    context.fillRect(fruit.x, fruit.y, 1, 1);
  }

  const currentPlayer = game.state.players[currentPlayerId];

  if(currentPlayer) {
    context.fillStyle = '#F0DB4F';
    context.globalAlpha = 1
    context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1);
  }

  requestAnimationFrame(() => {
    renderScreen(screen, game, requestAnimationFrame, currentPlayerId);
  });
};

export default renderScreen;