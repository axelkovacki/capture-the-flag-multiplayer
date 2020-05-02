const createGame = () => {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 60,
      height: 30
    }
  };

  const observers = [];

  const start = () => {
    addFruit({ fruitId: 'flag1', fruitX: 5, fruitY: state.screen.height/2 });
    addFruit({ fruitId: 'flag2', fruitX: state.screen.width - 6, fruitY: state.screen.height/2 });
  };

  const subscribe = (observerFunction) => {
    observers.push(observerFunction);
  };

  const notifyAll = (command) => {
    for(const observerFunction of observers) {
      observerFunction(command);
    }
  };

  const setState = (newState) => {
    Object.assign(state, newState);
  };

  const addPlayer = ({ playerId, playerX, playerY, playerTeam }) => {
    if(!playerTeam) {
      let teamOne = 0;
      let teamTwo = 0;
      for (const playerId in state.players) {
        const player = state.players[playerId];
        if(player.team === 0) {
          teamOne++;
        }

        if(player.team === 1) {
          teamTwo++;
        }
      }

      playerTeam = 0
      if(teamOne > teamTwo) {
        playerTeam = 1;
      }
    }

    addFruit({ fruitId: 'flag1', fruitX: 5, fruitY: state.screen.height/2 });
    addFruit({ fruitId: 'flag2', fruitX: state.screen.width - 6, fruitY: state.screen.height/2 });

    if(playerTeam === 0) {
      playerX = state.screen.width/2 - 6;
      playerY = state.screen.height/2;
    }

    if(playerTeam === 1) {
      playerX = state.screen.width/2 + 6;
      playerY = state.screen.height/2;
    }

    state.players[playerId] = {
      x: playerX,
      y: playerY,
      team: playerTeam
    };

    notifyAll({
      type: 'add-player',
      playerId,
      playerX,
      playerY,
      playerTeam
    });
  };

  const removePlayer = ({ playerId }) => {
    delete state.players[playerId];

    notifyAll({
      type: 'remove-player',
      playerId
    });
  };

  const addFruit = (command) => {
    const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000);
    const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width);
    const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height);

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY
    };

    notifyAll({
      type: 'add-fruit',
      fruitId,
      fruitX,
      fruitY
    });
  };

  const removeFruit = ({ fruitId }) => {
    delete state.fruits[fruitId];

    notifyAll({
      type: 'remove-fruit',
      fruitId
    });
  };

  const checkForFruitCollision = (playerId) => {
    const player = state.players[playerId];

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];
      console.log(`Checking ${playerId} and ${fruitId}.`);

      if (player.x === fruit.x && player.y === fruit.y) {
        console.log(`Collision between ${playerId} and ${fruitId}.`);
        // removeFruit({ fruitId });
      }
    }            
  };

  const movePlayer = (command) => {
    notifyAll(command);

    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y - 1 >= 0) {
          player.y = player.y - 1;
        }
      },
      ArrowRight(player) {
        if (player.x + 1 < state.screen.width) {
          player.x = player.x + 1;
        }
      },
      ArrowDown(player) {
        if (player.y + 1 < state.screen.height) {
          player.y = player.y + 1;
        }
      },
      ArrowLeft(player) {
        if (player.x - 1 >= 0) {
          player.x = player.x - 1;
        }
      }
    }

    const player = state.players[command.playerId];
    const moveFunction = acceptedMoves[command.keyPressed];

    if (player && moveFunction) {
      moveFunction(player);
      checkForFruitCollision(command.playerId);
    }
  };

  return {
    addPlayer,
    removePlayer,
    movePlayer,
    addFruit,
    removeFruit,
    state,
    setState,
    subscribe,
    start
  }; 
};

export default createGame;