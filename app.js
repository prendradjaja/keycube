const globalState = { // TODO rename to globals
  angle: 'right',
  startTime: undefined,
  alreadySolved: true,
  trainingAlg: undefined,
};

globalState.trainingAlg = window.prompt();
if (!globalState.trainingAlg) {
  document.body.style.display = 'none';
}

const cube = new Cube(); // TODO move to globalState
draw(cube);

document.addEventListener('keydown', event => {
  const move = getMove(event);
  if (event.code === 'Space') {
    if (!globalState.alreadySolved) {
      const yes = window.confirm('Reset?');
      if (yes) { scramble(); }
      return;
    } else {
      scramble();
      return;
    }
  } else if (!move) {
    return;
  }

  cube.move(move);
  draw(cube);
  if (cube.isSolved() && !globalState.alreadySolved) {
    const solveTime = (new Date().valueOf() - globalState.startTime) / 1000;
    console.log('Solved in: ' + solveTime);
    document.querySelector('button#scramble').disabled = false;
    globalState.alreadySolved = true;
  }
});

function scramble() {
  cube.init(new Cube());
  cube.move(Cube.inverse(globalState.trainingAlg));
  draw(cube);
  document.querySelector('button#scramble').disabled = true;
  globalState.startTime = new Date().valueOf();
  globalState.alreadySolved = false;
}
