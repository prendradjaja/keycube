const template = `
               +--------+--------+--------+
             .'1111111.'2222222.'3333333.'|
           .'1111111.'2222222.'3333333.'CC|
          +--------+--------+--------+CCCC|
        .'4444444.'5555555.'6666666.'|CCCC|
      .'4444444.'5555555.'6666666.'BB|CCCC+
     +--------+--------+--------+BBBB|CC.'|
   .'7777777.'8888888.'9999999.'|BBBB|.'FF|
 .'7777777.'8888888.'9999999.'AA|BBBB+FFFF|
+--------+--------+--------+AAAA|BB.'|FFFF|
|aaaaaaaa|bbbbbbbb|cccccccc|AAAA|.'EE|FFFF+
|aaaaaaaa|bbbbbbbb|cccccccc|AAAA+EEEE|FF.'|
|aaaaaaaa|bbbbbbbb|cccccccc|AA.'|EEEE|.'II|
|aaaaaaaa|bbbbbbbb|cccccccc|.'DD|EEEE+IIII|
+--------+--------+--------+DDDD|EE.'|IIII|
|dddddddd|eeeeeeee|ffffffff|DDDD|.'HH|IIII+
|dddddddd|eeeeeeee|ffffffff|DDDD+HHHH|II.' 
|dddddddd|eeeeeeee|ffffffff|DD.'|HHHH|.'   
|dddddddd|eeeeeeee|ffffffff|.'GG|HHHH+     
+--------+--------+--------+GGGG|HH.'      
|gggggggg|hhhhhhhh|iiiiiiii|GGGG|.'        
|gggggggg|hhhhhhhh|iiiiiiii|GGGG+          
|gggggggg|hhhhhhhh|iiiiiiii|GG.'           
|gggggggg|hhhhhhhh|iiiiiiii|.'             
+--------+--------+--------+               
`;

const stickerSize = 100;

function draw(cube) {
  let text = template;

  text = text.replace(/1/g, getColor(cube, 'u', 0, 0));
  text = text.replace(/2/g, getColor(cube, 'u', 0, 1));
  text = text.replace(/3/g, getColor(cube, 'u', 0, 2));
  text = text.replace(/4/g, getColor(cube, 'u', 1, 0));
  text = text.replace(/5/g, getColor(cube, 'u', 1, 1));
  text = text.replace(/6/g, getColor(cube, 'u', 1, 2));
  text = text.replace(/7/g, getColor(cube, 'u', 2, 0));
  text = text.replace(/8/g, getColor(cube, 'u', 2, 1));
  text = text.replace(/9/g, getColor(cube, 'u', 2, 2));

  text = text.replace(/a/g, getColor(cube, 'f', 0, 0));
  text = text.replace(/b/g, getColor(cube, 'f', 0, 1));
  text = text.replace(/c/g, getColor(cube, 'f', 0, 2));
  text = text.replace(/d/g, getColor(cube, 'f', 1, 0));
  text = text.replace(/e/g, getColor(cube, 'f', 1, 1));
  text = text.replace(/f/g, getColor(cube, 'f', 1, 2));
  text = text.replace(/g/g, getColor(cube, 'f', 2, 0));
  text = text.replace(/h/g, getColor(cube, 'f', 2, 1));
  text = text.replace(/i/g, getColor(cube, 'f', 2, 2));

  text = text.replace(/A/g, getColor(cube, 'r', 0, 0));
  text = text.replace(/B/g, getColor(cube, 'r', 0, 1));
  text = text.replace(/C/g, getColor(cube, 'r', 0, 2));
  text = text.replace(/D/g, getColor(cube, 'r', 1, 0));
  text = text.replace(/E/g, getColor(cube, 'r', 1, 1));
  text = text.replace(/F/g, getColor(cube, 'r', 1, 2));
  text = text.replace(/G/g, getColor(cube, 'r', 2, 0));
  text = text.replace(/H/g, getColor(cube, 'r', 2, 1));
  text = text.replace(/I/g, getColor(cube, 'r', 2, 2));

  document.querySelector('#ascii-cube').innerHTML = text;
}

function getColor(cube, faceName, r, c) {
  const sticker = getSticker(cube, faceName, r, c);
  return stickerToColor(sticker);
}

function stickerToColor(sticker) {
  return {
    U: ' ',
    D: '@',
    F: 'x',
    B: '*',
    L: '.',
    R: 'o',
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
