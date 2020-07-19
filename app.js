const globalState = {
  angle: 'right'
};
const cube = new Cube(); // TODO move to globalState
cube.randomize();
draw(cube);

const startTime = new Date().valueOf();
let alreadySolved = false;

document.addEventListener('keydown', event => {
  const move = getMove(event);
  if (event.code === 'Tab') {
    event.preventDefault();
    console.log('hi');
    globalState.angle = otherAngle(globalState.angle);
    draw(cube);
    return;
  } else if (!move) {
    return;
  }

  cube.move(move);
  draw(cube);
  if (cube.isSolved() && !alreadySolved) {
    const solveTime = (new Date().valueOf() - startTime) / 1000;
    window.alert('Solved in: ' + solveTime);
    alreadySolved = true;
  }
});
