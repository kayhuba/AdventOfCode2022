"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 01, Puzzle 02!");
var line_reader_1 = __importDefault(require("line-reader"));
var top1 = 0;
var top2 = 0;
var top3 = 0;
var current = 0;
line_reader_1.default.eachLine("./input/input.txt", function (line, last) {
    if (line.trim().length > 0) {
        current += parseInt(line);
    }
    if (line.trim().length == 0 || last) {
        if (current > top1) {
            top3 = top2;
            top2 = top1;
            top1 = current;
        }
        else if (current > top2) {
            top3 = top2;
            top2 = current;
        }
        else if (current > top3) {
            top3 = current;
        }
        current = 0;
    }
    if (last) {
        console.log("Number of calories of the top three Elves: ", top1 + top2 + top3);
    }
});
//# sourceMappingURL=puzzle02.js.map