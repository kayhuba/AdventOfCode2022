"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 18, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
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
const isOccupied = (space, vector) => {
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
        let exposedSurfaces = 0;
        cubes.forEach(cube => {
            if (!isOccupied(space, new Vector(cube.x, cube.y, cube.z + 1))) {
                exposedSurfaces++;
            }
            if (!isOccupied(space, new Vector(cube.x, cube.y, cube.z - 1))) {
                exposedSurfaces++;
            }
            if (!isOccupied(space, new Vector(cube.x, cube.y + 1, cube.z))) {
                exposedSurfaces++;
            }
            if (!isOccupied(space, new Vector(cube.x, cube.y - 1, cube.z))) {
                exposedSurfaces++;
            }
            if (!isOccupied(space, new Vector(cube.x + 1, cube.y, cube.z))) {
                exposedSurfaces++;
            }
            if (!isOccupied(space, new Vector(cube.x - 1, cube.y, cube.z))) {
                exposedSurfaces++;
            }
        });
        console.log("Total surface area: ", exposedSurfaces);
    }
});
//# sourceMappingURL=puzzle01.js.map