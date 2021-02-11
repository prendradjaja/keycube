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

const crossSolvedScrambles = `D' F2 L2 U F2 D U2 F2 R2 U R' U' L2 R2 B L2 B' U2 R' U
D F2 R2 U2 R F B2 U' R' F2 U' D' F2 B2 D B2 L2 U' L2 U
U' D2 L B2 F2 D2 B2 R' F2 L2 R D' B U' B' F2 D' R'
R2 D R2 F' U2 B' D2 L2 B2 L2 F U2 R' F2 D L U R D L2
R' U2 F2 L2 B U2 R2 F U2 R2 F2 U2 R D F L' D' L2 B2 L
D L D2 B2 U R2 B2 L2 F2 U2 L2 U L2 R F U' L2 F R B' L
D2 F U2 F L2 F' R2 F' L2 R2 U2 D' L' B' U' B' L B2 D'
U' R B2 D' R2 D2 U' B2 U' B2 F2 U' L' R2 U B D2 R' F2
F2 L' B R2 D2 U2 F' L2 R2 D2 B' L2 U2 L' B2 L2 F2 U' F U2`.split('\n')

// https://stackoverflow.com/a/4550514
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function scramble() {
  // cube.init(Cube.random());
  cube.init(new Cube());
  cube.move(randomChoice(crossSolvedScrambles));

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
