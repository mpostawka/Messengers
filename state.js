
export const Status = {
    START: 1,
    PLAYING: 2,
    LOST: 4
}

export class State {
    constructor() {
        this.width = 5;
        this.height = 5;
        this.board = [
            [1,2,3,0,0],
            [0,0,0,4,0],
            [0,4,2,0,0],
            [0,0,0,0,0],
            [0,0,1,3,0]
          ];
        this.fixedRouteBoard = [];
        this.fixedRoutes = [];
        this.elements = [];
        this.status = Status.PLAYING;
        this.activeRoute = [];
        this.activeRouteBoard = [];
        this.extend = true;
        this.clearFixedRouteBoard();
    }

    reset(version) {
        this.fixedRoutes = [];
        this.fixedRouteBoard = [];
        this.elements = [];
        this.status = Status.PLAYING;
        this.activeRoute = [];
        this.activeRouteBoard = [];
        this.extend = true;

        switch(version) {
            case "easy": 
                this.width = 5;
                this.height = 5;
                this.board = [
                    [1,2,3,0,0],
                    [0,0,0,4,0],
                    [0,4,2,0,0],
                    [0,0,0,0,0],
                    [0,0,1,3,0]
                ];
            break;
            case "medium":
                this.width = 9;
                this.height = 9;
                this.board = [
                    [2,0,0,9,0,0,0,5,0],
                    [1,0,0,8,0,11,0,0,5],
                    [0,2,0,0,6,0,7,0,0],
                    [0,0,0,0,0,11,0,10,0],
                    [0,0,0,7,0,0,0,0,0],
                    [0,0,0,4,0,0,0,0,0],
                    [0,0,0,0,0,0,0,3,6],
                    [0,9,0,4,8,0,0,0,0],
                    [0,1,0,0,0,0,0,10,3]
                ];
            break;
            case "hard":
                this.width = 9;
                this.height = 9;
                this.board = [
                    [1,0,0,0,3,0,5,0,2],
                    [0,0,0,0,0,0,8,5,0],
                    [7,4,0,6,0,0,0,0,0],
                    [0,0,0,0,0,0,1,0,0],
                    [0,0,0,0,0,0,0,0,2],
                    [0,0,4,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0],
                    [0,7,0,0,0,0,3,0,0],
                    [0,0,0,6,0,0,0,0,8]
                ];
        }
        this.clearFixedRouteBoard();
    }

    clearElements() {
        for(let y=0; y<this.height; y++) {
            for(let x=0; x<this.width; x++) {
                if(this.fixedRouteBoard[y][x] === 0)
                this.elements[y][x].className = "";
            }
        }
    }
    
    clearActiveRouteBoard() {
        this.activeRouteBoard = [];
        for(let y=0; y<this.height; y++) {
            let row = [];
            for(let x=0; x<this.width; x++) {
                row.push(0);
            }
            this.activeRouteBoard.push(row);
        }
    }

    clearFixedRouteBoard() {
        this.fixedRouteBoard = [];
        for(let y=0; y<this.height; y++) {
            let row = [];
            for(let x=0; x<this.width; x++) {
                row.push(0);
            }
            this.fixedRouteBoard.push(row);
        }
    }

    selectCard(x, y) {
        console.log("picked: ", x, y);
    }

    isWon() {
        for(const row of this.fixedRouteBoard)
            for(const value of row)
                if(value === 0)
                    return false;
        return true;
    }
}