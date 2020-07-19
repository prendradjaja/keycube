const cube = new Cube();
cube.randomize();
draw(cube);

const startTime = new Date().valueOf();
let alreadySolved = false;

document.addEventListener('keydown', event => {
  const move = getMove(event);
  if (!move) {
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
