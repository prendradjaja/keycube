Object.values(cases).forEach(alg => {
  const newElement = document.createElement('div'); // TODO can I use a fragment?
  newElement.style.display = 'inline-block';
  newElement.innerHTML = `
    <svg
      class="cube"
      width="500"
      height="500"
      viewBox="0 0 600 500"
    >
      <g class="cube-wrapper">
        <g class="f-face">
        </g>
        <g class="r-face">
        </g>
        <g class="u-face">
        </g>
        <g class="l-face">
        </g>
      </g>
    </svg>
  `;
  document.querySelector('#cubes-container').appendChild(newElement)
  const cubeEl = newElement.querySelector('.cube');
  const cube = new Puzzle();
  cube.move(alg);
  draw(cube, cubeEl);
})
