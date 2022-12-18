console.log("Day 18, Puzzle 01!")

import linereader from "line-reader";

class Vector {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

let minX: number = Number.POSITIVE_INFINITY;
let minY: number = Number.POSITIVE_INFINITY;
let minZ: number = Number.POSITIVE_INFINITY;
let maxX: number = Number.NEGATIVE_INFINITY;
let maxY: number = Number.NEGATIVE_INFINITY;
let maxZ: number = Number.NEGATIVE_INFINITY;

let zLength: number = 0;
let yLength: number = 0;
let xLength: number = 0;

const isOccupied = (space: boolean[][][], vector: Vector) => {
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
}

const cubes: Vector[] = [];
linereader.eachLine("./input/input.txt", (line, last) => {
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
        const space: boolean[][][] = new Array(zLength);
        for (let z=0; z < zLength; z++) {
            space[z] = new Array(yLength);
            for (let y=0; y < yLength; y++) {
                space[z][y] = new Array(xLength).fill(false);
            }
        }

        cubes.forEach(cube => space[cube.z - minZ][cube.y - minY][cube.x - minX] = true);

        const adjacentVectors: Vector[] = [
            {x: 0, y: 0, z: 1},
            {x: 0, y: 0, z:-1},
            {x: 0, y: 1, z: 0},
            {x: 0, y:-1, z: 0},
            {x: 1, y: 0, z: 0},
            {x:-1, y: 0, z: 0}
        ];
        let exposedSurfaces: number = 0;
        cubes.forEach(cube => {
            exposedSurfaces += adjacentVectors.filter(vector => !isOccupied(space, new Vector(cube.x + vector.x, cube.y + vector.y, cube.z + vector.z))).length;
        });

        console.log("Total surface area: ", exposedSurfaces);
    }
});

