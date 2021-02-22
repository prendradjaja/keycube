const touchKeyboardEl = document.getElementsByClassName('touch-keyboard')[0];

// swipes
const LEFT = [0, -1];
const RIGHT = [0, 1];
const UP = [-1, 0];
const DOWN = [1, 0];

class touchKeyboard {
  // config
  DOUBLE_TAP_DELAY_MS = 300;
  specialKeys = {
    '|': {
      label: '|',
      handler: () => handleSpace(),
    },
    '_': {
      label: '',
      handler: () => {},
    },
  };
  layers = undefined; // will be initialized below

  // derived constants
  rowsCount = undefined; // will be initialized below
  colsCount = undefined; // will be initialized below

  // state related to tap behahvior
  lastKeyPress = undefined; // { timestampMS, key }
  ignoreNextModifierRelease = false;
  activeLayerIndex = 0;

  // state related to swipe behavior
  touchPath = [];
  swipes = [];
  moves = [];
  uMoveMode = undefined; // 'top' | 'bottom' Unlike lrMoveMode, this is only used in "neutral R" position
  lrMoveMode = undefined; // 'left' | 'right'


  getActiveLayer() {
    return this.layers[this.activeLayerIndex];
  }
  // TODO bring all the stuff from this file into this class
}
touchKeyboard = new touchKeyboard()

// MUST BE EVEN for isTopHalf and isRightHalf
touchKeyboard.layers = `

  _  _  _  _  _  _
  _  y' B  B' y  _
  _  L' U' U  R  _
  |  L  F' F  R' |
  |  x' D  D' x  |
  _  _  _  _  M  M'

`.split('\n\n').map(chunk => chunk.trim()).filter(chunk => chunk).map(chunk => chunk.split('\n').map(line => line.trim().split(/\s+/)))

createTouchKeyboard();

(function initializeDimensions() {
  const keyboard = touchKeyboard.layers[0]; // Doesn't matter which layer we use
  touchKeyboard.rowsCount = keyboard.length;
  touchKeyboard.colsCount = keyboard[0].length;
})();

function createTouchKeyboard() {
  let keyboardHtml = '';
  for (let [r, row] of touchKeyboard.getActiveLayer().entries()) {
    keyboardHtml += '<tr>';
    for (let [c, key] of row.entries()) {
      keyboardHtml += `
        <td>
          <button
            id="touch-keyboard-button-${r}-${c}"
            ontouchstart="handleTouchStart(event)"
            ontouchend="
              handleTouchEnd(event, this, ${r}, ${c})
              /* handleTouchKeyboardEvent('press', {
                keyType: 'move',
                button: this,
                row: ${r},
                column: ${c},
              }) */
            "
            ontouchmove="handleTouchMove(event)"
          >
          </button>
        </td>
      `;
    }
    keyboardHtml += '</tr>';
  }
  touchKeyboardEl.innerHTML = keyboardHtml;
  drawKeyboard();
}

function handleMoveKeyPress(button, r, c) {
  const { move, handler } = getBinding(r, c);
  if (move) {
    handleMove(move);
    playClickSound(move);
  } else if (handler) {
    handler();
  }

  button.classList.add('active');
  setTimeout(() => { // TODO maybe do this on touchend
    button.classList.remove('active');
  }, 200);
}

function handleModifierKeyEvent(eventType, layer) {
  if (eventType === 'press') {
    const lastPress = touchKeyboard.lastKeyPress;
    if (lastPress?.key.keyType === 'modifier' && lastPress.key.layer === layer) {
      const delay = new Date().valueOf() - lastPress.timestampMS;
      if (delay < touchKeyboard.DOUBLE_TAP_DELAY_MS) {
        touchKeyboard.ignoreNextModifierRelease = true;
        document.body.classList.add(`layer-${layer}-double-tapped`);
      }
    }

    touchKeyboard.activeLayerIndex = layer;
    drawKeyboard();
    document.body.classList.add(`layer-${layer}-active`);
  } else if (eventType === 'release') {
    if (!touchKeyboard.ignoreNextModifierRelease) {
      touchKeyboard.activeLayerIndex = 0;
      drawKeyboard();
      [1, 2].forEach(j => {
        document.body.classList.remove(`layer-${j}-active`);
        document.body.classList.remove(`layer-${j}-double-tapped`);
      });
    } else {
      touchKeyboard.ignoreNextModifierRelease = false;
    }
  } else {
    throw new Error("Invalid eventType: " + eventType);
  }
}

/**
 * Set all the buttons' text and layer classes.
 */
function drawKeyboard() {
  const layer = touchKeyboard.activeLayerIndex;
  for (let [r, row] of touchKeyboard.getActiveLayer().entries()) {
    for (let [c, key] of row.entries()) {
      const buttonEl = document.getElementById(`touch-keyboard-button-${r}-${c}`);
      const { label, fallThrough } = getBinding(r, c);
      buttonEl.textContent = label;
      if (!fallThrough && layer !== 0) {
        buttonEl.classList.add(`layer-${layer}`);
      } else {
        [1, 2].forEach(j => buttonEl.classList.remove(`layer-${j}`));
      }
    }
  }
}

