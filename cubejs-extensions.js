// function toFaces(cube) {
//   const faceOrder = 'urfdlb';
//   const result = {};
//   for (let i = 0; i < 6; i++) {
//     const faceName = faceOrder.charAt(i);
//     result[faceName] = cube.asString().substr(i * 9, 9);
//   }
//   return result;
// }

const faceDimensions = {
  f: { r: 3, c: 2 },
  r: { r: 3, c: 1 },
  u: { r: 1, c: 2 },
}

function getSticker(cube, faceName, r, c) {
  const faces = cube.display_();
  const rowLength = faceDimensions[faceName].c;
  return faces[faceName][r * rowLength + c];
}
