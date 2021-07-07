const stickerSize = 100;

function draw(cube) {
  document.querySelectorAll('.cube')
    .forEach(cubeEl => {
      setAngleClass(cubeEl);
      ['f', 'r', 'u', 'l'].forEach(face =>
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
              // TODO Bigger stroke width (requires some more
              // math bc this is not "box-sizing: border-box")
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
  const colors = {
      "Mango":"#ffbe0b","Orange Pantone":"#fb5607","Winter Sky":"#ff006e","Blue Violet":"#8338ec","Azure":"#3a86ff",
      "Amethyst":"#9b5de5","Magenta Crayola":"#f15bb5","Minion Yellow":"#fee440","Capri":"#00bbf9","Sea Green Crayola":"#00f5d4",
      "Blue Violet Color Wheel":"#540d6e","Paradise Pink":"#ee4266","Sunglow":"#ffd23f","Caribbean Green":"#3bceac","GO Green":"#0ead69" // https://coolors.co/540d6e-ee4266-ffd23f-3bceac-0ead69
  };
  const colorArray = 'eac435,345995,e40066,03cea4,fb4d3d'.split(',').map(x => '#' + x);

  const scheme1 = {
    U: 'white',
    D: colorArray[0],
    F: colorArray[1],
    B: colorArray[3],
    L: colorArray[2],
    R: colorArray[4],
  };

  const scheme2 = {
    U: 'white',
    D: colors['Minion Yellow'],
    F: colors['Amethyst'],
    B: colors['Magenta Crayola'],
    L: colors['Capri'],
    R: colors['Sea Green Crayola'],
  };

  const scheme3 = {
    U: 'white',
    D: colors.Mango,
    F: colors['Blue Violet'],
    B: colors['Azure'],
    L: colors['Orange Pantone'],
    R: colors['Winter Sky'],
  };

  return scheme1[sticker];
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