function getBinding(r, c) {
  let symbol = touchKeyboard.getActiveLayer()[r][c];
  let fallThrough = false;
  if (symbol === '_') {
    symbol = touchKeyboard.layers[0][r][c];
    fallThrough = true;
  }

  const specialKey = touchKeyboard.specialKeys[symbol];
  if (!specialKey) {
    return {
      label: symbol,
      move: symbol,
      fallThrough,
    };
  } else {
    return {
      label: specialKey.label,
      handler: specialKey.handler,
    };
  }
}

/**
 * eventType: 'press' | 'release'
 * key: MoveKey | ModifierKey | OrientationKey
 *
 * MoveKey {
 *   keyType: 'move'
 *   button: HTMLButtonElement;
 *   row: number;
 *   column: number;
 * }
 *
 * ModifierKey {
 *   keyType: 'modifier';
 *   layer: number | undefined; // only matters for 'press' event
 * }
 *
 * OrientationKey {
 *   keyType: 'orientation'
 * }
 */
function handleTouchKeyboardEvent(eventType, key) {
  if (!['press', 'release'].includes(eventType)) {
    throw new Error("Invalid eventType: " + eventType);
  } else if (!['move', 'modifier', 'orientation'].includes(key.keyType)) {
    throw new Error("Invalid keyType: " + key.keyType);
  }

  if (key.keyType === 'move') {
    if (eventType === 'press') {
      handleMoveKeyPress(key.button, key.row, key.column);
    } else if (eventType === 'release') {
      // do nothing
    }
  } else if (key.keyType === 'modifier') {
    handleModifierKeyEvent(eventType, key.layer);
  } else if (key.keyType === 'orientation') {
    if (eventType === 'press') {
      // TODO this button is like "space" but probably should only be for orientation, not scrambling
      handleSpace();
    } else if (eventType === 'release') {
      // do nothing
    }
  }

  if (eventType === 'press') {
    touchKeyboard.lastKeyPress = {
      timestampMS: new Date().valueOf(),
      key,
    };
  }
}

const boundingBoxes = [];

function getBoundingBoxes() {
  const keyboard = touchKeyboard.layers[0]; // Doesn't matter which layer we use
  for (let [r, row] of keyboard.entries()) {
    for (let [c, key] of row.entries()) {
      const buttonEl = document.getElementById(`touch-keyboard-button-${r}-${c}`);
      const rect = buttonEl.getBoundingClientRect();
      boundingBoxes.push({
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y,
        r,
        c,
      });
    }
  }
}

setTimeout(() => getBoundingBoxes(), 50);

function getMatchingBoundingBox(x, y) {
  // TODO write optimized version
  for (let box of boundingBoxes) {
    const {left, right, top, bottom} = box;
    if (x >= left && x <= right && y >= top && y <= bottom) {
      return box;
    }
  }
  return undefined;
}

function handleTouchMove(evt) {
  const cursorEl = document.getElementById('cursor');
  cursorEl.style.left = evt.touches[0].clientX;
  cursorEl.style.top = evt.touches[0].clientY;
  const box = getMatchingBoundingBox(evt.touches[0].clientX, evt.touches[0].clientY);
  if (box) {
    const {r, c} = box;
    const buttonEl = document.getElementById(`touch-keyboard-button-${r}-${c}`);
    buttonEl.style.opacity = '0.5';

    const lastTouch = last(touchKeyboard.touchPath);
    if (!lastTouch || lastTouch.r !== r || lastTouch.c !== c) {
      const newTouch = {r, c, buttonEl};
      touchKeyboard.touchPath.push(newTouch);
      // console.log(touchKeyboard.touchPath.length, touchKeyboard.touchPath.map(x => `${x.r},${x.c}`).join(' '));
      if (lastTouch) {
        handleSwipe(newTouch, lastTouch);
      }
    }

  }
}

function handleSwipe(newTouch, lastTouch) {
  const lastSwipe = last(touchKeyboard.swipes);
  const lastMove = last(touchKeyboard.moves);
  if (newTouch.r + 1 === lastTouch.r && newTouch.c === lastTouch.c) {
  } else if (newTouch.r - 1 === lastTouch.r && newTouch.c === lastTouch.c) {
  } else if (newTouch.c + 1 === lastTouch.c && newTouch.r === lastTouch.r) {
  } else if (newTouch.c - 1 === lastTouch.c && newTouch.r === lastTouch.r) {
  } else {
    showDebugMessage('DIAGONAL');
    return;
  }
  const newSwipe = [newTouch.r - lastTouch.r, newTouch.c - lastTouch.c];

  if (!touchKeyboard.uMoveMode) {
    touchKeyboard.uMoveMode = isTopHalf(lastTouch) ? 'top' : 'bottom';
    console.log("Set u move mode:", touchKeyboard.uMoveMode);
  }

  touchKeyboard.swipes.push(newSwipe);
  let newMove;

  if (equals(newSwipe, LEFT) || equals(newSwipe, RIGHT)) {
    newMove = getUMove(newSwipe, newTouch);
  } else if (equals(newSwipe, UP) || equals(newSwipe, DOWN)) {
    if (!touchKeyboard.lrMoveMode) {
      touchKeyboard.lrMoveMode = isRightHalf(lastTouch) ? 'right' : 'left';
      console.log("Set lr move mode:", touchKeyboard.lrMoveMode);
    }
    newMove = getLRMove(newSwipe);
  } else {
    error("invalid direction " + newSwipe);
  }

  touchKeyboard.moves.push(newMove);
  handleMove(newMove);
  playClickSound(newMove); // Temporarily disabled because it isn't snappy on mobile -- TODO how do i fix this?
}


