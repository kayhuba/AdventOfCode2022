console.log("Day 02, Puzzle 02!")

import linereader from "line-reader";

const matchingElements = (firstArray: string[], secondArray: string[], thirdArray: string[]): string  => {
    let match: string = "";
    firstArray.forEach(item =>  {
        if (secondArray.includes(item) && thirdArray.includes(item)) {
            match = item;
        }
    });

    return match;
}

let sum = 0;
let elfGroup: string[] = [];
linereader.eachLine("./input/input.txt", (line, last) => {
    elfGroup.push(line);
    if (elfGroup.length === 3) {
        const firstElfRucksack = elfGroup[0].split('');
        const secondElfRucksack = elfGroup[1].split('');
        const thirdElfRucksack = elfGroup[2].split('');

        const match: string = matchingElements(firstElfRucksack, secondElfRucksack, thirdElfRucksack);

        let priority = 0;
        if (match.charAt(0) >= 'A' && match.charAt(0) <= 'Z') {
            priority = (match.charCodeAt(0) - 'A'.charCodeAt(0) + 27);
        } else {
            priority = (match.charCodeAt(0) - 'a'.charCodeAt(0) + 1);
        }
        sum += priority;

        elfGroup = [];
    }

    if (last) {
        console.log("Sum of priorities of badges: ", sum);
    }
});

