"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 04, Puzzle 02!");
var line_reader_1 = __importDefault(require("line-reader"));
var assignmentOverlaps = 0;
line_reader_1.default.eachLine("./input/input.txt", function (line, last) {
    var elfPairAssignments = line.split(',');
    var firstElfAssignment = elfPairAssignments[0].split('-');
    var secondElfAssignment = elfPairAssignments[1].split('-');
    var firstElfAssignmentLow = parseInt(firstElfAssignment[0]);
    var firstElfAssignmentHigh = parseInt(firstElfAssignment[1]);
    var secondElfAssignmentLow = parseInt(secondElfAssignment[0]);
    var secondElfAssignmentHigh = parseInt(secondElfAssignment[1]);
    if (secondElfAssignmentLow >= firstElfAssignmentLow && secondElfAssignmentLow <= firstElfAssignmentHigh) {
        assignmentOverlaps++;
    }
    else if (secondElfAssignmentHigh >= firstElfAssignmentLow && secondElfAssignmentHigh <= firstElfAssignmentHigh) {
        assignmentOverlaps++;
    }
    else if (firstElfAssignmentLow >= secondElfAssignmentLow && firstElfAssignmentLow <= secondElfAssignmentHigh) {
        assignmentOverlaps++;
    }
    else if (firstElfAssignmentHigh >= secondElfAssignmentLow && firstElfAssignmentHigh <= secondElfAssignmentHigh) {
        assignmentOverlaps++;
    }
    if (last) {
        console.log("Number of fully overlapping assignments: ", assignmentOverlaps);
    }
});
//# sourceMappingURL=puzzle02.js.map