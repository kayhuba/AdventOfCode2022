"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 10, Puzzle 02!");
const line_reader_1 = __importDefault(require("line-reader"));
const CRT = [];
let register = 1;
let cycle = 1;
const crtDraws = () => {
    const crtX = CRT.length % 40;
    if (crtX === register - 1 || crtX === register || crtX === register + 1) {
        CRT.push('#');
    }
    else {
        CRT.push('.');
    }
};
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    const operationRaw = line.split(' ');
    const operation = operationRaw[0];
    if (operation === "noop") {
        crtDraws();
        cycle++;
    }
    else if (operation === "addx") {
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
                line.push(CRT[y * 40 + x]);
            }
            console.log(line.join(''));
        }
    }
});
//# sourceMappingURL=puzzle02.js.map