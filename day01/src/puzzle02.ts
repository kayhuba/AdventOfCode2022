console.log("Day 01, Puzzle 02!")

import linereader from "line-reader";

let top1 = 0;
let top2 = 0;
let top3 = 0;
let current = 0;
linereader.eachLine("./input/input.txt", (line, last) => {
    if (line.trim().length > 0) {
        current += parseInt(line);
    }

    if (line.trim().length == 0 || last) {
        if (current > top1) {
            top3 = top2;
            top2 = top1;
            top1 = current
        } else if (current > top2) {
            top3 = top2;
            top2 = current;
        } else if (current > top3) {
            top3 = current;
        }

        current = 0;
    }

    if (last) {
        console.log("Number of calories of the top three Elves: ", top1 + top2 + top3);
    }
});

