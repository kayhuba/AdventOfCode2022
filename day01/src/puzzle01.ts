console.log("Day 01, Puzzle 01!")

import linereader from "line-reader";

let max = 0;
let current = 0;
linereader.eachLine("./input/input.txt", (line, last) => {
    if (line.trim().length == 0) {
        max = Math.max(current, max);
        current = 0;
    } else {
        current += parseInt(line);
    }

    if (last) {
        console.log("Number of calories of the Elf carrying the most: ", max)
    }
});

