const stickerSize = 100;

['f-face', 'r-face', 'u-face'].forEach(faceId =>
  document.getElementsByClassName(faceId)[0].innerHTML = (() => {
    let result = '';
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        result += `
          <rect
            x="${r * stickerSize}"
            y="${c * stickerSize}"
            height="100"
            width="100"
            fill="${getTempColor(faceId, r, c)}"
          />
        `;
      }
    }
    return result;
  })()
);

function getTempColor(faceName, r, c) {
  const i = c * 3 + r;
  const alpha = i / 15 + 0.4;
  if (faceName === 'f-face') {
    return `rgba(0, 200, 0, ${alpha}`;
  } else if (faceName === 'r-face') {
    return `rgba(220, 0, 0, ${alpha}`;
  } else if (faceName === 'u-face') {
    return `rgba(180, 180, 180, ${alpha}`;
  } else {
    return 'black';
  }
}
