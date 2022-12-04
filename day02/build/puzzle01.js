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
//# sourceMappingURL=puzzle01.js.map