const swipeKeyboardEl = document.getElementsByClassName('swipe-keyboard')[0];

const swipeKeyboard = {
  rowsCount: 6, // MUST BE EVEN for isTopHalf
  colsCount: 6, // MUST BE EVEN for isRightHalf
  touchPath: [],
  swipes: [],
  moves: [],
  uMoveMode: undefined, // 'top' | 'bottom' Unlike lrMoveMode, this is only used in "neutral R" position
  lrMoveMode: undefined, // 'left' | 'right'
};

// swipes
const LEFT = [0, -1];
const RIGHT = [0, 1];
const UP = [-1, 0];
const DOWN = [1, 0];

swipeKeyboard.keys = (
  new Array(swipeKeyboard.rowsCount)
    .fill(undefined)
    .map(emptyRow => new Array(swipeKeyboard.colsCount).fill(undefined))
);

let keyboardHtml = '';
for (let [r, row] of swipeKeyboard.keys.entries()) {
  keyboardHtml += '<tr>';
  for (let [c, key] of row.entries()) {
    keyboardHtml += `
      <td>
        <button
          id="swipe-keyboard-button-${r}-${c}"
          ontouchstart="swipeKeyboard.handleTouchStart(event)"
          ontouchmove="swipeKeyboard.handleTouchMove(event)"
          ontouchend="swipeKeyboard.handleTouchEnd(event)"
        >
        </button>
      </td>
    `;
  }
  keyboardHtml += '</tr>';
}
swipeKeyboardEl.innerHTML = keyboardHtml;

const boundingBoxes = [];

function getBoundingBoxes() {
  for (let [r, row] of swipeKeyboard.keys.entries()) {
    for (let [c, key] of row.entries()) {
      const buttonEl = document.getElementById(`swipe-keyboard-button-${r}-${c}`);
      const rect = buttonEl.getBoundingClientRect();
      boundingBoxes.push({
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y,
        r,
        c,
      });
    }
  }
}

function getMatchingBoundingBox(x, y) {
  // TODO write optimized version
  for (let box of boundingBoxes) {
    const {left, right, top, bottom} = box;
    if (x >= left && x <= right && y >= top && y <= bottom) {
      return box;
    }
  }
  return undefined;
}

function isTopHalf({r}) {
  return r < swipeKeyboard.rowsCount / 2;
}

function isRightHalf({c}) {
  return c >= swipeKeyboard.colsCount / 2;
}

swipeKeyboard.handleTouchMove = function handleTouchMove(evt) {
  // console.log(evt);
  window.lastEvent = evt;
  const cursorEl = document.getElementById('cursor');
  cursorEl.style.left = evt.touches[0].clientX;
  cursorEl.style.top = evt.touches[0].clientY;
  const box = getMatchingBoundingBox(evt.touches[0].clientX, evt.touches[0].clientY);
  // console.log(box);
  if (box) {
    const {r, c} = box;
    const buttonEl = document.getElementById(`swipe-keyboard-button-${r}-${c}`);
    buttonEl.style.opacity = '0.5';

    const lastTouch = last(swipeKeyboard.touchPath);
    if (!lastTouch || lastTouch.r !== r || lastTouch.c !== c) {
      const newTouch = {r, c, buttonEl};
      swipeKeyboard.touchPath.push(newTouch);
      // console.log(swipeKeyboard.touchPath.length, swipeKeyboard.touchPath.map(x => `${x.r},${x.c}`).join(' '));
      if (lastTouch) {
        handleSwipe(newTouch, lastTouch);
      }
    }
  }
};

