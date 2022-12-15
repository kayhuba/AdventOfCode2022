console.log("Day 15, Puzzle 02!")

import linereader from "line-reader";

interface Position {
    x: number;
    y: number;
}

class Diamond {
    center: Position;
    halfDiagonalLength: number;

    constructor(center: Position, halfDiagonalLength: number) {
        this.center = center;
        this.halfDiagonalLength = halfDiagonalLength;
    }
}

const diamonds: Diamond[] = [];
const sensors: Position[] = [];
const beacons: Position[] = [];
linereader.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const match = /^Sensor at x=([-]?\d+), y=([-]?\d+): closest beacon is at x=([-]?\d+), y=([-]?\d+)$/.exec(line);
        if (match) {
            sensors.push({x: parseInt(match[1]), y: parseInt(match[2])});
            beacons.push({x: parseInt(match[3]), y: parseInt(match[4])});
        }
    }

    if (last) {
        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;
        sensors.forEach((sensor, index) => {
            // Manhattan distance
            const distanceToBeacon = Math.abs(beacons[index].x - sensor.x) + Math.abs(beacons[index].y - sensor.y);
            diamonds.push(new Diamond(sensor, distanceToBeacon));
            maxX = Math.max(maxX, sensor.x + distanceToBeacon);
            maxY = Math.max(maxY, sensor.y + distanceToBeacon);
            minX = Math.min(minX, sensor.x - distanceToBeacon);
        });

        const isInDiamond = (pos: Position, diamond: Diamond): boolean => {
            const posDistanceToCenter: number = Math.abs(pos.x - diamond.center.x) + Math.abs(pos.y - diamond.center.y);
            return posDistanceToCenter <= diamond.halfDiagonalLength;
        };

        const max: number = 4000000;
        for (let y=0; y < max; y++) {
            const diamondsCutByLine: Diamond[] = diamonds.filter(diamond => Math.abs(diamond.center.y - y) < diamond.halfDiagonalLength);
            for (let x=0; x < max; x++) {
                let available: boolean = true;
                for (let i=0; i < diamondsCutByLine.length; i++) {
                    // is it in range of a sensor?
                    if (isInDiamond({x: x, y: y}, diamondsCutByLine[i])) {
                        const cutLength = 2 * (diamondsCutByLine[i].halfDiagonalLength - Math.abs(diamondsCutByLine[i].center.y - y)) - 1;
                        x += Math.floor(cutLength / 2) + diamondsCutByLine[i].center.x - x + 1;
                        available = false;
                        break;
                    }
                }

                if (available) {
                    // is there a beacon on this position?
                    if (beacons.find(beacon => beacon.x === x && beacon.y === y) !== undefined) {
                        continue;
                    }

                    console.log(`Tuning frequency is ${4000000 * x + y}`);
                }
            }
        }
    }
});

