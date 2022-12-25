"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
console.log("Day 24, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
class TimeCoords {
    constructor(x, y, t) {
        this.x = x;
        this.y = y;
        this.t = t;
    }
}
class Coords {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    equals(coords) {
        return this.x === coords.x && this.y === coords.y;
    }
    toString() {
        return "" + this.x + "," + this.y;
    }
}
class Blizzard {
    constructor(startPosition, movingDirection) {
        this.startPosition = startPosition;
        this.movingDirection = movingDirection;
    }
    simulate(minutes, fieldWidth, fieldHeight) {
        let dx = 0;
        let dy = 0;
        switch (this.movingDirection) {
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
        let x = (this.startPosition.x + dx - 1) % fieldWidth + 1;
        if (x <= 0) {
            x = fieldWidth + x;
        }
        (0, assert_1.default)(x > 0);
        (0, assert_1.default)(x <= fieldWidth);
        let y = (this.startPosition.y + dy - 1) % fieldHeight + 1;
        if (y <= 0) {
            y = fieldHeight + y;
        }
        (0, assert_1.default)(y > 0);
        (0, assert_1.default)(y <= fieldHeight);
        return new Coords(x, y);
    }
    ;
    isCrossing(position) {
        if (this.movingDirection === "<" || this.movingDirection === ">") {
            return position.y === this.startPosition.y;
        }
        return position.x === this.startPosition.x;
    }
}
var Action;
(function (Action) {
    Action[Action["NONE"] = 0] = "NONE";
    Action[Action["WAIT"] = 1] = "WAIT";
    Action[Action["MOVE"] = 2] = "MOVE";
})(Action || (Action = {}));
class Node {
    constructor(position, stepCost, estimatedDistanceToTarget, previousNode, action) {
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
    constructor(time, position, action) {
        this.time = time;
        this.position = position;
        this.action = action;
    }
    toString() {
        return `Minute ${this.time}, ${Action[this.action]} to / at ${this.position}`;
    }
}
const distance = (a, b) => {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
};
const movePosition = (position, move) => {
    return new Coords(position.x + move[0], position.y + move[1]);
};
const findPath = () => {
    const isWithinLimits = (position) => {
        if (position.x === startPosition.x && position.y === startPosition.y) {
            return true;
        }
        if (position.x === endPosition.x && position.y === endPosition.y) {
            return true;
        }
        return position.x > 0 && position.x <= fieldWidth && position.y > 0 && position.y <= fieldHeight;
    };
    const isBlizzardFree = (timeCoords) => {
        const blizzard = blizzards.find((blizzard, index) => blizzard.simulate(timeCoords.t, fieldWidth, fieldHeight).equals(timeCoords));
        return blizzard === undefined;
        // return blizzards.find(blizzard => blizzard.simulate(timeCoords.t, fieldWidth, fieldHeight).equals(timeCoords)) === undefined;
    };
    const examineNode = (node) => {
        const successorNodes = [];
        // can we wait?
        if (isBlizzardFree(new TimeCoords(node.position.x, node.position.y, node.stepCost + 1))) {
            successorNodes.push(new Node(node.position, node.stepCost + 1, node.estimatedDistanceToTarget, node, Action.WAIT));
        }
        const potentialMoves = [
            // right
            [1, 0],
            // down
            [0, 1],
            // left
            [-1, 0],
            // up
            [0, -1]
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
            let successorInOpenList = openList.find(element => successor.position.x === element.position.x &&
                successor.position.y === element.position.y &&
                successor.stepCost === element.stepCost);
            if (successorInOpenList) {
                return;
            }
            openList.push(successor);
        });
    };
    let startPosition = new Coords(1, 0);
    const endPosition = new Coords(fieldWidth, fieldHeight + 1);
    const openList = [];
    const closedList = new Map();
    let current;
    openList.push(new Node(startPosition, 0, distance(endPosition, startPosition)));
    do {
        openList.sort((a, b) => (b.stepCost + b.estimatedDistanceToTarget) - (a.stepCost + a.estimatedDistanceToTarget));
        current = openList.pop();
        (0, assert_1.default)(current);
        // console.log(`Current position ${current.position}, stepCost: ${current.stepCost}`);
        if (current.position.x === endPosition.x && current.position.y === endPosition.y) {
            const path = [];
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
const blizzards = [];
let readLineCount = 0;
let fieldHeight = 0;
let fieldWidth = 0;
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
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
        const minutes = reversedPath[0].time;
        // const path = reversedPath.reverse();
        // path.forEach(step => console.log(step.toString()));
        console.log("Fewest minutes required to find the path: ", minutes);
    }
});
//# sourceMappingURL=puzzle01.js.map