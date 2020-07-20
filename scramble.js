const NUM_EDGES = 12;
const NUM_CORNERS = 8;

const scrambles = [];

function getCrossSolvedScramble() {
  return scrambles.shift() || 'U2 D2';
}

setInterval(() => {
  if (globalState.alreadySolved && scrambles.length < 10) {
    const c = randomCube();
    const solve = getSolve(c);

    if (solve) {
      document.querySelector('button#scramble').disabled = false;
      scrambles.push(Cube.inverse(solve));
    }
  }
}, 0);

/**
 * Not necessarily solvable
 */
function randomCube() {
  const c = new Cube();

  // cubejs represents a cube state as EP, EO, CP, and CO (edge/corner permutation/orientation)
  // a solved cube looks like:
  // ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  // eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  // cp: [0, 1, 2, 3, 4, 5, 6, 7]
  // co: [0, 0, 0, 0, 0, 0, 0, 0]

  c.ep = generateEdgePermutation();
  c.eo = generateEdgeOrientations();
  c.cp = _.shuffle(c.cp);
  c.co = new Array(NUM_CORNERS).fill(null).map(x => _.random());
  return c;
}

function generateEdgePermutation() {
  const crossEdges = [4, 5, 6, 7];
  let otherEdges = [0, 1, 2, 3, 8, 9, 10, 11];
  otherEdges = _.shuffle(otherEdges);
  return [
    ...otherEdges.slice(0, 4),
    ...crossEdges,
    ...otherEdges.slice(4, 8)
  ];
}

function generateEdgeOrientations() {
  return [
    ...new Array(4).fill(null).map(x => _.random()),
    0, 0, 0, 0,
    ...new Array(4).fill(null).map(x => _.random())
  ];
}

/**
 * e.g. given [1, 2, 3], this function could return either of these two values:
 *   [2, 3, 1]
 *   [3, 1, 2]
 *
 * But not:
 *   [1, 2, 3]  The array will always be shifted at least one position.
 *   [3, 2, 1]  The array won't be arbitrarily rearranged, just shifted in a circle.
 *
 * The array given must be at least two items long.
 */
function randomCycleShift(cycle) {
  const offset = _.random(1, cycle.length - 1);
  cycle = cycle.slice(0); // copy
  for (let i = 0; i < offset; i++) {
    cycle.push(cycle.shift());
  }
  return cycle;
}

/**
 * e.g. given { 2: 5, 1: 1 }, this function will return 2 five times as often as 1.
 */
function weightedRandom(ratios) {
  const choices = [];
  for (let key in ratios) {
    for (let i = 0; i < ratios[key]; i++) {
      choices.push(key);
    }
  }
  return +choices[_.random(choices.length - 1)];
}

/**
 * Returns solve if valid cube state, null if not
 */
function getSolve(cube) {
  // cubejs quirk: If the cube state is not valid, it will not give an error. Instead, it will give
  // a solve -- but for a slightly different (but valid) cube state. To check for this, we check
  // after solving that the solve actually corresponds to the given cube.
  const solve = cube.solve();
  const fromSolve = new Cube().move(Cube.inverse(solve));
  if (_.isEqual(fromSolve.toJSON(), cube.toJSON())) {
    return solve;
  } else {
    return null;
  }
}
