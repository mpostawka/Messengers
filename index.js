import { State } from "./state.js";
import { View } from "./view.js";

const game = document.querySelector("#game");

function start() {
    console.log("start");
    const state = new State();
    const view = new View(state, game);
    view.createStartContent();
}

start();