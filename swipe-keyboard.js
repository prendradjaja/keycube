const swipeKeyboardEl = document.getElementsByClassName('swipe-keyboard')[0];

const swipeKeyboard = {
  rowsCount: 6,
  colsCount: 6,
};

swipeKeyboard.keys = (
  new Array(swipeKeyboard.rowsCount)
    .fill(undefined)
    .map(emptyRow => new Array(swipeKeyboard.colsCount).fill(undefined))
);

let keyboardHtml = '';
for (let [r, row] of swipeKeyboard.keys.entries()) {
  keyboardHtml += '<tr>';
  for (let [c, key] of row.entries()) {
    keyboardHtml += `
      <td>
        <button
          id="swipe-keyboard-button-${r}-${c}"
          ontouchstart="console.log(event)"
          ontouchmove="handleMove(event)"
        >
        </button>
      </td>
    `;
  }
  keyboardHtml += '</tr>';
}
swipeKeyboardEl.innerHTML = keyboardHtml;

const boundingBoxes = [];

function getBoundingBoxes() {
  for (let [r, row] of swipeKeyboard.keys.entries()) {
    for (let [c, key] of row.entries()) {
      const buttonEl = document.getElementById(`swipe-keyboard-button-${r}-${c}`);
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

function handleMove(evt) {
  // console.log(evt);
  window.lastEvent = evt;
  const cursorEl = document.getElementById('cursor');
  cursorEl.style.left = evt.touches[0].clientX;
  cursorEl.style.top = evt.touches[0].clientY;
  const box = getMatchingBoundingBox(evt.touches[0].clientX, evt.touches[0].clientY);
  console.log(box);
  if (box) {
    const {r, c} = box;
    const buttonEl = document.getElementById(`swipe-keyboard-button-${r}-${c}`);
    buttonEl.style.opacity = '0.5';
  }
}

setTimeout(() => getBoundingBoxes(), 50);