function isTopHalf({r}) {
  return r < touchKeyboard.rowsCount / 2;
}

function isRightHalf({c}) {
  return c >= touchKeyboard.colsCount / 2;
}

function playClickSound(newMove) {
  // var audio = new Audio('./click.mp3');
  // audio.play();

  if (newMove.includes('U')) {
    clickBuzz(NOTES.E4, 0.020)
  } else if (newMove.includes('L') || newMove.includes('R')) {
    clickBuzz(NOTES.C4, 0.020)
  } else if (newMove.includes('D')) {
    clickBuzz(NOTES.D4, 0.020)
  } else if (newMove.includes('F')) {
    clickBuzz(NOTES.A3, 0.020)
  } else if (newMove.includes('B')) {
    clickBuzz(NOTES.D3, 0.020)
  } else if (newMove.includes('y')) {
    clickBuzz(NOTES.C5, 0.020)
  } else if (newMove.includes('x')) {
    clickBuzz(NOTES.E5, 0.020)
  } else if (newMove.includes('M')) {
    clickBuzz(NOTES.F5, 0.020)
  }
}

function getUMove(swipe, newTouch) {
  assert(equals(swipe, LEFT) || equals(swipe, RIGHT));
  assert(['top', 'bottom'].includes(touchKeyboard.uMoveMode));

  const firstTouch = touchKeyboard.touchPath[0];

  let uMoveMode;
  if (newTouch.r === firstTouch.r) {
    uMoveMode = touchKeyboard.uMoveMode;
  } else {
    uMoveMode = newTouch.r > firstTouch.r ? 'bottom' : 'top';
  }

  if (equals(swipe, LEFT)) {
    return uMoveMode === 'top' ? "U'" : "U";
  } else {
    return uMoveMode === 'top' ? "U" : "U'";
  }
}

function getLRMove(swipe) {
  assert(equals(swipe, UP) || equals(swipe, DOWN));
  assert(['left', 'right'].includes(touchKeyboard.lrMoveMode));
  if (equals(swipe, UP)) {
    return touchKeyboard.lrMoveMode === 'right' ? "R" : "L'";
  } else {
    return touchKeyboard.lrMoveMode === 'right' ? "R'" : "L";
  }
}

function assert(bool, message) {
  !bool && error(message || "Impossible state");
}

function getSwipeRotation(newSwipe, lastSwipe) {
  let swipe = lastSwipe;
  if (equals(swipe, newSwipe)) {
    return 0;
  }

  swipe = rotateSwipeClockwise(swipe);
  if (equals(swipe, newSwipe)) {
    return 90;
  }

  swipe = rotateSwipeClockwise(swipe);
  if (equals(swipe, newSwipe)) {
    return 180;
  }

  swipe = rotateSwipeClockwise(swipe);
  if (equals(swipe, newSwipe)) {
    return 270;
  }

  error("getSwipeRotation couldn't find the answer");
}

function rotateSwipeClockwise(swipe) {
  const [r, c] = swipe;
  return [c, -r];
}

function error(message) {
  window.alert(message);
  throw new Error(message);
}

function showDebugMessage(message) {
  const debugEl = document.getElementsByClassName('debug-info')[0];
  debugEl.innerHTML = message;
}

function handleTouchStart(evt) {
  touchKeyboard.touchPath = [];
  handleTouchMove(evt);
  touchKeyboard.swipes = [];
  touchKeyboard.moves = [];
  touchKeyboard.uMoveMode = undefined;
  touchKeyboard.lrMoveMode = undefined;
}

function handleTouchEnd(evt, button, row, column) {
  if (touchKeyboard.swipes.length === 0) {
    handleMoveKeyPress(button, row, column);
  }

  touchKeyboard.touchPath.forEach(item => item.buttonEl.style.opacity = '1');
  touchKeyboard.touchPath = [];
  touchKeyboard.swipes = [];
  touchKeyboard.moves = [];
}

// Returns undefined if length 0
function last(arr) {
  return arr[arr.length - 1];
}

// Doesn't work for everything -- works for plain strings, works for arrays, but not guaranteed to work for objects
function equals(o1, o2) {
  return JSON.stringify(o1) === JSON.stringify(o2);
}
