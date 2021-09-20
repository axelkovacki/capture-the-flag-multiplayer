import images from './assets/images.js';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createElement = (document) => {
  document.querySelector('.sub').style = 'display: block;';
  const el = document.querySelector('.libras');
  el.innerHTML = '';

  return el;
};

const eraseElement = (document) => {
  document.querySelector('.sub').style = 'display: none;';
};

const createH2Element = (document, el, title = '') => {
  let h2;
  h2 = document.createElement('h2'); 
  h2.appendChild(document.createTextNode(title));
  h2.style = 'font-weight: bold; margin-bottom: 10px;'
  el.appendChild(h2);
};

const createImgElement = (document, el, path, index, randomIndex, game, playerId, callback) => {
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

const renderLibras = (document, game, { playerId, playerStopped }) => {
  console.log(game);
  console.log(playerId);
  if (!playerStopped) {
    return false;
  }
  
  let randomizeImages = images
    .sort(() => .5 - Math.random())
    .slice(0, 4);

  let randomIndex = getRandomInt(0, 4);

  console.log(randomizeImages[randomIndex]);
  const el = createElement(document);
  createH2Element(
    document,
    el,
    randomizeImages[randomIndex].name
  );
 
  for (let index = 0; index < 4; index++) {
    createImgElement(
      document,
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