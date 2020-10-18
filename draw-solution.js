function drawSolution() {
  document.querySelector('.solution').innerHTML =
    globalState.solution
      .map(move => !move.startsWith('//')
        ? move
        : `<span class="undone">${move}</span>`
      )
      .join('<br>');
}
