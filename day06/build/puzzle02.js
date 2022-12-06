"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 06, Puzzle 02!");
const line_reader_1 = __importDefault(require("line-reader"));
let containsDuplicates = (buffer) => {
    for (let j = 0; j < buffer.length - 1; j++) {
        for (let i = j + 1; i < buffer.length; i++) {
            if (buffer[i] === buffer[j]) {
                return true;
            }
        }
    }
    return false;
};
let buffer;
let lineIndex = 14;
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (buffer === undefined) {
        buffer = line.substring(0, 14).split('');
    }
    while (containsDuplicates(buffer)) {
        buffer.push(line.charAt(lineIndex));
        buffer.splice(0, 1);
        lineIndex++;
    }
    console.log("Found start-of-packet marker at: ", lineIndex);
});
//# sourceMappingURL=puzzle02.js.map