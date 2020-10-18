const stickerSize = 100;

function draw(cube) {
  const MISORIENTED_CLASS = 'misoriented';
  const cubeEl = document.querySelector('.eocube');
  cube.eo.forEach((misoriented, i) => {
    const edgeEl = document.getElementById('edge-'+i);
    if (!misoriented) {
      edgeEl.classList.remove(MISORIENTED_CLASS);
    } else {
      edgeEl.classList.add(MISORIENTED_CLASS);
    }
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
