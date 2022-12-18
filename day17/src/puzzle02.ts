console.log("Day 17, Puzzle 02!")

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
    shapeWidth: number;

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

interface SimulationResult {
    rocksSimulated: number;
    height: number;
    movementPosition: number;
}

const simulateRocks = (rocks: number, stopAtSecondRepetition: boolean, desiredResetShapeHeight?: number): SimulationResult[] => {
    const printVerticalChamber = (fromY?: number, toY?: number) => {
        let from: number = 0;
        if (fromY !== undefined) {
            from = fromY;
        }

        let to: number = verticalChamber.length - 1;
        if (toY !== undefined) {
            to = toY;
        }

        for (let y=to; y >= from; y--) {
            console.log(verticalChamber[y].map(field => field ? "#" : ".").join(''));
        }
        console.log("");
    };

    let verticalChamber: boolean[][] = [];
    let resetLineY: number = 0;

    let rockShapeAppearingIndex = 0;
    let height: number = 0;
    let movementPosition: number = 0;
    let repetition = 0;
    const result: SimulationResult[] = [];

    let i=0;
    for (; i < rocks; i++) {
        let rock: Rock = new rockShapesAppearing[rockShapeAppearingIndex++ % rockShapesAppearing.length](height + 3 - resetLineY);

        // increase height of vertical chamber
        for (let j=verticalChamber.length - height + resetLineY; j < 3 + rock.shapeHeight; j++) {
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
                height = Math.max(height, rock.y + rock.shapeHeight + resetLineY);

                if (rock.y > 3) {
                    const resetLine: boolean[] = [false, false, false, false, false, false, false];
                    for (let y = rock.y; y > rock.y - 2; y--) {
                        verticalChamber[y].forEach((value, index) => resetLine[index] = resetLine[index] || value);
                    }

                    if (resetLine.find(value => !value) === undefined) {
                        // found with experimentation with the data...
                        if ((result.length === 0 && (desiredResetShapeHeight === undefined || rock.shapeHeight === desiredResetShapeHeight)) ||
                            (result.length > 0 && ((movementPosition - result[0].movementPosition) % movements.length === 0))) {

                            resetLineY = rock.y - 1 + resetLineY;
                            verticalChamber = verticalChamber.slice(rock.y - 1);
                            //printVerticalChamber();
                            repetition++;
                            // console.log(`Reset after y: ${rock.y - 1} at height: ${height}, rocks: ${i}, movement: ${movementPosition}, match height: ${rock.shapeHeight}`);
                            result.push({
                                rocksSimulated: i,
                                height: height,
                                movementPosition: movementPosition
                            });

                            if (stopAtSecondRepetition && repetition === 2) {
                                return result;
                            }
                        }
                    }
                }
                break;
            } else {
                rock.y--;
            }
        } while (true);
    }

    return [{
        rocksSimulated: i,
        height: height,
        movementPosition: movementPosition
    }];
};

const rockShapesAppearing: {new(y: number): Rock}[] = [FlatShapeRock, PlusShapeRock, InverseLShapeRock, VerticalBarShapeRock, BlockShapeRock];
let movements: Move[];
linereader.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const rawJetMovements = line.split('');
        movements = rawJetMovements.map(move => move === '<' ? Move.LEFT : move === '>' ? Move.RIGHT : -1);
    }

    if (last) {
        const rocks: number = 5000;
        // with real data use the following line
        const results: SimulationResult[] = simulateRocks(rocks, true, 1);

        // with example data use the following line
        // const results: SimulationResult[] = simulateRocks(rocks, true);

        let realRocks: number = 1000000000000;
        const rocksAtFirstRepetition = results[0].rocksSimulated;
        const heightAtFirstRepetition = results[0].height;
        const heightGainWithRepetition = results[1].height - results[0].height;
        const rocksPerRepetition = results[1].rocksSimulated - results[0].rocksSimulated;
        const repetitions = Math.floor((realRocks - rocksAtFirstRepetition) / rocksPerRepetition);
        const heightAfterRepetition: number = repetitions * heightGainWithRepetition + heightAtFirstRepetition;
        const remainingRocksToSimulate: number = realRocks - (rocksAtFirstRepetition + repetitions * rocksPerRepetition);

        const secondResults: SimulationResult[] = simulateRocks(rocksAtFirstRepetition + remainingRocksToSimulate, true);

        const totalHeight: number = heightAfterRepetition + secondResults[0].height - heightAtFirstRepetition;

        console.log(`Tower of rocks height when simulating ${realRocks} rocks: ${totalHeight}`);
    }
});

