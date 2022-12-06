console.log("Day 06, Puzzle 02!")

import linereader from "line-reader";

let containsDuplicates = (buffer: string[]): boolean => {
    for (let j=0; j < buffer.length - 1; j++) {
        for (let i=j + 1; i < buffer.length; i++) {
            if (buffer[i] === buffer[j]) {
                return true;
            }
        }
    }

    return false;
};

let buffer: string[];
let lineIndex = 14;
linereader.eachLine("./input/input.txt", (line, last) => {
    if (buffer === undefined) {
        buffer = line.substring(0,14).split('');
    }

    while(containsDuplicates(buffer)) {
        buffer.push(line.charAt(lineIndex));
        buffer.splice(0,1);
        lineIndex++;
    }

    console.log("Found start-of-packet marker at: ", lineIndex);
});

