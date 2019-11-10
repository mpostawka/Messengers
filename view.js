export class View {
    constructor(state, game) {
        this.state = state;
        this.game = game;
        this.route = -1;
    }

    createStartContent() {
        this.game.innerHTML = "";
        this.game.parentNode.style="background-color:rgb(43, 41, 41)";
        const buttons = document.createElement("div");
        buttons.classList.add("buttons");

        const easy = document.createElement("div");
        easy.classList.add("easy")
        easy.style="background-color:rgb(52, 235, 91)";
        const pEasy = document.createElement("p");

        const medium = document.createElement("div");
        medium.classList.add("medium")
        medium.style="background-color:rgb(235, 229, 52)";
        const pMedium = document.createElement("p");

        const hard = document.createElement("div");
        hard.classList.add("hard")
        hard.style="background-color:rgb(235, 113, 52)";
        const pHard = document.createElement("p");

        pEasy.innerText = "Easy";
        pMedium.innerText = "Medium";
        pHard.innerText = "Hard";
        easy.append(pEasy);
        medium.append(pMedium);
        hard.append(pHard);
        buttons.append(easy);
        buttons.append(medium);
        buttons.append(hard);
        this.game.append(buttons);

        easy.addEventListener('mouseover', _ => easy.style="background-color:rgb(26, 117, 45)");
        easy.addEventListener('mouseout', _ => easy.style="background-color:rgb(52, 235, 91)");
        easy.addEventListener('click', _ => {this.state.reset("easy");this.createGameContent();});
        medium.addEventListener('mouseover', _ => medium.style="background-color:rgb(117, 115, 26)");
        medium.addEventListener('mouseout', _ => medium.style="background-color:rgb(235, 229, 52)");
        medium.addEventListener('click', _ => {this.state.reset("medium");this.createGameContent();});
        hard.addEventListener('mouseover', _ => hard.style="background-color:rgb(117, 57, 26)");
        hard.addEventListener('mouseout', _ => hard.style="background-color:rgb(235, 113, 52)");
        hard.addEventListener('click', _ => {this.state.reset("hard");this.createGameContent();});
    }
    
    createGameContent() {
        this.game.innerHTML = "";
        this.game.parentNode.style="background-color:lightgrey";
        this.state.clearActiveRouteBoard();
        // generate DOM
        const table = document.createElement("table");
        table.classList.add("game")
        
        const caption = document.createElement("caption");
        caption.innerText = "Score:";
        
        const tbody = document.createElement("tbody");

        this.state.elements = [];
        for(const row of this.state.board) {
            const tr = document.createElement("tr");
            const newRow = [];
            for(const element of row) {
                const td = document.createElement("td");
                if(element != 0)
                    td.innerText = element;
                tr.append(td);
                newRow.push(td);
            }
            tbody.append(tr);
            this.state.elements.push(newRow);
        }
        table.append(caption);
        table.append(tbody);

        const returnButton = document.createElement("div");
        returnButton.classList.add("button");
        const pReturn = document.createElement("p");
        pReturn.innerText = "Return";
        returnButton.append(pReturn);
        returnButton.style="background-color:rgb(52, 235, 91)";
        returnButton.addEventListener('mouseover', _ => returnButton.style="background-color:rgb(26, 117, 45)");
        returnButton.addEventListener('mouseout', _ => returnButton.style="background-color:rgb(52, 235, 91)");
        returnButton.addEventListener('click', _ => this.createStartContent());

        const saveButton = document.createElement("div");
        saveButton.classList.add("button");
        const pSave = document.createElement("p");
        pSave.innerText = "Save";
        saveButton.append(pSave);
        saveButton.style="background-color:rgb(235, 52, 91)";
        saveButton.addEventListener('mouseover', _ => saveButton.style="background-color:rgb(117, 25, 45)");
        saveButton.addEventListener('mouseout', _ => saveButton.style="background-color:rgb(235, 52, 91)");
        saveButton.addEventListener('click', this.handleSaveButton.bind(this));

        const loadButton = document.createElement("div");
        loadButton.classList.add("button");
        const pLoad = document.createElement("p");
        pLoad.innerText = "Load";
        loadButton.append(pLoad);
        loadButton.style="background-color:rgb(52, 91, 235)";
        loadButton.addEventListener('mouseover', _ => loadButton.style="background-color:rgb(26, 45, 117)");
        loadButton.addEventListener('mouseout', _ => loadButton.style="background-color:rgb(52, 91, 235)");
        loadButton.addEventListener('click', this.handleLoadButton.bind(this));


        this.game.append(table);
        this.game.append(returnButton);
        this.game.append(saveButton);
        this.game.append(loadButton);
        this.table = table;
        window.addEventListener('contextmenu', e => e.preventDefault());
        table.addEventListener('mousedown', this.handleMouseDown.bind(this));
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
        table.addEventListener('mouseover', this.handleMouseOver.bind(this));
    }

    handleSaveButton(e) {
        if(this.state.save[this.state.level].saved) {
            this.table.caption.innerText = "GAME SAVE OVERWRITEN!";
        } else {
            this.table.caption.innerText = "FIRST SAVE";
        }
        let save = {
            saved: true,
            view: [],
            fixedRouteBoard: [],
            fixedRoutes: []
        };
        save.saved = true;
        save.view = [];
        for(let y=0; y<this.state.height; y++) {
            let row = [];
            for(let x=0; x<this.state.width; x++) {
                row.push(this.state.elements[y][x].className);
            }
            save.view.push(row);
        }
        save.fixedRoutes = [];
        for(const fixedRouteIndex in this.state.fixedRoutes) {
            var savedRoute = [];
            for(const step of this.state.fixedRoutes[fixedRouteIndex]) {
                savedRoute.push({
                    x: step.x,
                    y: step.y,
                    td: step.td,
                    className: step.className
                });
            }
            save.fixedRoutes[fixedRouteIndex] = savedRoute;
        }
        save.fixedRouteBoard = [];
        for(let y=0; y<this.state.height; y++) {
            let row = [];
            for(let x=0; x<this.state.width; x++) {
                row.push(0);
            }
            save.fixedRouteBoard.push(row);
        }
        for(let y=0; y<this.state.height; y++) {
            for(let x=0; x<this.state.width; x++) {
                save.fixedRouteBoard[y][x] = this.state.fixedRouteBoard[y][x];
            }
        }
        this.state.save[this.state.level] = save;
    }

    handleLoadButton(e) {
        const level = this.state.level;
        const save = this.state.save[level];
        if(save.saved) {
            this.state.reset(level);
            this.createGameContent();
            this.state.restoreElements(level);
            this.state.fixedRoutes = [];
            for(const fixedRouteIndex in save.fixedRoutes) {
                var savedRoute = [];
                for(const step of save.fixedRoutes[fixedRouteIndex]) {
                    savedRoute.push({
                        x: step.x,
                        y: step.y,
                        td: step.td,
                        className: step.className
                    });
                }
                this.state.fixedRoutes[fixedRouteIndex] = savedRoute;
            }
            this.state.fixedRouteBoard = [];
            for(let y=0; y<this.state.height; y++) {
                let row = [];
                for(let x=0; x<this.state.width; x++) {
                    row.push(0);
                }
                this.state.fixedRouteBoard.push(row);
            }
            for(let y=0; y<this.state.height; y++) {
                for(let x=0; x<this.state.width; x++) {
                    this.state.fixedRouteBoard[y][x] = save.fixedRouteBoard[y][x];
                }
            }
            this.table.caption.innerText = "GAME LOADED";
        } else {
            this.table.caption.innerText = "NO SAVE AVAILABLE";
        }
    }

    handleMouseDown(e) {
        e.preventDefault();
        if(e.target.matches('td')) {
            const {x, y} = this.xyCoord(e.target);
            if(e.which === 1) {
                if(this.state.board[y][x] > 0 && this.state.fixedRouteBoard[y][x] === 0) {
                    this.state.extend = true;
                    this.route = this.state.board[y][x];
                    this.table.caption.innerHTML = `${this.route}`;
                    this.state.clearActiveRouteBoard();
                    this.state.activeRoute = [{
                        x: x,
                        y: y,
                        td: e.target,
                        className: e.target.className
                    }];
                    this.state.activeRouteBoard[y][x] = this.route;
                }
            } else if(e.which === 3) {
                const clickedRoute = this.state.fixedRouteBoard[y][x];
                if(clickedRoute !== 0) {
                    for(const element of this.state.fixedRoutes[clickedRoute]) {
                        this.state.fixedRouteBoard[element.y][element.x] = 0;
                        this.state.elements[element.y][element.x].className = '';
                    }
                    this.state.fixedRoutes[clickedRoute] = [];
                }
            }
        }
    }

    handleMouseUp(e) {
        e.preventDefault();
        if(e.which === 1) {
            if(this.state.activeRoute.length > 0) {
                const last = this.state.activeRoute[this.state.activeRoute.length - 1];
                if(this.state.board[last.y][last.x] === this.route &&
                                           !(last.x === this.state.activeRoute[0].x &&
                                             last.y === this.state.activeRoute[0].y)) {
                    for(const place of this.state.activeRoute) {
                        this.state.fixedRouteBoard[place.y][place.x] = this.route;
                    }
                    this.state.fixedRoutes[this.route] = this.state.activeRoute;
                } else {
                    last.td.className = last.className;
                    if(this.state.activeRoute.length > 1) {
                        const lastLast = this.state.activeRoute[this.state.activeRoute.length - 2];
                        lastLast.td.className = lastLast.className;
                    }
                    this.state.clearElements();
                }
            }
            this.route = -1;
            this.state.activeRoute = [];
            this.state.clearActiveRouteBoard();

            if(this.state.isWon()) {
                this.table.caption.innerText = "GAME WON!";
                this.game.parentNode.style="background-color:rgb(195, 190, 42)";
            }
        }
    }

    handleMouseOver(e) {
        if(e.target.matches('td')) {
            const {x, y} = this.xyCoord(e.target);
            if(this.route != -1) {
                const last = this.state.activeRoute[this.state.activeRoute.length - 1];
                let reverseMovement = false;
                const deltaX = x - last.x;
                const deltaY = y - last.y;
                if(this.state.activeRoute.length > 1) {
                    const lastLast = this.state.activeRoute[this.state.activeRoute.length - 2];
                    if(lastLast.x === x && lastLast.y === y) {
                        reverseMovement = true;
                    }
                }

                if(reverseMovement) {
                    const lastLast = this.state.activeRoute[this.state.activeRoute.length - 2];
                    lastLast.td.className = lastLast.className;
                    last.td.className = this.state.fixedRouteBoard[last.y][last.x] !== 0 ? last.className : "";
                    this.state.activeRoute.pop();
                    this.state.activeRouteBoard[last.y][last.x] = 0;
                    this.state.extend = true;
                } else if(this.state.extend && Math.abs(deltaX) + Math.abs(deltaY) === 1 && this.state.activeRouteBoard[y][x] === 0) {
                        this.state.activeRoute.push({
                            x: x,
                            y: y,
                            td: e.target,
                            className: e.target.className
                        });
                        this.state.activeRouteBoard[y][x] = this.route;
                        last.className = last.td.className;
                        
                        const color = `color${this.route}`;
                        if(deltaX === 1) {
                            last.td.classList.add(color, "right");
                            e.target.classList.add(color, "left");
                        } else if(deltaX === -1) {
                            last.td.classList.add(color, "left");
                            e.target.classList.add(color, "right");
                        } else if(deltaY === 1) {
                            last.td.classList.add(color, "bottom");
                            e.target.classList.add(color, "top");
                        } else if(deltaY === -1) {
                            last.td.classList.add(color, "top");
                            e.target.classList.add(color, "bottom");
                        }
                } else {
                    this.state.extend = false;
                }
                if(this.state.board[y][x] !== 0 || this.state.fixedRouteBoard[y][x] !== 0) {
                    this.state.extend = false;
                }
            }
        }
    }

    xyCoord(e) {
        const td = e.closest('td')
        const x = td.cellIndex
        const tr = td.parentNode
        const y = tr.sectionRowIndex
        return { x, y }
    }
} 