"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 06, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
// cheap - but OK for puzzle 1
let containsDuplicates = (buffer) => {
    if (buffer[3] === buffer[0] || buffer[2] === buffer[0] || buffer[1] === buffer[0]) {
        return true;
    }
    if (buffer[3] === buffer[1] || buffer[2] === buffer[1]) {
        return true;
    }
    if (buffer[3] === buffer[2]) {
        return true;
    }
    return false;
};
let buffer;
let lineIndex = 4;
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (buffer === undefined) {
        buffer = line.substring(0, 4).split('');
    }
    while (containsDuplicates(buffer)) {
        buffer.push(line.charAt(lineIndex));
        buffer.splice(0, 1);
        lineIndex++;
    }
    console.log("Found start-of-packet marker at: ", lineIndex);
});
//# sourceMappingURL=puzzle01.js.map