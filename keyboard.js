// interface KeyBinding {
//   key: {
//     code: string;
//     shiftKey: boolean;
//   }
//   move: string;
// }

const keyBindings = parseKeyBindings(rawKeyBindings);

/**
 * Return undefined if there is no move for this key
 */
function getMove(event) {
  return keyBindings.find(
    keyBinding =>
      keyBinding.key.code === event.code &&
      keyBinding.key.shiftKey === event.shiftKey
  )?.move;
}

function parseKeyBindings(rawKeyBindings) {
  const result = [];
  for (let key in rawKeyBindings) {
    result.push({
      key: parseOneKeyBinding(key),
      move: rawKeyBindings[key]
    });
  }
  return result;
}

function parseOneKeyBinding(key) {
  if (key.match(/^[a-z]$/)) {
    return {
      code: 'Key' + key.toUpperCase(),
      shiftKey: false
    };
  } else if (key.match(/^[A-Z]$/)) {
    return {
      code: 'Key' + key,
      shiftKey: true
    };
  } else if (key === ';') {
    return {
      code: 'Semicolon',
      shiftKey: false
    };
  } else {
    const errorMessage = 'Unparseable key: ' + key;
    window.alert(errorMessage);
    throw new Error(errorMessage);
  }
}
