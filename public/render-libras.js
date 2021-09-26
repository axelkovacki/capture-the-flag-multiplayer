import images from './assets/images.js';

let state = {
  showing: false
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createElement = () => {
  document.querySelector('.sub').style = 'display: block;';
  const el = document.querySelector('.libras');
  el.innerHTML = '';
  state.showing = true;

  return el;
};

const eraseElement = () => {
  document.querySelector('.sub').style = 'display: none;';
  state.showing = false;
};

const createH2Element = (el, title = '') => {
  let h2;
  h2 = document.createElement('h2'); 
  h2.appendChild(document.createTextNode(title));
  h2.style = 'font-weight: bold; margin-bottom: 10px;'
  el.appendChild(h2);
};

const createImgElement = (el, path, index, randomIndex, game, playerId, callback) => {
  let img;
  img = document.createElement('img'); 
  img.src = `assets/${path}`;
  img.style = `
    cursor: pointer;
    height: 250px;
    margin: 5px;
    border-radius: 5px;
  `;
  img.className = index;
  img.onclick = (input) => callback(game, playerId, randomIndex, input);
  el.appendChild(img);
};

const onClickImgElement = (game, playerId, randomIndex, { srcElement: { className} }) => {
  if (className != randomIndex) {
    return alert('Opção inválida');
  }

  game.updatePlayer({
    playerId,
    playerStopped: false
  });

  eraseElement();
};

const renderLibras = (game, playerId) => {
  const { stopped } = game.state.players[playerId];

  if (!stopped || state.showing) {
    return false;
  }
  
  let randomizeImages = images
    .sort(() => .5 - Math.random())
    .slice(0, 4);

  let randomIndex = getRandomInt(0, 3);

  const el = createElement();
  createH2Element(
    el,
    randomizeImages[randomIndex].name
  );
 
  for (let index = 0; index < 4; index++) {
    createImgElement(
      el,
      images[index].image,
      index,
      randomIndex,
      game,
      playerId,
      onClickImgElement
    );
  }
};

export default renderLibras;