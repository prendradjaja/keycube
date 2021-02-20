const touchKeyboardEl = document.getElementsByClassName('touch-keyboard')[0];

class touchKeyboard {
  DOUBLE_TAP_DELAY_MS = 300;
  layers = undefined; // will be initialized below
  lastKeyPress = undefined; // { timestampMS, key }
  ignoreNextModifierRelease = false;
  activeLayerIndex = 0;
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

  getActiveLayer() {
    return this.layers[this.activeLayerIndex];
  }
  // TODO bring all the stuff from this file into this class
}
touchKeyboard = new touchKeyboard()

touchKeyboard.layers = `

  _  _  _  _  _  _
  _  y' B  B' y  _
  _  L' U' U  R  _
  |  L  F' F  R' |
  |  x' D  D' x  |
  _  _  _  _  _  _

`.split('\n\n').map(chunk => chunk.trim()).filter(chunk => chunk).map(chunk => chunk.split('\n').map(line => line.trim().split(/\s+/)))

createTouchKeyboard();

function createTouchKeyboard() {
  let keyboardHtml = '';
  for (let [r, row] of touchKeyboard.getActiveLayer().entries()) {
    keyboardHtml += '<tr>';
    for (let [c, key] of row.entries()) {
      keyboardHtml += `
        <td>
          <button
            id="touch-keyboard-button-${r}-${c}"
            ontouchend="
              handleTouchKeyboardEvent('press', {
                keyType: 'move',
                button: this,
                row: ${r},
                column: ${c},
              })
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
  // const cursorEl = document.getElementById('cursor');
  // cursorEl.style.left = evt.touches[0].clientX;
  // cursorEl.style.top = evt.touches[0].clientY;
  // const box = getMatchingBoundingBox(evt.touches[0].clientX, evt.touches[0].clientY);
  // if (box) {
  //   const {r, c} = box;
  //   const buttonEl = document.getElementById(`touch-keyboard-button-${r}-${c}`);
  //   buttonEl.style.opacity = '0.5';
  // }
}

setTimeout(() => getBoundingBoxes(), 50);
