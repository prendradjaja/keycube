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

    _ _ _ _ _ _
  _  y' B  B' y  _
  _  L' U' U  R  _
  |  L  F' F  R' |
  |  x' D  D' x  |
    _ _ _ _ _ _

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
            ontouchstart="
              handleTouchKeyboardEvent('press', {
                keyType: 'move',
                button: this,
                row: ${r},
                column: ${c},
              })
            "
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
