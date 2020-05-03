const renderScore = (document, game) => {
  const el = document.querySelector('.score');
  el.innerHTML = '';

  let score;
  let h2;

  h2 = document.createElement('h2'); 
  h2.appendChild(document.createTextNode(`Pontuação`));
  h2.style = 'margin-bottom: 10px;'
  el.appendChild(h2);

  score = game.state.scores['teamOne'];
  h2 = document.createElement('h2'); 
  h2.appendChild(document.createTextNode(`Time A: ${score} pontos`));
  el.appendChild(h2);

  score = game.state.scores['teamTwo'];
  h2 = document.createElement('h2'); 
  h2.appendChild(document.createTextNode(`Time B: ${score} pontos`));
  el.appendChild(h2);
}

export default renderScore;