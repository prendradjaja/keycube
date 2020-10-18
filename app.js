const globalState = { // TODO rename to globals
  angle: 'right',
  startTime: undefined,
  alreadySolved: true,
  solution: [],
};
const cube = new Cube(); // TODO move to globalState
draw(cube);

document.addEventListener('keydown', event => {
  let move = getMove(event);
  if (event.code === 'Space') {
    if (!globalState.alreadySolved) {
      event.preventDefault();
      globalState.angle = otherAngle(globalState.angle);
      draw(cube);
      return;
    } else {
      scramble();
      return;
    }
  } else if (event.code === 'Backspace') { // TODO These probably should be part of the keyboard code/config
    const lastMove = globalState.solution.slice(-1)[0];
    if (!lastMove) {
      return;
    }

    move = Cube.inverse(lastMove);
  } else if (!move) {
    return;
  }

  cube.move(move);
  draw(cube);
  globalState.solution.push(move);
  drawSolution();

  if (cube.isSolved() && !globalState.alreadySolved) {
    const solveTime = (new Date().valueOf() - globalState.startTime) / 1000;
    console.log('Solved in: ' + solveTime);
    document.querySelector('button#scramble').disabled = false;
    globalState.alreadySolved = true;
  }
});

function scramble() {
  cube.init(Cube.random());
  draw(cube);
  document.querySelector('button#scramble').disabled = true;
  globalState.startTime = new Date().valueOf();
  globalState.alreadySolved = false;

  globalState.solution = [];
  drawSolution();
}

