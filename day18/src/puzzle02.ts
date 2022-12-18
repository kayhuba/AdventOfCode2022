console.log("Day 18, Puzzle 02!")

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

        // part about puzzle2: Find "inside holes". We do: check each non-occupied piece in space
        // and see whether going in all directions it ever hits another cube and it does so in all directions
        // we know it's an empty space and pretend it being a cube (i.e. we "fill" the hole)
        const voidSpaces: Vector[] = [];
        for (let z=0; z < space.length; z++) {
            for (let y=0; y < space[z].length; y++) {
                for (let x=0; x < space[z][y].length; x++) {
                    if (!space[z][y][x]) {
                        voidSpaces.push(new Vector(x, y, z));
                    }
                }
            }
        }

        const insideHoles: Vector[] = voidSpaces.filter(vector => {
            let foundObstacle: boolean = false;

            // Z up down
            for (let z=vector.z + 1; z < zLength; z++) {
                if (space[z][vector.y][vector.x]) {
                    foundObstacle = true;
                    break;
                }
            }
            if (!foundObstacle) {
                return false;
            }

            foundObstacle = false;
            for (let z=vector.z - 1; z >= 0; z--) {
                if (space[z][vector.y][vector.x]) {
                    foundObstacle = true;
                    break;
                }
            }
            if (!foundObstacle) {
                return false;
            }

            // Y up down
            foundObstacle = false;
            for (let y=vector.y + 1; y < yLength; y++) {
                if (space[vector.z][y][vector.x]) {
                    foundObstacle = true;
                    break;
                }
            }
            if (!foundObstacle) {
                return false;
            }

            foundObstacle = false;
            for (let y=vector.y - 1; y >= 0; y--) {
                if (space[vector.z][y][vector.x]) {
                    foundObstacle = true;
                    break;
                }
            }
            if (!foundObstacle) {
                return false;
            }

            foundObstacle = false;
            for (let x=vector.x + 1; x < xLength; x++) {
                if (space[vector.z][vector.y][x]) {
                    foundObstacle = true;
                    break;
                }
            }
            if (!foundObstacle) {
                return false;
            }

            foundObstacle = false;
            for (let x=vector.x - 1; x >= 0; x--) {
                if (space[vector.z][vector.y][x]) {
                    foundObstacle = true;
                    break;
                }
            }

            return foundObstacle;
        });

        insideHoles.forEach(holeVector => space[holeVector.z][holeVector.y][holeVector.x] = true);

        let exposedSurfaces: number = 0;
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

