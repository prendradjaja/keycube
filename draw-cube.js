const stickerSize = 100;

function draw(cube) {
  document.querySelectorAll('.cube')
    .forEach(cubeEl => {
      setAngleClass(cubeEl);
      ['f', 'r', 'u', 'l'].forEach(face =>
        cubeEl.querySelector(`.${face}-face`).innerHTML = (() => {
          let result = '';
          const center = getSticker(cube, face, 1, 1);
          for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
              result += `
                <rect
                  x="${c * stickerSize}"
                  y="${r * stickerSize}"
                  height="100"
                  width="100"
                  fill="${getColor(cube, face, r, c, center)}"
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
      );
    });
}

function getColor(cube, faceName, r, c, center) {
  const sticker = getSticker(cube, faceName, r, c);
  return center === sticker ? 'white' : 'rgb(25, 25, 25)';
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

function otherAngle(angle) {
  if (angle === 'right') {
    return 'left';
  } else {
    return 'right';
  }
}

function setAngleClass(cubeEl) {
  const angle = globalState.angle;
  const wrapperEl = cubeEl.querySelector('.cube-wrapper');
  wrapperEl.classList.remove('angle-' + otherAngle(angle));
  wrapperEl.classList.add('angle-' + angle);
}
