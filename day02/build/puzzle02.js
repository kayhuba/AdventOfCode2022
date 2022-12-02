"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 02, Puzzle 02!");
var line_reader_1 = __importDefault(require("line-reader"));
var RockPaperScissors;
(function (RockPaperScissors) {
    RockPaperScissors[RockPaperScissors["ROCK"] = 0] = "ROCK";
    RockPaperScissors[RockPaperScissors["PAPER"] = 1] = "PAPER";
    RockPaperScissors[RockPaperScissors["SCISSORS"] = 2] = "SCISSORS";
})(RockPaperScissors || (RockPaperScissors = {}));
var myActionScore = function (action) {
    switch (action) {
        case RockPaperScissors.ROCK:
            return 1;
        case RockPaperScissors.PAPER:
            return 2;
        case RockPaperScissors.SCISSORS:
            return 3;
    }
};
var score = 0;
line_reader_1.default.eachLine("./input/input.txt", function (line, last) {
    var lineparts = line.split(" ");
    var opponentAction;
    switch (lineparts[0]) {
        case 'A':
            opponentAction = RockPaperScissors.ROCK;
            break;
        case 'B':
            opponentAction = RockPaperScissors.PAPER;
            break;
        case 'C':
            opponentAction = RockPaperScissors.SCISSORS;
            break;
        default:
            return;
    }
    var myAction;
    switch (lineparts[1]) {
        case 'X':
            // we need to loose
            if (opponentAction === RockPaperScissors.ROCK) {
                myAction = RockPaperScissors.SCISSORS;
            }
            else if (opponentAction === RockPaperScissors.PAPER) {
                myAction = RockPaperScissors.ROCK;
            }
            else if (opponentAction === RockPaperScissors.SCISSORS) {
                myAction = RockPaperScissors.PAPER;
            }
            else {
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
            }
            else if (opponentAction === RockPaperScissors.PAPER) {
                myAction = RockPaperScissors.SCISSORS;
            }
            else if (opponentAction === RockPaperScissors.SCISSORS) {
                myAction = RockPaperScissors.ROCK;
            }
            else {
                throw new Error("Unknown opponent action");
            }
            break;
        default:
            return;
    }
    score += myActionScore(myAction);
    if (last) {
        console.log("Total score: ", score);
    }
});
//# sourceMappingURL=puzzle02.js.map