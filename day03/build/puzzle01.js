"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 01, Puzzle 02!");
var line_reader_1 = __importDefault(require("line-reader"));
var sum = 0;
line_reader_1.default.eachLine("./input/input.txt", function (line, last) {
    var compartmentOne = line.substring(0, line.length / 2).split('');
    var compartmentTwo = line.substring(line.length / 2).split('');
    var match = "";
    compartmentOne.forEach(function (item) { return compartmentTwo.forEach(function (item2) {
        if (item === item2) {
            match = item;
        }
    }); });
    var priority = 0;
    if (match.charAt(0) >= 'A' && match.charAt(0) <= 'Z') {
        priority = (match.charCodeAt(0) - 'A'.charCodeAt(0) + 27);
    }
    else {
        priority = (match.charCodeAt(0) - 'a'.charCodeAt(0) + 1);
    }
    sum += priority;
    if (last) {
        console.log("Sum of priorities: ", sum);
    }
});
//# sourceMappingURL=puzzle01.js.map