"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 15, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
class Diamond {
    constructor(center, halfDiagonalLength) {
        this.center = center;
        this.halfDiagonalLength = halfDiagonalLength;
    }
}
const diamonds = [];
const sensors = [];
const beacons = [];
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const match = /^Sensor at x=([-]?\d+), y=([-]?\d+): closest beacon is at x=([-]?\d+), y=([-]?\d+)$/.exec(line);
        if (match) {
            sensors.push({ x: parseInt(match[1]), y: parseInt(match[2]) });
            beacons.push({ x: parseInt(match[3]), y: parseInt(match[4]) });
        }
    }
    if (last) {
        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        sensors.forEach((sensor, index) => {
            // Manhattan distance
            const distanceToBeacon = Math.abs(beacons[index].x - sensor.x) + Math.abs(beacons[index].y - sensor.y);
            diamonds.push(new Diamond(sensor, distanceToBeacon));
            maxX = Math.max(maxX, sensor.x + distanceToBeacon);
            minX = Math.min(minX, sensor.x - distanceToBeacon);
        });
        const isInDiamond = (pos, diamond) => {
            const posDistanceToCenter = Math.abs(pos.x - diamond.center.x) + Math.abs(pos.y - diamond.center.y);
            return posDistanceToCenter <= diamond.halfDiagonalLength;
        };
        let unavailableBeaconSpots = 0;
        const yLine = 2000000;
        for (let x = minX; x < maxX; x++) {
            // is there a beacon on this position?
            if (beacons.filter(beacon => beacon.x === x && beacon.y === yLine).length > 0) {
                continue;
            }
            for (let i = 0; i < diamonds.length; i++) {
                // is it in range of a sensor?
                if (isInDiamond({ x: x, y: yLine }, diamonds[i])) {
                    unavailableBeaconSpots++;
                    break;
                }
            }
        }
        console.log(`Amount of unavailable beacon spots on line ${yLine}: ${unavailableBeaconSpots}`);
    }
});
//# sourceMappingURL=puzzle01.js.map