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

function handleMove(evt) {
  console.log(evt);
  window.lastEvent = evt;
  const cursorEl = document.getElementById('cursor');
  cursorEl.style.left = evt.touches[0].clientX;
  cursorEl.style.top = evt.touches[0].clientY;
}
