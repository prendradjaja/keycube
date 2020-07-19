const cube = new Cube();
cube.randomize();
draw(cube);

document.addEventListener('keydown', event => {
  const move = getMove(event);
  if (!move) {
    return;
  }

  cube.move(move);
  draw(cube);
  if (cube.isSolved()) {
    window.alert('Yay!');
  }
});
