console.log("Day 04, Puzzle 01!")

import linereader from "line-reader";

let assignmentOverlaps = 0;
linereader.eachLine("./input/input.txt", (line, last) => {
    const elfPairAssignments = line.split(',');
    const firstElfAssignment = elfPairAssignments[0].split('-');
    const secondElfAssignment = elfPairAssignments[1].split('-');

    const firstElfAssignmentLow = parseInt(firstElfAssignment[0]);
    const firstElfAssignmentHigh = parseInt(firstElfAssignment[1]);

    const secondElfAssignmentLow = parseInt(secondElfAssignment[0]);
    const secondElfAssignmentHigh = parseInt(secondElfAssignment[1]);

    if (secondElfAssignmentLow >= firstElfAssignmentLow && secondElfAssignmentHigh <= firstElfAssignmentHigh) {
        assignmentOverlaps++;
    } else if (firstElfAssignmentLow >= secondElfAssignmentLow && firstElfAssignmentHigh <= secondElfAssignmentHigh) {
        assignmentOverlaps++;
    }

    if (last) {
        console.log("Number of fully overlapping assignments: ", assignmentOverlaps);
    }

});

