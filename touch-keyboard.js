const touchKeyboardEl = document.getElementById('touch-keyboard');

const layout = `

  y' B  B' y
  L' U' U  R
  L  F' F  R'
  x' D  D' x

`.trim().split('\n').map(line => line.trim().split(/\s+/))
console.log(layout)

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
  }, 500);
}
