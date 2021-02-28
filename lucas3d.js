import { parseAlg, modifiedBlockMove } from "https://cdn.cubing.net/esm/cubing/alg";
import { TwistyPlayer } from "https://cdn.cubing.net/esm/cubing/twisty";


document.body.style.overflow = "hidden";
console.log(TwistyPlayer);

const player = new TwistyPlayer({
  background: "none",
  controlPanel: "none"
});

player.timeline.tempoScale = 15;

document.querySelector(".square-content").textContent = "";
document.querySelector(".square-content").appendChild(player);

window.handleMove = (moveString) => {
  let move = parseAlg(moveString).nestedUnits[0];
  // if (move.family === "U") {
  //   move = modifiedBlockMove(move, {
  //     amount: -move.amount
  //   })
  // }
  player.experimentalAddMove(move);
}
