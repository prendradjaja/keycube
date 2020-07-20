const globalState = { // TODO rename to globals
  angle: 'right',
  startTime: undefined,
  alreadySolved: true, // TODO rename
  solverInitialized: false,
};
let cube = new Cube(); // TODO move to globalState
draw(cube);

setTimeout(() => {
  Cube.initSolver();
  globalState.solverInitialized = true;
}, 10);

document.addEventListener('keydown', event => {
  const move = getMove(event);
  if (event.code === 'Tab') {
    event.preventDefault();
    globalState.angle = otherAngle(globalState.angle);
    draw(cube);
    return;
  } else if (event.code === 'Space' && globalState.alreadySolved) {
    scramble();
    return;
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
    congrats();
  }
});

function scramble() {
  cube = new Cube().move(getCrossSolvedScramble());
  draw(cube);
  document.querySelector('button#scramble').disabled = true;
  globalState.startTime = new Date().valueOf();
  globalState.alreadySolved = false;
}

async function congrats() {
  for (let i = 0; i < 4; i++) {
    await wait(150);
    cube.move('y');
    draw(cube);
  }
  for (let i = 0; i < 4; i++) {
    await wait(150);
    cube.move('x');
    draw(cube);
  }
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
