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
        >
        </button>
      </td>
    `;
  }
  keyboardHtml += '</tr>';
}
swipeKeyboardEl.innerHTML = keyboardHtml;
