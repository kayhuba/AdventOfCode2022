import assert from "assert";

console.log("Day 24, Puzzle 01!")

import linereader from "line-reader";

class TimeCoords {
    x: number;
    y: number;
    t: number;

    constructor(x: number, y: number, t: number) {
        this.x = x;
        this.y = y;
        this.t = t;
    }
}

class Coords {
    x: number;
    y: number;

    equals(coords: Coords | TimeCoords): boolean {
        return this.x === coords.x && this.y === coords.y;
    }

    toString(): string {
        return "" + this.x + "," + this.y;
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

type MovingDirection = ">" | "v" | "<" | "^";

class Blizzard {
    startPosition: Coords;
    movingDirection: MovingDirection;

    simulate(minutes: number, fieldWidth: number, fieldHeight: number): Coords {
        let dx: number = 0;
        let dy: number = 0;
        switch(this.movingDirection) {
            case ">":
                dx = minutes;
                break;
            case "v":
                dy = minutes;
                break;
            case "<":
                dx = -minutes;
                break;
            case "^":
                dy = -minutes;
                break;
        }

        let x: number = (this.startPosition.x + dx - 1) % fieldWidth + 1;
        if (x <= 0) {
            x = fieldWidth + x;
        }
        assert(x > 0);
        assert(x <= fieldWidth);

        let y: number = (this.startPosition.y + dy - 1) % fieldHeight + 1;
        if (y <= 0) {
            y = fieldHeight + y;
        }
        assert(y > 0);
        assert(y <= fieldHeight);

        return new Coords(x, y);
    };

    isCrossing(position: Coords): boolean {
        if (this.movingDirection === "<" || this.movingDirection === ">") {
            return position.y === this.startPosition.y;
        }

        return position.x === this.startPosition.x;
    }

    constructor(startPosition: Coords, movingDirection: MovingDirection) {
        this.startPosition = startPosition;
        this.movingDirection = movingDirection;
    }
}

enum Action {
    NONE,
    WAIT,
    MOVE
}

class Node {
    action: Action;
    position: Coords;
    stepCost: number;
    estimatedDistanceToTarget: number;
    previousNode?: Node;

    constructor(position: Coords, stepCost: number, estimatedDistanceToTarget: number, previousNode?: Node, action?: Action) {
        if (!action) {
            action = Action.NONE;
        }
        this.action = action;
        this.position = position;
        this.stepCost = stepCost;
        this.estimatedDistanceToTarget = estimatedDistanceToTarget;
        this.previousNode = previousNode;
    }
}

class ResultingPathElement {
    time: number;
    position: Coords;
    action: Action;

    toString() {
        return `Minute ${this.time}, ${Action[this.action]} to / at ${this.position}`;
    }

    constructor(time: number, position: Coords, action: Action) {
        this.time = time;
        this.position = position;
        this.action = action;
    }
}

const distance = (a: Coords, b: Coords): number => {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
};

const movePosition = (position: Coords, move: number[]): Coords => {
    return new Coords(position.x + move[0], position.y + move[1]);
};

const findPath = (): ResultingPathElement[] => {
    const isWithinLimits = (position: Coords): boolean => {
        if (position.x === startPosition.x && position.y === startPosition.y) {
            return true;
        }

        if (position.x === endPosition.x && position.y === endPosition.y) {
            return true;
        }

        return position.x > 0 && position.x <= fieldWidth && position.y > 0 && position.y <= fieldHeight;
    };

    const isBlizzardFree = (timeCoords: TimeCoords): boolean => {
        const blizzard = blizzards.find((blizzard, index) => blizzard.simulate(timeCoords.t, fieldWidth, fieldHeight).equals(timeCoords));
        return blizzard === undefined;
        // return blizzards.find(blizzard => blizzard.simulate(timeCoords.t, fieldWidth, fieldHeight).equals(timeCoords)) === undefined;
    };

    const examineNode = (node: Node) => {
        const successorNodes: Node[] = [];

        // can we wait?
        if (isBlizzardFree(new TimeCoords(node.position.x, node.position.y, node.stepCost + 1))) {
            successorNodes.push(new Node(node.position, node.stepCost + 1, node.estimatedDistanceToTarget, node, Action.WAIT));
        }

        const potentialMoves: number[][] = [
            // right
            [ 1,  0],
            // down
            [ 0,  1],
            // left
            [-1,  0],
            // up
            [ 0, -1]
        ];

        potentialMoves.forEach(move => {
            const targetPosition = movePosition(node.position, move);
            if (isWithinLimits(targetPosition) && isBlizzardFree(new TimeCoords(targetPosition.x, targetPosition.y, node.stepCost + 1))) {
                successorNodes.push(new Node(targetPosition, node.stepCost + 1, distance(targetPosition, endPosition), node, Action.MOVE));
            }
        });

        successorNodes.forEach(successor => {
            if (closedList.has(`${successor.position.x},${successor.position.y},${successor.stepCost}`)) {
                return;
            }

            let successorInOpenList: Node | undefined = openList.find(element =>
                successor.position.x === element.position.x &&
                successor.position.y === element.position.y &&
                successor.stepCost === element.stepCost);

            if (successorInOpenList) {
                return;
            }

            openList.push(successor);
        });
    };

    let startPosition: Coords = new Coords(1, 0);
    const endPosition: Coords = new Coords(fieldWidth, fieldHeight + 1);

    const openList: Node[] = [];
    const closedList: Map<string, Node> = new Map();

    let current: Node | undefined;
    openList.push(new Node(startPosition, 0, distance(endPosition, startPosition)));
    do {
        openList.sort((a, b) => (b.stepCost + b.estimatedDistanceToTarget) - (a.stepCost + a.estimatedDistanceToTarget));

        current = openList.pop();
        assert(current);
        // console.log(`Current position ${current.position}, stepCost: ${current.stepCost}`);
        if (current.position.x === endPosition.x && current.position.y === endPosition.y) {
            const path: ResultingPathElement[] = [];
            do {
                path.push(new ResultingPathElement(current.stepCost, current.position, current.action));
                current = current.previousNode;
            } while (current !== undefined);
            return path;
        }

        closedList.set(`${current.position.x},${current.position.y},${current.stepCost}`, current);
        examineNode(current);
    } while (openList.length > 0);

    return [];
};

const blizzards: Blizzard[] = [];
let readLineCount: number = 0;
let fieldHeight: number = 0;
let fieldWidth: number = 0;
linereader.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        if (!line.startsWith("# #") && !line.startsWith("##")) {
            fieldWidth = line.length - 2;
            line.split('').forEach((field, index) => {
                if (field === "<" || field === ">" || field === "^" || field === "v") {
                    blizzards.push(new Blizzard(new Coords(index, readLineCount), field));
                }
            });
        }
        readLineCount++;
        fieldHeight = readLineCount - 2;
    }

    if (last) {
        const reversedPath = findPath();
        const minutes: number = reversedPath[0].time;
        // const path = reversedPath.reverse();
        // path.forEach(step => console.log(step.toString()));
        console.log("Fewest minutes required to find the path: ", minutes);
    }
});
