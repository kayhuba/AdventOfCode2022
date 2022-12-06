console.log("Day 06, Puzzle 01!")

import linereader from "line-reader";

// cheap - but OK for puzzle 1
let containsDuplicates = (buffer: string[]): boolean => {
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

let buffer: string[];
let lineIndex = 4;
linereader.eachLine("./input/input.txt", (line, last) => {
    if (buffer === undefined) {
        buffer = line.substring(0,4).split('');
    }

    while(containsDuplicates(buffer)) {
        buffer.push(line.charAt(lineIndex));
        buffer.splice(0,1);
        lineIndex++;
    }

    console.log("Found start-of-packet marker at: ", lineIndex);
});

