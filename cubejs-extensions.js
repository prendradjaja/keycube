function toFaces(cube) {
  const faceOrder = 'urfdlb';
  const result = {};
  for (let i = 0; i < 6; i++) {
    const faceName = faceOrder.charAt(i);
    result[faceName] = cube.asString().substr(i * 9, 9);
  }
  return result;
}

function getSticker(cube, faceName, r, c) {
  const faces = toFaces(cube);
  return faces[faceName][r * 3 + c];
}
