console.log("Day 14, Puzzle 2!")

import linereader from "line-reader";

interface Coord {
    x: number;
    y: number;
}

class Path {
    waypoints: Coord[];

    constructor(waypoints: Coord[]) {
        this.waypoints = waypoints;
    }
}

const drawPath = (slice: string[][], path: Path) => {
    for (let i=0; i < path.waypoints.length - 1; i++) {
        const from = path.waypoints[i];
        const to = path.waypoints[i + 1];

        for (let y = 0; y <= Math.abs(to.y - from.y); y++) {
            for (let x = 0; x <= Math.abs(to.x - from.x); x++) {
                slice[y * Math.sign(to.y - from.y) + from.y][x * Math.sign(to.x - from.x) + from.x] = "#";
            }
        }
    }
};

const print = (verticalSlice: string[][], fromX?: number, toX?: number) => {
    if (fromX !== undefined && toX !== undefined) {
        verticalSlice.forEach(line =>  {
            let printLine: string[] = [];
            for (let i=fromX; i < toX; i++) {
                printLine.push(line[i]);
            }

            console.log(printLine.join(''));
        });
    } else {
        verticalSlice.forEach(line => console.log(line.join('')));
    }
};

const simulateSand = (verticalSlice: string[][]): number => {
    let sandPosition: Coord = {x: 500, y: 0};

    const isAir = (position: Coord): boolean => {
        return verticalSlice[position.y][position.x] === '.';
    };

    const updateSandPosition = (position: Coord): boolean => {
        const originalPosition: Coord = {
            x: position.x,
            y: position.y
        };
        const moves: Coord[] = [
            {x: position.x, y: position.y + 1},
            {x: position.x - 1, y:position.y + 1},
            {x: position.x + 1, y:position.y + 1}
        ];

        for (let i=0; i < moves.length; i++) {
            position.x = moves[i].x;
            position.y = moves[i].y;

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

            if (sandPosition.x === 500 && sandPosition.y === 0) {
                break;
            }

            maxX = Math.max(maxX, sandPosition.x);
            minX = Math.min(minX, sandPosition.x);

            sandPosition = {x: 500, y: 0};
        }
    } while (true);

    return sandAmount;
};

let verticalSlice: string[][];
const drawPaths: Path[] = [];
let minX: number = 1000;
let maxY: number = 0;
let maxX: number = 0;
linereader.eachLine("./input/input.txt", (line, last) => {
    const coordsRaw = line.split(' -> ');
    const path: Path = new Path(coordsRaw
        .map(coordRaw => coordRaw.split(','))
        .map(coordPairString => {
            const x: number = parseInt(coordPairString[0]);
            const y: number = parseInt(coordPairString[1]);
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
        maxY += 2;
        drawPaths.push(new Path([{x:0, y:maxY}, {x: 1000, y:maxY}]));

        // initially all of the vertical slice is assumed to be air
        verticalSlice = new Array(maxY + 1);
        for (let y=0; y < maxY + 1; y++) {
            verticalSlice[y] = new Array(1002);
            for (let x=0; x < 1001; x++) {
                verticalSlice[y][x] = '.';
            }
        }

        // draw concrete walls
        drawPaths.forEach(path => drawPath(verticalSlice, path));

        let sandAmount = simulateSand(verticalSlice);

        // draw outcome
        // print(verticalSlice, 493, 510);
        print(verticalSlice, minX - 2, maxX + 2);

        console.log("The amount of sand emitted: ", sandAmount);
    }
});

