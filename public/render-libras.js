import images from './assets/images.js';

const createElement = (document) => {
  const el = document.querySelector('.libras');
  el.innerHTML = '';

  return el;
}

const createH2Element = (document, el, title = '') => {
  let h2;
  h2 = document.createElement('h2'); 
  h2.appendChild(document.createTextNode(title));
  h2.style = 'font-weight: bold; margin-bottom: 10px;'
  el.appendChild(h2);
};

const createImgElement = (document, el, path, index, game, playerId, callback) => {
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
  img.onclick = (input) => callback(game, playerId, input);
  el.appendChild(img);
};

const onClickImgElement = (game, playerId, { srcElement: { className} }) => {
  if (className != 0) {
    return alert('Opção inválida');
  }

  game.updatePlayer({
    playerId,
    playerStopped: false
  });
};

const renderLibras = (document, game, playerId) => {
  const { state: { players } } = game;
  const { stopped } = players[playerId];

  if (stopped) {
    return false;
  }
  
  let randomizeImages = images.sort( () => .5 - Math.random());
  console.log(randomizeImages);

  const el = createElement(document);
  createH2Element(document, el, randomizeImages[0].name);

 
  for (let index = 0; index < 4; index++) {
    createImgElement(
      document,
      el,
      images[index].image,
      index,
      game,
      playerId,
      onClickImgElement
    );
  }
}

export default renderLibras;