const stickerSize = 100;

function draw(cube, cubeEl) {
  drawFace('f', cube, cubeEl)
  drawFace('r', cube, cubeEl)
  drawFace('u', cube, cubeEl)
}

function drawFace(face, cube, cubeEl) {
  const { r: rows, c: cols } = faceDimensions[face];
  cubeEl.querySelector(`.${face}-face`).innerHTML = (() => {
    let result = '';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
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
        // TODO Bigger stroke width (requires some more
        // math bc this is not "box-sizing: border-box")
      }
    }
    return result;
  })()
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
