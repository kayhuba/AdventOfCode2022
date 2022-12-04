console.log("Day 03, Puzzle 02!")

import linereader from "line-reader";

let sum = 0;
linereader.eachLine("./input/input.txt", (line, last) => {
    const compartmentOne = line.substring(0, line.length / 2).split('');
    const compartmentTwo = line.substring(line.length / 2).split('');

    let match: string = "";
    compartmentOne.forEach(item => compartmentTwo.forEach(item2 => {
        if (item === item2) {
            match = item;
        }
    }));

    let priority = 0;
    if (match.charAt(0) >= 'A' && match.charAt(0) <= 'Z') {
        priority = (match.charCodeAt(0) - 'A'.charCodeAt(0) + 27);
    } else {
        priority = (match.charCodeAt(0) - 'a'.charCodeAt(0) + 1);
    }
    sum += priority;

    if (last) {
        console.log("Sum of priorities: ", sum);
    }
});

