console.log("Day 02, Puzzle 02!")

import linereader from "line-reader";

enum RockPaperScissors {
    ROCK,
    PAPER,
    SCISSORS
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
            myAction = RockPaperScissors.ROCK;
            score += 1;
            if (opponentAction == RockPaperScissors.ROCK) {
                score += 3;
            }
            if (opponentAction == RockPaperScissors.SCISSORS) {
                score += 6;
            }
            break;
        case 'Y':
            myAction = RockPaperScissors.PAPER;
            score += 2;
            if (opponentAction == RockPaperScissors.PAPER) {
                score += 3;
            }
            if (opponentAction == RockPaperScissors.ROCK) {
                score += 6;
            }
            break;
        case 'Z':
            myAction = RockPaperScissors.SCISSORS;
            score += 3;
            if (opponentAction == RockPaperScissors.SCISSORS) {
                score += 3;
            }
            if (opponentAction == RockPaperScissors.PAPER) {
                score += 6;
            }
            break;
        default:
            return;
    }

    if (last) {
        console.log("Total score: ", score);
    }
});

