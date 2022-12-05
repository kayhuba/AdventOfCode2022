import {create} from "domain";

console.log("Day 05, Puzzle 02!")

import linereader from "line-reader";

enum ReaderState {
    READ_CRATE_STACKS,
    READ_MOVES
}

class CrateStack {
    stack: string[] = [];
}

let readerState: ReaderState = ReaderState.READ_CRATE_STACKS;
let crateStackLevels: string[][] = [];
let crateStacks: CrateStack[] = [];
const crateStackIndexMatcher = /\s+(\d)/g;
const crateStackLevelMatcher = /(?<empty>\s{3,4})|\[(?<letter>[A-Z])\](\s)?/g;
const moveMatcher = /^move (?<amount>\d+) from (?<from>\d+) to (?<to>\d+)$/;
linereader.eachLine("./input/input.txt", (line, last) => {
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
                        let crateStack: CrateStack = crateStacks[index];
                        if (crateStack === undefined) {
                            crateStack = new CrateStack();
                            crateStacks.push(crateStack)
                        }

                        crateStack.stack.push(crateName);
                    }
                });
            });
            readerState = ReaderState.READ_MOVES;
            return;
        }

        let stackLevel: string[] = [];
        let match;
        while ((match = crateStackLevelMatcher.exec(line)) !== null) {
            if (match && match.groups) {
                if (match.groups['empty']) {
                    stackLevel.push('');
                } else if (match.groups['letter']) {
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

            const combinedCrates = crateStacks[from].stack.splice(crateStacks[from].stack.length - amount);
            crateStacks[to].stack = crateStacks[to].stack.concat(combinedCrates);
        }
    }

    if (last) {
        let cratesOnTop = '';
        crateStacks.forEach(stack => cratesOnTop += stack.stack[stack.stack.length - 1]);
        console.log("Crates on top: ", cratesOnTop);
    }
});

