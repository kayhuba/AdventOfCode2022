"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 09, Puzzle 02!");
const line_reader_1 = __importDefault(require("line-reader"));
class Position {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}
const headPosition = new Position();
const tailPositions = [
    new Position(),
    new Position(),
    new Position(),
    new Position(),
    new Position(),
    new Position(),
    new Position(),
    new Position(),
    new Position(),
];
const tail9PositionHistory = {};
const updateTailPosition = (head, tail) => {
    // diagonals are special - handle them first
    // case:
    // .....    .....
    // ...H. -> ..TH.
    // .T...    .....
    // .....    .....
    if (head.x - tail.x > 1 && head.y > tail.y) {
        tail.x++;
        tail.y++;
        return;
    }
    // case:
    // .....    .....
    // .T... -> .....
    // ...H.    ..TH.
    // .....    .....
    if (head.x - tail.x > 1 && head.y < tail.y) {
        tail.x++;
        tail.y--;
        return;
    }
    // case:
    // .....    .....
    // .H... -> .HT..
    // ...T.    .....
    // .....    .....
    if (head.x - tail.x < -1 && head.y > tail.y) {
        tail.x--;
        tail.y++;
        return;
    }
    // case:
    // .....    .....
    // ...T. -> .....
    // .H...    .HT..
    // .....    .....
    if (head.x - tail.x < -1 && head.y < tail.y) {
        tail.x--;
        tail.y--;
        return;
    }
    // case:
    // .....    .....
    // ..H.. -> ..H..
    // .....    ..T..
    // .T...    .....
    if (head.y - tail.y > 1 && head.x > tail.x) {
        tail.x++;
        tail.y++;
        return;
    }
    // case:
    // .....    .....
    // ..H.. -> ..H..
    // .....    ..T..
    // ...T.    .....
    if (head.y - tail.y > 1 && head.x < tail.x) {
        tail.x--;
        tail.y++;
        return;
    }
    // case:
    // .....    .....
    // .T... -> .....
    // .....    ..T..
    // ..H..    ..H..
    if (head.y - tail.y < -1 && head.x > tail.x) {
        tail.x++;
        tail.y--;
        return;
    }
    // case:
    // .....    .....
    // ..T.. -> .....
    // .....    .T...
    // .H...    .H...
    if (head.y - tail.y < -1 && head.x < tail.x) {
        tail.x--;
        tail.y--;
        return;
    }
    // handle the easy cases last
    if (head.x - tail.x > 1) {
        tail.x++;
        return;
    }
    if (head.x - tail.x < -1) {
        tail.x--;
        return;
    }
    if (head.y - tail.y > 1) {
        tail.y++;
        return;
    }
    if (head.y - tail.y < -1) {
        tail.y--;
        return;
    }
};
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    const instructionsRaw = line.split(' ');
    const move = instructionsRaw[0];
    const amount = parseInt(instructionsRaw[1]);
    let moveX = 0;
    let moveY = 0;
    switch (move) {
        case 'U':
            moveY = 1;
            break;
        case 'D':
            moveY = -1;
            break;
        case 'L':
            moveX = -1;
            break;
        case 'R':
            moveX = 1;
            break;
    }
    for (let i = 0; i < amount; i++) {
        headPosition.x += moveX;
        headPosition.y += moveY;
        updateTailPosition(headPosition, tailPositions[0]);
        for (let j = 0; j < tailPositions.length - 1; j++) {
            updateTailPosition(tailPositions[j], tailPositions[j + 1]);
        }
        tail9PositionHistory["" + tailPositions[8].x + "," + tailPositions[8].y] = true;
    }
    if (last) {
        const tailVisitedPositions = Object.keys(tail9PositionHistory).length;
        console.log("Amount of positions visited by tail 9: ", tailVisitedPositions);
    }
});
//# sourceMappingURL=puzzle02.js.map