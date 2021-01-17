const SOLVED = 'solved';
const SOLVING = 'solving';

const globalState = { // TODO rename to globals
  angle: 'right',
  startTime: undefined,
  state: SOLVED,
};
const cube = new Cube(); // TODO move to globalState
draw(cube);

document.addEventListener('keydown', event => {
  const move = getMove(event);
  if (event.code === 'Space') {
    if (globalState.state === SOLVING) {
      event.preventDefault();
      globalState.angle = otherAngle(globalState.angle);
      draw(cube);
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
  if (cube.isSolved() && globalState.state === SOLVING) {
    const solveTime = (new Date().valueOf() - globalState.startTime) / 1000;
    displayText('Solved in: ' + solveTime);
    document.querySelector('button#scramble').disabled = false;
    globalState.state = SOLVED;
  }
});

function scramble() {
  cube.init(Cube.random());
  // cube.init(new Cube());
  // cube.move('R U');

  draw(cube);
  document.querySelector('button#scramble').disabled = true;
  globalState.startTime = new Date().valueOf();
    globalState.state = SOLVING;
}

function displayText(text) {
  document.getElementById('text-display').innerText = text;
}

function clearText() {
  displayText('');
}
