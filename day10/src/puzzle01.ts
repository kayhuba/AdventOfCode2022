console.log("Day 10, Puzzle 01!")

import linereader from "line-reader";

let register = 1;
let cycle = 1;
const signalStrengths: number[] = [];

const checkCycleAndMaybeRememberRegister = () => {
    if (cycle === 20 || (cycle > 20 && cycle <= 220 && (cycle-20) % 40 === 0)) {
        signalStrengths.push(register * cycle);
    }
};

linereader.eachLine("./input/input.txt", (line, last) => {
    const operationRaw = line.split(' ');
    const operation: string = operationRaw[0];

    if (operation === "noop") {
        cycle++;
        checkCycleAndMaybeRememberRegister();
    } else if (operation === "addx") {
        cycle++;
        checkCycleAndMaybeRememberRegister();

        cycle++;
        register += parseInt(operationRaw[1]);
        checkCycleAndMaybeRememberRegister();
    }

    if (last) {
        const sum = signalStrengths.reduce((sum, current) => sum += current, 0);
        console.log("Sum of six signal strength: ", sum);
    }
});

