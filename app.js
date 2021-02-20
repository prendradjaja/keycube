const SOLVED = 'solved';
const SOLVING = 'solving';
const INSPECTION = 'inspection';

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
    handleSpace();
  } else if (!move) {
    return;
  }

  handleMove(move);
});

function handleSpace() {
  if (globalState.state === SOLVING || globalState.state === INSPECTION) {
    event.preventDefault();
    globalState.angle = otherAngle(globalState.angle);
    draw(cube);
    return;
  } else if (globalState.state === SOLVED) {
    scramble();
    return;
  } else {
    throw new Error("Unreachable")
  }
}

function handleMove(move) {
  if (globalState.state === INSPECTION && !'xyz'.includes(move[0])) {
    globalState.startTime = new Date().valueOf();
    globalState.state = SOLVING;
    displayText('Solving');
  }

  cube.move(move);
  if (cube.isSolved() && globalState.state === SOLVING) {
    const solveTime = (new Date().valueOf() - globalState.startTime) / 1000;
    displayText(''+solveTime);
    console.log(''+solveTime);
    globalState.state = SOLVED;
  }
  draw(cube);
}

function scramble() {
  cube.init(Cube.random());
  // cube.init(new Cube());
  // cube.move('R');

  draw(cube);
  globalState.state = INSPECTION;
  displayText('Inspection');
}

function displayText(text) {
  document.getElementById('text-display').innerText = text;
}

function clearText() {
  displayText('');
}

function changeAngle() {
  // TODO DRY
  globalState.angle = otherAngle(globalState.angle);
  draw(cube);
}
