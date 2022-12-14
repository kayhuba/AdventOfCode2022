"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 14, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
class Path {
    constructor(waypoints) {
        this.waypoints = waypoints;
    }
}
const drawPath = (slice, path) => {
    for (let i = 0; i < path.waypoints.length - 1; i++) {
        const from = path.waypoints[i];
        const to = path.waypoints[i + 1];
        for (let y = 0; y <= Math.abs(to.y - from.y); y++) {
            for (let x = 0; x <= Math.abs(to.x - from.x); x++) {
                slice[y * Math.sign(to.y - from.y) + from.y][x * Math.sign(to.x - from.x) + from.x] = "#";
            }
        }
    }
};
const print = (verticalSlice, fromX, toX) => {
    if (fromX !== undefined && toX !== undefined) {
        verticalSlice.forEach(line => {
            let printLine = [];
            for (let i = fromX; i < toX; i++) {
                printLine.push(line[i]);
            }
            console.log(printLine.join(''));
        });
    }
    else {
        verticalSlice.forEach(line => console.log(line.join('')));
    }
};
const simulateSand = (verticalSlice) => {
    let sandPosition = { x: 500, y: 0 };
    const isVoid = (position) => {
        if (position.y > maxY) {
            return true;
        }
        if (position.x < 0 || position.x > maxX) {
            return true;
        }
        return false;
    };
    const isAir = (position) => {
        if (isVoid(position)) {
            return false;
        }
        return verticalSlice[position.y][position.x] === '.';
    };
    const updateSandPosition = (position) => {
        const originalPosition = {
            x: position.x,
            y: position.y
        };
        const moves = [
            { x: position.x, y: position.y + 1 },
            { x: position.x - 1, y: position.y + 1 },
            { x: position.x + 1, y: position.y + 1 }
        ];
        for (let i = 0; i < moves.length; i++) {
            position.x = moves[i].x;
            position.y = moves[i].y;
            if (isVoid(position)) {
                return true;
            }
            if (isAir(position)) {
                return true;
            }
        }
        position.x = originalPosition.x;
        position.y = originalPosition.y;
        return false;
    };
    let sandAmount = 0;
    do {
        if (!updateSandPosition(sandPosition)) {
            verticalSlice[sandPosition.y][sandPosition.x] = 'o';
            sandAmount++;
            sandPosition = { x: 500, y: 0 };
        }
    } while (!isVoid(sandPosition));
    return sandAmount;
};
let verticalSlice;
const drawPaths = [];
let minX = 1000;
let maxY = 0;
let maxX = 0;
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    const coordsRaw = line.split(' -> ');
    const path = new Path(coordsRaw
        .map(coordRaw => coordRaw.split(','))
        .map(coordPairString => {
        const x = parseInt(coordPairString[0]);
        const y = parseInt(coordPairString[1]);
        minX = Math.min(x, minX);
        maxX = Math.max(x, maxX);
        maxY = Math.max(y, maxY);
        return {
            x: x,
            y: y
        };
    }));
    drawPaths.push(path);
    if (last) {
        // initially all of the vertical slice is assumed to be air
        verticalSlice = new Array(maxY + 1);
        for (let y = 0; y < maxY + 1; y++) {
            verticalSlice[y] = new Array(maxX + 1);
            for (let x = 0; x < maxX + 1; x++) {
                verticalSlice[y][x] = '.';
            }
        }
        // draw concrete walls
        drawPaths.forEach(path => drawPath(verticalSlice, path));
        let sandAmount = simulateSand(verticalSlice);
        // draw outcome
        // print(verticalSlice, 493, 510);
        print(verticalSlice, minX, maxX);
        console.log("The amount of sand emitted: ", sandAmount);
    }
});
//# sourceMappingURL=puzzle01.js.map