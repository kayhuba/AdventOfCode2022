"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 13, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
const isRightOrder = (leftClause, rightClause) => {
    if (!Array.isArray(leftClause)) {
        leftClause = [leftClause];
    }
    if (!Array.isArray(rightClause)) {
        rightClause = [rightClause];
    }
    for (let i = 0; i < leftClause.length; i++) {
        if (i >= rightClause.length) {
            return false;
        }
        if (Array.isArray(leftClause[i]) || Array.isArray(rightClause[i])) {
            let result = isRightOrder(leftClause[i], rightClause[i]);
            if (result !== null) {
                return result;
            }
            continue;
        }
        if (leftClause[i] < rightClause[i]) {
            return true;
        }
        else if (leftClause[i] > rightClause[i]) {
            return false;
        }
    }
    // at this point, when left clause was fully processed and no match was found, we ran out of items on left
    // which means according to the rules the order is correct
    if (rightClause.length > leftClause.length) {
        return true;
    }
    return null;
};
let pairIndex = 1;
let clauseIndex = 0;
let leftClause;
let rightClause;
const pairsInRightOrder = [];
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        if (clauseIndex === 0) {
            leftClause = JSON.parse(line);
            clauseIndex++;
        }
        else if (clauseIndex === 1) {
            rightClause = JSON.parse(line);
            clauseIndex = 0;
            if (isRightOrder(leftClause, rightClause)) {
                pairsInRightOrder.push(pairIndex);
            }
            pairIndex++;
        }
    }
    if (last) {
        const sumOfRightPairedIndices = pairsInRightOrder.reduce((sum, current) => sum + current, 0);
        console.log("Sum of indices of packets in the right order", sumOfRightPairedIndices);
    }
});
//# sourceMappingURL=puzzle01.js.map