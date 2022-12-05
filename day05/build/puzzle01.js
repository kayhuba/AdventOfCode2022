"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 05, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
var ReaderState;
(function (ReaderState) {
    ReaderState[ReaderState["READ_CRATE_STACKS"] = 0] = "READ_CRATE_STACKS";
    ReaderState[ReaderState["READ_MOVES"] = 1] = "READ_MOVES";
})(ReaderState || (ReaderState = {}));
class CrateStack {
    constructor() {
        this.stack = [];
    }
}
let readerState = ReaderState.READ_CRATE_STACKS;
let crateStackLevels = [];
let crateStacks = [];
const crateStackIndexMatcher = /\s+(\d)/g;
const crateStackLevelMatcher = /(?<empty>\s{3,4})|\[(?<letter>[A-Z])\](\s)?/g;
const moveMatcher = /^move (?<amount>\d+) from (?<from>\d+) to (?<to>\d+)$/;
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (line.length === 0) {
        // ignore the empty line between crane stack and move definitions
        return;
    }
    if (readerState === ReaderState.READ_CRATE_STACKS) {
        if (crateStackIndexMatcher.exec(line) !== null) {
            // we don't care so much about the real indexes - but we switch from crane level arrays to stacks
            crateStackLevels.forEach(level => {
                level.forEach((crateName, index) => {
                    if (crateName) {
                        let crateStack = crateStacks[index];
                        if (crateStack === undefined) {
                            crateStack = new CrateStack();
                            crateStacks.push(crateStack);
                        }
                        crateStack.stack.push(crateName);
                    }
                });
            });
            readerState = ReaderState.READ_MOVES;
            return;
        }
        let stackLevel = [];
        let match;
        while ((match = crateStackLevelMatcher.exec(line)) !== null) {
            if (match && match.groups) {
                if (match.groups['empty']) {
                    stackLevel.push('');
                }
                else if (match.groups['letter']) {
                    stackLevel.push(match.groups['letter']);
                }
            }
        }
        crateStackLevels.unshift(stackLevel);
    }
    if (readerState === ReaderState.READ_MOVES) {
        const moveMatch = line.match(moveMatcher);
        if (moveMatch && moveMatch.groups) {
            const amount = parseInt(moveMatch.groups['amount']);
            const from = parseInt(moveMatch.groups['from']) - 1;
            const to = parseInt(moveMatch.groups['to']) - 1;
            for (let i = 0; i < amount; i++) {
                // @ts-ignore
                crateStacks[to].stack.push(crateStacks[from].stack.pop());
            }
        }
    }
    if (last) {
        let cratesOnTop = '';
        crateStacks.forEach(stack => cratesOnTop += stack.stack[stack.stack.length - 1]);
        console.log("Crates on top: ", cratesOnTop);
    }
});
//# sourceMappingURL=puzzle01.js.map