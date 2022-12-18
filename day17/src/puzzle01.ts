console.log("Day 17, Puzzle 01!")

import linereader from "line-reader";

enum Move {
    LEFT,
    RIGHT,
    DOWN
}

interface Rock {
    x: number;
    y: number;
    shapeHeight: number;

    canMove: (verticalChamber: boolean[][], direction: Move) => boolean;
    arrest: (verticalChamber: boolean[][]) => void;
}

class FlatShapeRock implements Rock {
    // shape: ####
    x: number = 2;
    y: number;
    shapeWidth: number = 4;
    shapeHeight: number = 1;

    canMove(verticalChamber: boolean[][], direction: Move): boolean {
        switch(direction) {
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

    arrest(verticalChamber: boolean[][]) {
        verticalChamber[this.y][this.x] = true;
        verticalChamber[this.y][this.x + 1] = true;
        verticalChamber[this.y][this.x + 2] = true;
        verticalChamber[this.y][this.x + 3] = true;
    }

    constructor(y: number) {
        this.y = y;
    }
}

class PlusShapeRock implements Rock {
    // shape:
    // ..#..
    // .###.
    // ..#..

    x: number = 2;
    y: number;
    shapeWidth: number = 3;
    shapeHeight: number = 3;

    canMove(verticalChamber: boolean[][], direction: Move): boolean {
        switch(direction) {
            case Move.RIGHT:
                if (this.x + this.shapeWidth > 6) {
                    return false;
                }

                return  !verticalChamber[this.y][this.x + 2] &&
                        !verticalChamber[this.y + 1][this.x + this.shapeWidth] &&
                        !verticalChamber[this.y + 2][this.x + 2];
            case Move.LEFT:
                if (this.x - 1 < 0) {
                    return false;
                }

                return  !verticalChamber[this.y][this.x] &&
                        !verticalChamber[this.y + 1][this.x - 1] &&
                        !verticalChamber[this.y + 2][this.x];
            case Move.DOWN:
                if (this.y === 0) {
                    return false;
                }

                return  !verticalChamber[this.y - 1][this.x + 1] &&
                        !verticalChamber[this.y][this.x] &&
                        !verticalChamber[this.y][this.x + 2];
        }
        return false;
    }

    arrest(verticalChamber: boolean[][]) {
        verticalChamber[this.y][this.x + 1] = true;
        verticalChamber[this.y + 1][this.x] = true;
        verticalChamber[this.y + 1][this.x + 1] = true;
        verticalChamber[this.y + 1][this.x + 2] = true;
        verticalChamber[this.y + 2][this.x + 1] = true;
    }

    constructor(y: number) {
        this.y = y;
    }
}

class InverseLShapeRock implements Rock {
    // shape:
    // ...#.
    // ...#.
    // .###.

    x: number = 2;
    y: number;
    shapeWidth: number = 3;
    shapeHeight: number = 3;

    canMove(verticalChamber: boolean[][], direction: Move): boolean {
        switch(direction) {
            case Move.RIGHT:
                if (this.x + this.shapeWidth > 6) {
                    return false;
                }

                return  !verticalChamber[this.y][this.x + this.shapeWidth] &&
                        !verticalChamber[this.y + 1][this.x + this.shapeWidth] &&
                        !verticalChamber[this.y + 2][this.x + this.shapeWidth];
            case Move.LEFT:
                if (this.x - 1 < 0) {
                    return false;
                }

                return  !verticalChamber[this.y][this.x - 1] &&
                        !verticalChamber[this.y + 1][this.x + 1] &&
                        !verticalChamber[this.y + 2][this.x + 1];
            case Move.DOWN:
                if (this.y === 0) {
                    return false;
                }

                return  !verticalChamber[this.y - 1][this.x] &&
                        !verticalChamber[this.y - 1][this.x + 1] &&
                        !verticalChamber[this.y - 1][this.x + 2];
        }
        return false;
    }

    arrest(verticalChamber: boolean[][]) {
        verticalChamber[this.y][this.x] = true;
        verticalChamber[this.y][this.x + 1] = true;
        verticalChamber[this.y][this.x + 2] = true;
        verticalChamber[this.y + 1][this.x + 2] = true;
        verticalChamber[this.y + 2][this.x + 2] = true;
    }

    constructor(y: number) {
        this.y = y;
    }
}

class VerticalBarShapeRock implements Rock {
    // shape:
    // .#...
    // .#...
    // .#...
    // .#...

    x: number = 2;
    y: number;
    shapeWidth: number = 1;
    shapeHeight: number = 4;

    canMove(verticalChamber: boolean[][], direction: Move): boolean {
        switch(direction) {
            case Move.RIGHT:
                if (this.x + this.shapeWidth > 6) {
                    return false;
                }

                return  !verticalChamber[this.y][this.x + this.shapeWidth] &&
                        !verticalChamber[this.y + 1][this.x + this.shapeWidth] &&
                        !verticalChamber[this.y + 2][this.x + this.shapeWidth] &&
                        !verticalChamber[this.y + 3][this.x + this.shapeWidth];
            case Move.LEFT:
                if (this.x - 1 < 0) {
                    return false;
                }

                return  !verticalChamber[this.y][this.x - 1] &&
                        !verticalChamber[this.y + 1][this.x - 1] &&
                        !verticalChamber[this.y + 2][this.x - 1] &&
                        !verticalChamber[this.y + 3][this.x - 1];
            case Move.DOWN:
                if (this.y === 0) {
                    return false;
                }

                return  !verticalChamber[this.y - 1][this.x];
        }
        return false;
    }

    arrest(verticalChamber: boolean[][]) {
        verticalChamber[this.y][this.x] = true;
        verticalChamber[this.y + 1][this.x] = true;
        verticalChamber[this.y + 2][this.x] = true;
        verticalChamber[this.y + 3][this.x] = true;
    }

    constructor(y: number) {
        this.y = y;
    }
}

class BlockShapeRock implements Rock {
    // shape:
    // .##..
    // .##..

    x: number = 2;
    y: number;
    shapeWidth: number = 2;
    shapeHeight: number = 2;

    canMove(verticalChamber: boolean[][], direction: Move): boolean {
        switch(direction) {
            case Move.RIGHT:
                if (this.x + this.shapeWidth > 6) {
                    return false;
                }

                return  !verticalChamber[this.y][this.x + this.shapeWidth] &&
                        !verticalChamber[this.y + 1][this.x + this.shapeWidth];
            case Move.LEFT:
                if (this.x - 1 < 0) {
                    return false;
                }

                return  !verticalChamber[this.y][this.x - 1] &&
                        !verticalChamber[this.y + 1][this.x - 1];
            case Move.DOWN:
                if (this.y === 0) {
                    return false;
                }

                return  !verticalChamber[this.y - 1][this.x] &&
                        !verticalChamber[this.y - 1][this.x + 1];
        }
        return false;
    }

    arrest(verticalChamber: boolean[][]) {
        verticalChamber[this.y][this.x] = true;
        verticalChamber[this.y][this.x + 1] = true;
        verticalChamber[this.y + 1][this.x] = true;
        verticalChamber[this.y + 1][this.x + 1] = true;
    }

    constructor(y: number) {
        this.y = y;
    }
}

const printVerticalChamber = () => {
    for (let y=verticalChamber.length - 1; y >= 0; y--) {
        console.log(verticalChamber[y].map(field => field ? "#" : ".").join(''));
    }
    console.log("");
};

const simulateRocks = (rocks: number): number => {
    let rockShapeAppearingIndex = 0;
    let height: number = 0;
    let movementPosition: number = 0;

    for (let i=0; i < rocks; i++) {
        let rock: Rock = new rockShapesAppearing[rockShapeAppearingIndex++ % rockShapesAppearing.length](height + 3);

        // increase height of vertical chamber
        for (let j=verticalChamber.length - height; j < 3 + rock.shapeHeight; j++) {
            verticalChamber.push([false, false, false, false, false, false, false]);
        }

        do {
            let jetMove: Move = movements[movementPosition % movements.length];
            if (rock.canMove(verticalChamber, jetMove)) {
                if (jetMove === Move.RIGHT) {
                    rock.x++;
                } else if (jetMove === Move.LEFT) {
                    rock.x--;
                }
            }
            movementPosition++;

            if (!rock.canMove(verticalChamber, Move.DOWN)) {
                rock.arrest(verticalChamber);
                height = Math.max(height, rock.y + rock.shapeHeight);
                // printVerticalChamber();
                break;
            } else {
                rock.y--;
            }
        } while (true);
    }

    return height;
};

const rockShapesAppearing: {new(y: number): Rock}[] = [FlatShapeRock, PlusShapeRock, InverseLShapeRock, VerticalBarShapeRock, BlockShapeRock];
let movements: Move[];
const verticalChamber: boolean[][] = [];
linereader.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const rawJetMovements = line.split('');
        movements = rawJetMovements.map(move => move === '<' ? Move.LEFT : move === '>' ? Move.RIGHT : -1);
    }

    if (last) {
        const rocks: number = 2022;
        const height = simulateRocks(rocks);
        console.log("Tower of rocks height: ", height);
    }
});

