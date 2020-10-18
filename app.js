const globalState = { // TODO rename to globals
  angle: 'right',
  startTime: undefined,
  alreadySolved: true,
};
const cube = new Cube(); // TODO move to globalState
draw(cube);

document.addEventListener('keydown', event => {
  const move = getMove(event);
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
  } else if (!move) {
    return;
  }

  cube.move(move);
  draw(cube);

  if (cube.eo.filter(x => !!x).length === 0 && !globalState.alreadySolved) {
    const solveTime = (new Date().valueOf() - globalState.startTime) / 1000;
    console.log('Solved in: ' + solveTime);
    document.querySelector('button#scramble').disabled = false;
    globalState.alreadySolved = true;
  }
});

function scramble() {
  cube.init(Cube.random());
  // cube.init(new Cube());
  // cube.move("F2 L U F U' D L2 B' D R2 U2 R' F2 D2 F2 L U2 L' U2 B2 L2");
  draw(cube);
  document.querySelector('button#scramble').disabled = true;
  globalState.startTime = new Date().valueOf();
  globalState.alreadySolved = false;
}
