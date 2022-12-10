"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 10, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
let register = 1;
let cycle = 1;
const signalStrengths = [];
const checkCycleAndMaybeRememberRegister = () => {
    if (cycle === 20 || (cycle > 20 && cycle <= 220 && (cycle - 20) % 40 === 0)) {
        signalStrengths.push(register * cycle);
    }
};
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    const operationRaw = line.split(' ');
    const operation = operationRaw[0];
    if (operation === "noop") {
        cycle++;
        checkCycleAndMaybeRememberRegister();
    }
    else if (operation === "addx") {
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
//# sourceMappingURL=puzzle01.js.map