const createGame = () => {
  const state = {
    scores: {
      teamOne: 0,
      teamTwo: 0
    },
    players: {},
    flags: {},
    screen: {
      width: 60,
      height: 30
    }
  };

  const observers = [];

  const start = () => {
    addFlag({ flagId: 'flag1', flagX: 5, flagY: state.screen.height/2, flagTeam: 0 });
    addFlag({ flagId: 'flag2', flagX: state.screen.width - 6, flagY: state.screen.height/2, flagTeam: 1 });
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

  const updateScore = ({ teamId, teamScore }) => {
    state.scores[teamId] = teamScore;

    notifyAll({
      type: 'update-score',
      teamId,
      teamScore
    });
  };

  const addPlayer = ({ playerId, playerX, playerY, playerTeam, playerFlag, playerStopped }) => {
    if (!playerTeam) {
      let teamOne = 0;
      let teamTwo = 0;
      for (const playerId in state.players) {
        const player = state.players[playerId];
        if (player.team === 0) {
          teamOne++;
        }

        if (player.team === 1) {
          teamTwo++;
        }
      }

      playerTeam = 0
      if (teamOne > teamTwo) {
        playerTeam = 1;
      }
    }

    if (playerTeam === 0) {
      playerX = state.screen.width/2 - 6;
      playerY = state.screen.height/2;
    }

    if (playerTeam === 1) {
      playerX = state.screen.width/2 + 6;
      playerY = state.screen.height/2;
    }

    if (!playerFlag) {
      playerFlag = null;
    }

    if (!playerStopped) {
      playerStopped = false;
    }

    state.players[playerId] = {
      x: playerX,
      y: playerY,
      team: playerTeam,
      flag: playerFlag,
      stopped: playerStopped
    };

    notifyAll({
      type: 'add-player',
      playerId,
      playerX,
      playerY,
      playerTeam,
      playerFlag,
      playerStopped
    });
  };

  const movePlayer = (command) => {
    notifyAll(command);

    const acceptedMoves = {
      ArrowUp(player) {
        if (!player.stopped && player.y - 1 >= 0) {
          player.y = player.y - 1;
        }
      },
      ArrowRight(player) {
        if (!player.stopped && player.x + 1 < state.screen.width) {
          player.x = player.x + 1;
        }
      },
      ArrowDown(player) {
        if (!player.stopped && player.y + 1 < state.screen.height) {
          player.y = player.y + 1;
        }
      },
      ArrowLeft(player) {
        if (!player.stopped && player.x - 1 >= 0) {
          player.x = player.x - 1;
        }
      }
    }

    const player = state.players[command.playerId];
    const moveFunction = acceptedMoves[command.keyPressed];

    if (player && moveFunction) {
      moveFunction(player);
      checkForFlagCollision(command.playerId);
    }
  };

  const updatePlayer = ({ playerId, playerX, playerY, playerTeam, playerFlag, playerStopped }) => {
    const player = state.players[playerId];

    if (!playerX) {
      playerX = player.x;
    }

    if (!playerY) {
      playerY = player.y;
    }

    if (!playerTeam) {
      playerTeam = player.team;
    }

    if (playerStopped === null || playerStopped === undefined) {
      playerStopped = player.stopped;
    }

    state.players[playerId] = {
      x: playerX,
      y: playerY,
      team: playerTeam,
      flag: playerFlag,
      stopped: playerStopped
    }

    notifyAll({
      type: 'update-player',
      playerId,
      playerX,
      playerY,
      playerTeam,
      playerFlag,
      playerStopped
    });
  };

  const removePlayer = ({ playerId }) => {
    delete state.players[playerId];

    notifyAll({
      type: 'remove-player',
      playerId
    });
  };

  const addFlag = (command) => {
    const flagId = command ? command.flagId : Math.floor(Math.random() * 10000000);
    const flagX = command ? command.flagX : Math.floor(Math.random() * state.screen.width);
    const flagY = command ? command.flagY : Math.floor(Math.random() * state.screen.height);
    const flagTeam = command ? command.flagTeam : 0;

    state.flags[flagId] = {
      x: flagX,
      y: flagY,
      team: flagTeam
    };

    notifyAll({
      type: 'add-flag',
      flagId,
      flagX,
      flagY,
      flagTeam
    });
  };

  const moveFlag = ({ flagId, flagX, flagY }) => {
    const flag = state.flags[flagId];
    state.flags[flagId] = {
      ...flag,
      x: flagX,
      y: flagY
    };

    notifyAll({
      type: 'move-flag',
      flagId,
      flagX,
      flagY
    });
  };

  const removeFlag = ({ flagId }) => {
    delete state.flags[flagId];

    notifyAll({
      type: 'remove-flag',
      flagId
    });
  };

  const checkForFlagCollision = (playerId) => {
    const player = state.players[playerId];

    for (const playerIdInComing in state.players) {
      if(playerId === playerIdInComing) {
        continue;
      }

      const playerInComing = state.players[playerIdInComing];

      if (player.x !== playerInComing.x || player.y !== playerInComing.y) {
        continue;
      }

      if (player.x > state.screen.width / 2) {
        // Disblock moves of team zero enemy.
        if (player.team === playerInComing.team) {
          updatePlayer({
            playerId: playerIdInComing,
            playerStopped: false
          });
        }

        // Block moves of team zero enemy.
        if (player.team !== playerInComing.team) {
          updatePlayer({
            playerId: player.team === 0 ? playerId : playerIdInComing,
            playerStopped: true
          });
        }
      }

      if (player.x < state.screen.width / 2) {
        // Disblock moves of team one enemy.
        if (player.team === playerInComing.team) {
          updatePlayer({
            playerId: playerIdInComing,
            playerStopped: false
          });
        }

        // Block moves of team one enemy.
        if (player.team !== playerInComing.team) {
          updatePlayer({
            playerId: player.team === 1 ? playerId : playerIdInComing,
            playerStopped: true
          });
        }
      }
    }

    for (const flagId in state.flags) {
      const flag = state.flags[flagId];

      // Player get enemy flag.
      if (player.x === flag.x && player.y === flag.y && player.team !== flag.team) {
        updatePlayer({ playerId, playerFlag: flagId });
      }

      if (player.flag !== flagId) {
        continue;
      }
      
      // Player move flag after move your self.
      moveFlag({ flagId, flagX: player.x, flagY: player.y });

      // Player comes to an end with enemy flag.
      if (player.x === state.screen.width / 2 && player.y < state.screen.height) {
        if (flag.team === 0) {
          updateScore({ teamId: 'teamOne', teamScore: state.scores['teamOne'] += 1 });
          updatePlayer({ playerId, playerFlag: null });
          moveFlag({ flagId, flagX: 5, flagY: state.screen.height/2 }); 
        }

        if (flag.team === 1) {
          updateScore({ teamId: 'teamTwo', teamScore: state.scores['teamTwo'] += 1 });
          updatePlayer({ playerId, playerFlag: null });
          moveFlag({ flagId, flagX: state.screen.width - 6, flagY: state.screen.height/2 });
        }
      }
    }            
  };

  return {
    updateScore,
    addPlayer,
    updatePlayer,
    removePlayer,
    movePlayer,
    addFlag,
    moveFlag,
    removeFlag,
    state,
    setState,
    subscribe,
    start
  }; 
};

export default createGame;