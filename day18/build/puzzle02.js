"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 18, Puzzle 02!");
const line_reader_1 = __importDefault(require("line-reader"));
class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    toString() {
        return `{${this.x},${this.y},${this.z}}`;
    }
}
let minX = Number.POSITIVE_INFINITY;
let minY = Number.POSITIVE_INFINITY;
let minZ = Number.POSITIVE_INFINITY;
let maxX = Number.NEGATIVE_INFINITY;
let maxY = Number.NEGATIVE_INFINITY;
let maxZ = Number.NEGATIVE_INFINITY;
let zLength = 0;
let yLength = 0;
let xLength = 0;
const cubes = [];
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const rawCoordinates = line.split(',');
        const x = parseInt(rawCoordinates[0]);
        const y = parseInt(rawCoordinates[1]);
        const z = parseInt(rawCoordinates[2]);
        cubes.push(new Vector(x, y, z));
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        minZ = Math.min(minZ, z);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        maxZ = Math.max(maxZ, z);
    }
    if (last) {
        zLength = maxZ - minZ + 1;
        yLength = maxY - minY + 1;
        xLength = maxX - minX + 1;
        const space = new Array(zLength);
        for (let z = 0; z < zLength; z++) {
            space[z] = new Array(yLength);
            for (let y = 0; y < yLength; y++) {
                space[z][y] = new Array(xLength).fill(false);
            }
        }
        cubes.forEach(cube => space[cube.z - minZ][cube.y - minY][cube.x - minX] = true);
        // part about puzzle2: Find "inside holes".
        // We do:
        // * invert the space to turn material into void and void into material
        // * for each cube find all connected cubes and mark it in the inverse
        // * in the inverse space, transfer all holes to the normal space and make them not count
        // The cubes that cannot be reached are holes. We will fill them in the last step
        // and then check the surface
        const inverseSpace = new Array(zLength + 2);
        for (let z = 0; z < zLength + 2; z++) {
            inverseSpace[z] = new Array(yLength + 2);
            for (let y = 0; y < yLength + 2; y++) {
                inverseSpace[z][y] = new Array(xLength + 2);
                for (let x = 0; x < xLength + 2; x++) {
                    if (z === 0 || z === zLength + 1 || y === 0 || y === yLength + 1 || x === 0 || x === xLength + 1) {
                        inverseSpace[z][y][x] = true;
                    }
                    else {
                        inverseSpace[z][y][x] = !space[z - 1][y - 1][x - 1];
                    }
                }
            }
        }
        const isOccupiedInInverseSpace = (vector) => {
            if (vector.x < 0 || vector.x > xLength + 1) {
                return false;
            }
            if (vector.y < 0 || vector.y > yLength + 1) {
                return false;
            }
            if (vector.z < 0 || vector.z > zLength + 1) {
                return false;
            }
            return inverseSpace[vector.z][vector.y][vector.x];
        };
        const adjacentVectors = [
            { x: 0, y: 0, z: 1 },
            { x: 0, y: 0, z: -1 },
            { x: 0, y: 1, z: 0 },
            { x: 0, y: -1, z: 0 },
            { x: 1, y: 0, z: 0 },
            { x: -1, y: 0, z: 0 }
        ];
        const rootCube = new Vector(0, 0, 0);
        let discoveredCubes = [];
        let suspect = rootCube;
        while (suspect !== undefined) {
            const newSuspects = adjacentVectors
                // @ts-ignore
                .map(direction => new Vector(suspect.x + direction.x, suspect.y + direction.y, suspect.z + direction.z))
                .filter(target => isOccupiedInInverseSpace(target));
            discoveredCubes = discoveredCubes.concat(newSuspects);
            inverseSpace[suspect.z][suspect.y][suspect.x] = false;
            suspect = discoveredCubes.pop();
        }
        for (let z = 1; z < zLength + 1; z++) {
            for (let y = 1; y < yLength + 1; y++) {
                for (let x = 1; x < xLength + 1; x++) {
                    if (inverseSpace[z][y][x]) {
                        space[z - 1][y - 1][x - 1] = true;
                    }
                }
            }
        }
        const isOccupiedInNormalSpace = (vector) => {
            if (vector.x - minX < 0 || vector.x - minX >= xLength) {
                return false;
            }
            if (vector.y - minY < 0 || vector.y - minY >= yLength) {
                return false;
            }
            if (vector.z - minZ < 0 || vector.z - minZ >= zLength) {
                return false;
            }
            return space[vector.z - minZ][vector.y - minY][vector.x - minX];
        };
        let exposedSurfaces = 0;
        cubes
            .filter(cube => space[cube.z - minZ][cube.y - minY][cube.x - minX])
            .forEach(cube => {
            exposedSurfaces += adjacentVectors.filter(vector => !isOccupiedInNormalSpace(new Vector(cube.x + vector.x, cube.y + vector.y, cube.z + vector.z))).length;
        });
        console.log("Total surface area: ", exposedSurfaces);
    }
});
//# sourceMappingURL=puzzle02.js.map