const KEY_BINDINGS = 'keycube/key-bindings';

const layoutName = localStorage.getItem(KEY_BINDINGS) || 'default';
const rawKeyBindings = allLayouts[layoutName];
console.log("Using key bindings: " + layoutName);
console.log(`To change the layout, \`useLayout('NAME')\` and refresh (where NAME is one of: ${Object.keys(allLayouts).join(' ')})`);

function useLayout(layoutName) {
  localStorage.setItem(KEY_BINDINGS, layoutName);
}
