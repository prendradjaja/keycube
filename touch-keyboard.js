const touchKeyboardEl = document.getElementById('touch-keyboard');

let layout = `

  y' B  B' y
  L' U' U  R
  L  F' F  R'
  x' D  D' x

  a b c
  d e f

`.split('\n\n').map(chunk => chunk.trim()).filter(chunk => chunk).map(chunk => chunk.split('\n').map(line => line.trim().split(/\s+/)))
layout = layout[0];

let keyboardHtml = '';
for (let row of layout) {
  keyboardHtml += '<tr>';
  for (let key of row) {
    keyboardHtml += `
      <td>
        <button
          ontouchstart="handleButtonClick(this, &quot;${key}&quot;)"
        >
          ${key}
        </button>
      </td>
    `;
  }
  keyboardHtml += '</tr>';
}
touchKeyboardEl.innerHTML = keyboardHtml;

function handleButtonClick(button, move) {
  handleMove(move);
  button.classList.add('active');
  setTimeout(() => {
    button.classList.remove('active');
  }, 200);
}
