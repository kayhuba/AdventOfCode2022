console.log("Day 09, Puzzle 01!")

import linereader from "line-reader";

class Position {
    x: number = 0;
    y: number = 0;
}

const headPosition: Position = new Position();
const tailPosition: Position = new Position();
const tailPositionHistory: any = {};

const updateTailPosition = () => {
    // diagonals are special - handle them first
    // case:
    // .....    .....
    // ...H. -> ..TH.
    // .T...    .....
    // .....    .....
    if (headPosition.x - tailPosition.x > 1 && headPosition.y > tailPosition.y) {
        tailPosition.x++;
        tailPosition.y++;
        return;
    }

    // case:
    // .....    .....
    // .T... -> .....
    // ...H.    ..TH.
    // .....    .....
    if (headPosition.x - tailPosition.x > 1 && headPosition.y < tailPosition.y) {
        tailPosition.x++;
        tailPosition.y--;
        return;
    }

    // case:
    // .....    .....
    // .H... -> .HT..
    // ...T.    .....
    // .....    .....
    if (headPosition.x - tailPosition.x < -1 && headPosition.y > tailPosition.y) {
        tailPosition.x--;
        tailPosition.y++;
        return;
    }

    // case:
    // .....    .....
    // ...T. -> .....
    // .H...    .HT..
    // .....    .....
    if (headPosition.x - tailPosition.x < -1 && headPosition.y < tailPosition.y) {
        tailPosition.x--;
        tailPosition.y--;
        return;
    }




    // case:
    // .....    .....
    // ..H.. -> ..H..
    // .....    ..T..
    // .T...    .....
    if (headPosition.y - tailPosition.y > 1 && headPosition.x > tailPosition.x) {
        tailPosition.x++;
        tailPosition.y++;
        return;
    }

    // case:
    // .....    .....
    // ..H.. -> ..H..
    // .....    ..T..
    // ...T.    .....
    if (headPosition.y - tailPosition.y > 1 && headPosition.x < tailPosition.x) {
        tailPosition.x--;
        tailPosition.y++;
        return;
    }

    // case:
    // .....    .....
    // .T... -> .....
    // .....    ..T..
    // ..H..    ..H..
    if (headPosition.y - tailPosition.y < -1 && headPosition.x > tailPosition.x) {
        tailPosition.x++;
        tailPosition.y--;
        return;
    }

    // case:
    // .....    .....
    // ..T.. -> .....
    // .....    .T...
    // .H...    .H...
    if (headPosition.y - tailPosition.y < -1 && headPosition.x < tailPosition.x) {
        tailPosition.x--;
        tailPosition.y--;
        return;
    }

    // handle the easy cases last
    if (headPosition.x - tailPosition.x > 1) {
        tailPosition.x++;
        return;
    }

    if (headPosition.x - tailPosition.x < -1) {
        tailPosition.x--;
        return;
    }

    if (headPosition.y - tailPosition.y > 1) {
        tailPosition.y++;
        return;
    }

    if (headPosition.y - tailPosition.y < -1) {
        tailPosition.y--;
        return;
    }
};

linereader.eachLine("./input/input.txt", (line, last) => {
    const instructionsRaw = line.split(' ');
    const move = instructionsRaw[0];
    const amount = parseInt(instructionsRaw[1]);
    let moveX = 0;
    let moveY = 0;
    switch(move) {
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

    for (let i=0; i < amount; i++) {
        headPosition.x += moveX;
        headPosition.y += moveY;
        updateTailPosition();
        tailPositionHistory["" + tailPosition.x + "," + tailPosition.y] = true;
    }

    if (last) {
        const tailVisitedPositions = Object.keys(tailPositionHistory).length;
        console.log("Amount of positions visited by tail: ", tailVisitedPositions);
    }
});

