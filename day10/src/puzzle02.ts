console.log("Day 10, Puzzle 02!")

import linereader from "line-reader";

const CRT: string[] = [];

let register = 1;
let cycle = 1;

const crtDraws = () => {
    const crtX = CRT.length % 40;

    if (crtX === register - 1 || crtX === register || crtX === register + 1) {
        CRT.push('#');
    } else {
        CRT.push('.');
    }
};

linereader.eachLine("./input/input.txt", (line, last) => {
    const operationRaw = line.split(' ');
    const operation: string = operationRaw[0];

    if (operation === "noop") {
        crtDraws();
        cycle++;
    } else if (operation === "addx") {
        crtDraws();
        cycle++;

        crtDraws();
        cycle++;
        register += parseInt(operationRaw[1]);
    }

    if (last) {
        for (let y = 0; y < 6; y++) {
            const line = [];
            for (let x = 0; x < 40; x++) {
                line.push(CRT[y*40+x]);
            }
            console.log(line.join(''));
        }
    }
});

