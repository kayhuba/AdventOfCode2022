"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 17, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
var Move;
(function (Move) {
    Move[Move["LEFT"] = 0] = "LEFT";
    Move[Move["RIGHT"] = 1] = "RIGHT";
    Move[Move["DOWN"] = 2] = "DOWN";
})(Move || (Move = {}));
class FlatShapeRock {
    constructor(y) {
        // shape: ####
        this.x = 2;
        this.shapeWidth = 4;
        this.shapeHeight = 1;
        this.y = y;
    }
    canMove(verticalChamber, direction) {
        switch (direction) {
            case Move.RIGHT:
                if (this.x + this.shapeWidth > 6) {
                    return false;
                }
                return !verticalChamber[this.y][this.x + this.shapeWidth];
            case Move.LEFT:
                if (this.x - 1 < 0) {
                    return false;
                }
                return !verticalChamber[this.y][this.x - 1];
            case Move.DOWN:
                if (this.y === 0) {
                    return false;
                }
                return !verticalChamber[this.y - 1][this.x] &&
                    !verticalChamber[this.y - 1][this.x + 1] &&
                    !verticalChamber[this.y - 1][this.x + 2] &&
                    !verticalChamber[this.y - 1][this.x + 3];
        }
        return false;
    }
    arrest(verticalChamber) {
        verticalChamber[this.y][this.x] = true;
        verticalChamber[this.y][this.x + 1] = true;
        verticalChamber[this.y][this.x + 2] = true;
        verticalChamber[this.y][this.x + 3] = true;
    }
}
class PlusShapeRock {
    constructor(y) {
        // shape:
        // ..#..
        // .###.
        // ..#..
        this.x = 2;
        this.shapeWidth = 3;
        this.shapeHeight = 3;
        this.y = y;
    }
    canMove(verticalChamber, direction) {
        switch (direction) {
            case Move.RIGHT:
                if (this.x + this.shapeWidth > 6) {
                    return false;
                }
                return !verticalChamber[this.y][this.x + 2] &&
                    !verticalChamber[this.y + 1][this.x + this.shapeWidth] &&
                    !verticalChamber[this.y + 2][this.x + 2];
            case Move.LEFT:
                if (this.x - 1 < 0) {
                    return false;
                }
                return !verticalChamber[this.y][this.x] &&
                    !verticalChamber[this.y + 1][this.x - 1] &&
                    !verticalChamber[this.y + 2][this.x];
            case Move.DOWN:
                if (this.y === 0) {
                    return false;
                }
                return !verticalChamber[this.y - 1][this.x + 1] &&
                    !verticalChamber[this.y][this.x] &&
                    !verticalChamber[this.y][this.x + 2];
        }
        return false;
    }
    arrest(verticalChamber) {
        verticalChamber[this.y][this.x + 1] = true;
        verticalChamber[this.y + 1][this.x] = true;
        verticalChamber[this.y + 1][this.x + 1] = true;
        verticalChamber[this.y + 1][this.x + 2] = true;
        verticalChamber[this.y + 2][this.x + 1] = true;
    }
}
class InverseLShapeRock {
    constructor(y) {
        // shape:
        // ...#.
        // ...#.
        // .###.
        this.x = 2;
        this.shapeWidth = 3;
        this.shapeHeight = 3;
        this.y = y;
    }
    canMove(verticalChamber, direction) {
        switch (direction) {
            case Move.RIGHT:
                if (this.x + this.shapeWidth > 6) {
                    return false;
                }
                return !verticalChamber[this.y][this.x + this.shapeWidth] &&
                    !verticalChamber[this.y + 1][this.x + this.shapeWidth] &&
                    !verticalChamber[this.y + 2][this.x + this.shapeWidth];
            case Move.LEFT:
                if (this.x - 1 < 0) {
                    return false;
                }
                return !verticalChamber[this.y][this.x - 1] &&
                    !verticalChamber[this.y + 1][this.x + 1] &&
                    !verticalChamber[this.y + 2][this.x + 1];
            case Move.DOWN:
                if (this.y === 0) {
                    return false;
                }
                return !verticalChamber[this.y - 1][this.x] &&
                    !verticalChamber[this.y - 1][this.x + 1] &&
                    !verticalChamber[this.y - 1][this.x + 2];
        }
        return false;
    }
    arrest(verticalChamber) {
        verticalChamber[this.y][this.x] = true;
        verticalChamber[this.y][this.x + 1] = true;
        verticalChamber[this.y][this.x + 2] = true;
        verticalChamber[this.y + 1][this.x + 2] = true;
        verticalChamber[this.y + 2][this.x + 2] = true;
    }
}
class VerticalBarShapeRock {
    constructor(y) {
        // shape:
        // .#...
        // .#...
        // .#...
        // .#...
        this.x = 2;
        this.shapeWidth = 1;
        this.shapeHeight = 4;
        this.y = y;
    }
    canMove(verticalChamber, direction) {
        switch (direction) {
            case Move.RIGHT:
                if (this.x + this.shapeWidth > 6) {
                    return false;
                }
                return !verticalChamber[this.y][this.x + this.shapeWidth] &&
                    !verticalChamber[this.y + 1][this.x + this.shapeWidth] &&
                    !verticalChamber[this.y + 2][this.x + this.shapeWidth] &&
                    !verticalChamber[this.y + 3][this.x + this.shapeWidth];
            case Move.LEFT:
                if (this.x - 1 < 0) {
                    return false;
                }
                return !verticalChamber[this.y][this.x - 1] &&
                    !verticalChamber[this.y + 1][this.x - 1] &&
                    !verticalChamber[this.y + 2][this.x - 1] &&
                    !verticalChamber[this.y + 3][this.x - 1];
            case Move.DOWN:
                if (this.y === 0) {
                    return false;
                }
                return !verticalChamber[this.y - 1][this.x];
        }
        return false;
    }
    arrest(verticalChamber) {
        verticalChamber[this.y][this.x] = true;
        verticalChamber[this.y + 1][this.x] = true;
        verticalChamber[this.y + 2][this.x] = true;
        verticalChamber[this.y + 3][this.x] = true;
    }
}
class BlockShapeRock {
    constructor(y) {
        // shape:
        // .##..
        // .##..
        this.x = 2;
        this.shapeWidth = 2;
        this.shapeHeight = 2;
        this.y = y;
    }
    canMove(verticalChamber, direction) {
        switch (direction) {
            case Move.RIGHT:
                if (this.x + this.shapeWidth > 6) {
                    return false;
                }
                return !verticalChamber[this.y][this.x + this.shapeWidth] &&
                    !verticalChamber[this.y + 1][this.x + this.shapeWidth];
            case Move.LEFT:
                if (this.x - 1 < 0) {
                    return false;
                }
                return !verticalChamber[this.y][this.x - 1] &&
                    !verticalChamber[this.y + 1][this.x - 1];
            case Move.DOWN:
                if (this.y === 0) {
                    return false;
                }
                return !verticalChamber[this.y - 1][this.x] &&
                    !verticalChamber[this.y - 1][this.x + 1];
        }
        return false;
    }
    arrest(verticalChamber) {
        verticalChamber[this.y][this.x] = true;
        verticalChamber[this.y][this.x + 1] = true;
        verticalChamber[this.y + 1][this.x] = true;
        verticalChamber[this.y + 1][this.x + 1] = true;
    }
}
const printVerticalChamber = () => {
    for (let y = verticalChamber.length - 1; y >= 0; y--) {
        console.log(verticalChamber[y].map(field => field ? "#" : ".").join(''));
    }
    console.log("");
};
const simulateRocks = (rocks) => {
    let rockShapeAppearingIndex = 0;
    let height = 0;
    let movementPosition = 0;
    for (let i = 0; i < rocks; i++) {
        let rock = new rockShapesAppearing[rockShapeAppearingIndex++ % rockShapesAppearing.length](height + 3);
        // increase height of vertical chamber
        for (let j = verticalChamber.length - height; j < 3 + rock.shapeHeight; j++) {
            verticalChamber.push([false, false, false, false, false, false, false]);
        }
        do {
            let jetMove = movements[movementPosition % movements.length];
            if (rock.canMove(verticalChamber, jetMove)) {
                if (jetMove === Move.RIGHT) {
                    rock.x++;
                }
                else if (jetMove === Move.LEFT) {
                    rock.x--;
                }
            }
            movementPosition++;
            if (!rock.canMove(verticalChamber, Move.DOWN)) {
                rock.arrest(verticalChamber);
                height = Math.max(height, rock.y + rock.shapeHeight);
                // printVerticalChamber();
                break;
            }
            else {
                rock.y--;
            }
        } while (true);
    }
    return height;
};
const rockShapesAppearing = [FlatShapeRock, PlusShapeRock, InverseLShapeRock, VerticalBarShapeRock, BlockShapeRock];
let movements;
const verticalChamber = [];
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const rawJetMovements = line.split('');
        movements = rawJetMovements.map(move => move === '<' ? Move.LEFT : move === '>' ? Move.RIGHT : -1);
    }
    if (last) {
        const rocks = 2022;
        const height = simulateRocks(rocks);
        console.log("Tower of rocks height: ", height);
    }
});
//# sourceMappingURL=puzzle01.js.map