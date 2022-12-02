"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 01, Puzzle 01!");
var line_reader_1 = __importDefault(require("line-reader"));
var max = 0;
var current = 0;
line_reader_1.default.eachLine("./input/input.txt", function (line, last) {
    if (line.trim().length == 0) {
        max = Math.max(current, max);
        current = 0;
    }
    else {
        current += parseInt(line);
    }
    if (last) {
        console.log("Number of calories of the Elf carrying the most: ", max);
    }
});
//# sourceMappingURL=puzzle01.js.map