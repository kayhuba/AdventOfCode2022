console.log("Day 02, Puzzle 02!")

import linereader from "line-reader";

enum RockPaperScissors {
    ROCK,
    PAPER,
    SCISSORS
}

let myActionScore = (action: RockPaperScissors) => {
    switch(action) {
        case RockPaperScissors.ROCK:
            return 1;
        case RockPaperScissors.PAPER:
            return 2;
        case RockPaperScissors.SCISSORS:
            return 3;
    }
}

let score = 0;
linereader.eachLine("./input/input.txt", (line, last) => {
    const lineparts: string[] = line.split(" ");

    let opponentAction: RockPaperScissors;
    switch(lineparts[0]) {
        case 'A':
            opponentAction = RockPaperScissors.ROCK
            break;
        case 'B':
            opponentAction = RockPaperScissors.PAPER
            break;
        case 'C':
            opponentAction = RockPaperScissors.SCISSORS
            break;
        default:
            return;
    }

    let myAction: RockPaperScissors;
    switch(lineparts[1]) {
        case 'X':
            // we need to loose
            if (opponentAction === RockPaperScissors.ROCK) {
                myAction = RockPaperScissors.SCISSORS;
            } else if (opponentAction === RockPaperScissors.PAPER) {
                myAction = RockPaperScissors.ROCK;
            } else if (opponentAction === RockPaperScissors.SCISSORS) {
                myAction = RockPaperScissors.PAPER
            } else {
                throw new Error("Unknown opponent action");
            }
            break;
        case 'Y':
            // we need to make a draw
            myAction = opponentAction;
            score += 3;
            break;
        case 'Z':
            // we need to win
            score += 6;
            if (opponentAction === RockPaperScissors.ROCK) {
                myAction = RockPaperScissors.PAPER;
            } else if (opponentAction === RockPaperScissors.PAPER) {
                myAction = RockPaperScissors.SCISSORS;
            } else if (opponentAction === RockPaperScissors.SCISSORS) {
                myAction = RockPaperScissors.ROCK
            } else {
                throw new Error("Unknown opponent action");
            }
            break;
        default:
            return;
    }

    score += myActionScore(myAction)

    if (last) {
        console.log("Total score: ", score);
    }
});

