"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 03, Puzzle 02!");
var line_reader_1 = __importDefault(require("line-reader"));
var matchingElements = function (firstArray, secondArray, thirdArray) {
    var match = "";
    firstArray.forEach(function (item) {
        if (secondArray.includes(item) && thirdArray.includes(item)) {
            match = item;
        }
    });
    return match;
};
var sum = 0;
var elfGroup = [];
line_reader_1.default.eachLine("./input/input.txt", function (line, last) {
    elfGroup.push(line);
    if (elfGroup.length === 3) {
        var firstElfRucksack = elfGroup[0].split('');
        var secondElfRucksack = elfGroup[1].split('');
        var thirdElfRucksack = elfGroup[2].split('');
        var match = matchingElements(firstElfRucksack, secondElfRucksack, thirdElfRucksack);
        var priority = 0;
        if (match.charAt(0) >= 'A' && match.charAt(0) <= 'Z') {
            priority = (match.charCodeAt(0) - 'A'.charCodeAt(0) + 27);
        }
        else {
            priority = (match.charCodeAt(0) - 'a'.charCodeAt(0) + 1);
        }
        sum += priority;
        elfGroup = [];
    }
    if (last) {
        console.log("Sum of priorities of badges: ", sum);
    }
});
//# sourceMappingURL=puzzle02.js.map