function handleSwipe(newTouch, lastTouch) {
  const lastSwipe = last(swipeKeyboard.swipes);
  const lastMove = last(swipeKeyboard.moves);
  if (newTouch.r + 1 === lastTouch.r && newTouch.c === lastTouch.c) {
  } else if (newTouch.r - 1 === lastTouch.r && newTouch.c === lastTouch.c) {
  } else if (newTouch.c + 1 === lastTouch.c && newTouch.r === lastTouch.r) {
  } else if (newTouch.c - 1 === lastTouch.c && newTouch.r === lastTouch.r) {
  } else {
    showDebugMessage('DIAGONAL');
    return;
  }
  const newSwipe = [newTouch.r - lastTouch.r, newTouch.c - lastTouch.c];

  if (!swipeKeyboard.uMoveMode) {
    swipeKeyboard.uMoveMode = isTopHalf(lastTouch) ? 'top' : 'bottom';
    console.log("Set u move mode:", swipeKeyboard.uMoveMode);
  }

  swipeKeyboard.swipes.push(newSwipe);
  let newMove;

  if (equals(newSwipe, LEFT) || equals(newSwipe, RIGHT)) {
    newMove = getUMove(newSwipe, newTouch);
  } else if (equals(newSwipe, UP) || equals(newSwipe, DOWN)) {
    if (!swipeKeyboard.lrMoveMode) {
      swipeKeyboard.lrMoveMode = isRightHalf(lastTouch) ? 'right' : 'left';
      console.log("Set lr move mode:", swipeKeyboard.lrMoveMode);
    }
    newMove = getLRMove(newSwipe);
  } else {
    error("invalid direction " + newSwipe);
  }

  swipeKeyboard.moves.push(newMove);
  handleMove(newMove);
  playClickSound(newMove); // Temporarily disabled because it isn't snappy on mobile -- TODO how do i fix this?
}

function playClickSound(newMove) {
  // var audio = new Audio('./click.mp3');
  // audio.play();

  if (newMove.includes('U') || newMove.includes('D')) {
    clickBuzz( 329.63, 0.020)
  } else {
    clickBuzz( 261.63, 0.020)
  }
}

function getUMove(swipe, newTouch) {
  assert(equals(swipe, LEFT) || equals(swipe, RIGHT));
  assert(['top', 'bottom'].includes(swipeKeyboard.uMoveMode));

  const firstTouch = swipeKeyboard.touchPath[0];

  let uMoveMode;
  if (newTouch.r === firstTouch.r) {
    uMoveMode = swipeKeyboard.uMoveMode;
  } else {
    uMoveMode = newTouch.r > firstTouch.r ? 'bottom' : 'top';
  }

  if (equals(swipe, LEFT)) {
    return uMoveMode === 'top' ? "U'" : "U";
  } else {
    return uMoveMode === 'top' ? "U" : "U'";
  }
}

function getLRMove(swipe) {
  assert(equals(swipe, UP) || equals(swipe, DOWN));
  assert(['left', 'right'].includes(swipeKeyboard.lrMoveMode));
  if (equals(swipe, UP)) {
    return swipeKeyboard.lrMoveMode === 'right' ? "R" : "L'";
  } else {
    return swipeKeyboard.lrMoveMode === 'right' ? "R'" : "L";
  }
}

function assert(bool, message) {
  !bool && error(message || "Impossible state");
}

function getSwipeRotation(newSwipe, lastSwipe) {
  let swipe = lastSwipe;
  if (equals(swipe, newSwipe)) {
    return 0;
  }

  swipe = rotateSwipeClockwise(swipe);
  if (equals(swipe, newSwipe)) {
    return 90;
  }

  swipe = rotateSwipeClockwise(swipe);
  if (equals(swipe, newSwipe)) {
    return 180;
  }

  swipe = rotateSwipeClockwise(swipe);
  if (equals(swipe, newSwipe)) {
    return 270;
  }

  error("getSwipeRotation couldn't find the answer");
}

function rotateSwipeClockwise(swipe) {
  const [r, c] = swipe;
  return [c, -r];
}

function error(message) {
  window.alert(message);
  throw new Error(message);
}

function showDebugMessage(message) {
  const debugEl = document.getElementsByClassName('debug-info')[0];
  debugEl.innerHTML = message;
}

swipeKeyboard.handleTouchStart = function handleTouchStart(evt) {
  swipeKeyboard.touchPath = [];
  swipeKeyboard.handleTouchMove(evt);
  swipeKeyboard.swipes = [];
  swipeKeyboard.moves = [];
  swipeKeyboard.uMoveMode = undefined;
  swipeKeyboard.lrMoveMode = undefined;
};

swipeKeyboard.handleTouchEnd = function handleTouchEnd(evt) {
  swipeKeyboard.touchPath.forEach(item => item.buttonEl.style.opacity = '1');
  swipeKeyboard.touchPath = [];
  swipeKeyboard.swipes = [];
  swipeKeyboard.moves = [];
};

setTimeout(() => getBoundingBoxes(), 50);

// Returns undefined if length 0
function last(arr) {
  return arr[arr.length - 1];
}

// Doesn't work for everything -- works for plain strings, works for arrays, but not guaranteed to work for objects
function equals(o1, o2) {
  return JSON.stringify(o1) === JSON.stringify(o2);
}
