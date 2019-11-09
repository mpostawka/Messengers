import { Status } from "./state.js";

export function render(state, game) {
    game.innerHTML = "";
    
    if(state.status === Status.PLAYING)
        game.append(...renderGame(state));
}

export function renderGame({board}) {
    let elements = [];
    // generate DOM
    const table = document.createElement("table");
    table.classList.add("game")

    const caption = document.createElement("caption");
    caption.innerText = "Score:";

    const tbody = document.createElement("tbody");

    for(const row of board) {
        const tr = document.createElement("tr");
        for(const element of row) {
            const td = document.createElement("td");
            td.innerText = element;
            tr.append(td);
        }
        tbody.append(tr);
    }
    // const tr = document.createElement("tr");
    // const td = document.createElement("td");
    // td.classList.add("color1", "bottom", "right");
    // td.innerText = ""
    // tr.append(td);
    // tbody.append(tr);
    table.append(caption);
    table.append(tbody);

    elements.push(table);
    return elements;
}