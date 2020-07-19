const stickerSize = 100;

function draw(cube) {
  document.querySelectorAll('.cube')
    .forEach(cubeEl => {
      ['f', 'r', 'u'].forEach(face =>
        cubeEl.querySelector(`.${face}-face`).innerHTML = (() => {
          let result = '';
          for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
              result += `
                <rect
                  x="${c * stickerSize}"
                  y="${r * stickerSize}"
                  height="100"
                  width="100"
                  fill="${getColor(cube, face, r, c)}"
                  stroke="black"
                  stroke-width="2"
                />
              `;
            }
          }
          return result;
        })()
      );
    });
}

function getColor(cube, faceName, r, c) {
  const sticker = getSticker(cube, faceName, r, c);
  return stickerToColor(sticker);
}

function stickerToColor(sticker) {
  return {
    U: 'white',
    F: 'rgb(0, 200, 0)',
    R: 'rgb(200, 0, 0)',
    B: 'rgb(0, 0, 200)',
    L: 'rgb(200, 100, 0)',
    D: 'rgb(200, 200, 0)',
  }[sticker];
}
