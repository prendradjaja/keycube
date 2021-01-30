const touchKeyboardEl = document.getElementById('touch-keyboard');

class touchKeyboard {
  layers = undefined; // will be initialized below
  activeLayerIndex = 0;
  getActiveLayer() {
    return this.layers[this.activeLayerIndex];
  }
  // TODO bring all the stuff from this file into this class
}
touchKeyboard = new touchKeyboard()

touchKeyboard.layers = `

  y' B  B' y
  L' U' U  R
  L  F' F  R'
  x' D  D' x

  y' b  b' y
  l' u' u  r
  l  f' f  r'
  x' d  d' x

  _  _  _  _
  M  _  _  M
  M' _  _  M'
  z' _  _  z

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
            ontouchstart="handleButtonClick(this, ${r}, ${c})"
          >
          </button>
        </td>
      `;
    }
    keyboardHtml += '</tr>';
  }
  touchKeyboardEl.innerHTML = keyboardHtml;
  activateLayer(0);
}

function handleButtonClick(button, r, c) {
  const { move } = getBinding(r, c);
  handleMove(move);

  button.classList.add('active');
  setTimeout(() => { // TODO maybe do this on touchend
    button.classList.remove('active');
  }, 200);
}

function activateLayer(i) {
  touchKeyboard.activeLayerIndex = i;
  for (let [r, row] of touchKeyboard.getActiveLayer().entries()) {
    for (let [c, key] of row.entries()) {
      const buttonEl = document.getElementById(`touch-keyboard-button-${r}-${c}`);
      const { move, fallThrough } = getBinding(r, c);
      buttonEl.textContent = move;
    }
  }
}

function getBinding(r, c) {
  let move = touchKeyboard.getActiveLayer()[r][c];
  let fallThrough = false;
  if (move === '_') {
    move = touchKeyboard.layers[0][r][c];
    fallThrough = true;
  }
  return { move, fallThrough };
}
