"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 11, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
class Monkey {
    constructor(monkeyIndex, items, operation, test) {
        this.itemsInspected = 0;
        this.monkeyIndex = monkeyIndex;
        this.items = items;
        this.operation = operation;
        this.test = test;
    }
}
const experienceRound = () => {
    monkeys.forEach(monkey => {
        const items = [...monkey.items];
        monkey.items = [];
        items.forEach(item => {
            const newWorryLevel = Math.floor(monkey.operation(item) / 3);
            const monkeyThrowTo = monkey.test(newWorryLevel);
            monkeys[monkeyThrowTo].items.push(newWorryLevel);
        });
        monkey.itemsInspected += items.length;
    });
};
const monkeys = [];
let currentMonkeyIndex;
let currentStartingItems;
let currentOperation;
let currentTestDivisor;
let currentTestTrueThrowTo;
let currentTestFalseThrowTo;
let currentTest;
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (line.startsWith("Monkey")) {
        currentMonkeyIndex = parseInt(line.split(' ')[1]);
    }
    if (line.startsWith("  Starting items:")) {
        const itemsRaw = line.substring("  Starting items:".length).split(',');
        currentStartingItems = [];
        itemsRaw.forEach(item => currentStartingItems.push(parseInt(item)));
    }
    if (line.startsWith("  Operation: new = old ")) {
        const operationRaw = line.substring("  Operation: new = old ".length).split(' ');
        if (operationRaw[1] === "old") {
            if (operationRaw[0] === "*") {
                currentOperation = old => old * old;
            }
            else if (operationRaw[0] === "+") {
                currentOperation = old => old + old;
            }
        }
        else {
            const operand = parseInt(operationRaw[1]);
            if (operationRaw[0] === "*") {
                currentOperation = old => old * operand;
            }
            else if (operationRaw[0] === "+") {
                currentOperation = old => old + operand;
            }
        }
    }
    if (line.startsWith("  Test: divisible by ")) {
        currentTestDivisor = parseInt(line.substring("  Test: divisible by ".length));
    }
    if (line.startsWith("    If true: throw to monkey")) {
        currentTestTrueThrowTo = parseInt(line.substring("    If true: throw to monkey".length));
    }
    if (line.startsWith("    If false: throw to monkey")) {
        currentTestFalseThrowTo = parseInt(line.substring("    If false: throw to monkey".length));
        const divisor = currentTestDivisor;
        const testTrueThrowTo = currentTestTrueThrowTo;
        const testFalseThrowTo = currentTestFalseThrowTo;
        currentTest = worryLevel => {
            if (worryLevel % divisor === 0) {
                return testTrueThrowTo;
            }
            else {
                return testFalseThrowTo;
            }
        };
    }
    if (line.length === 0 || last) {
        monkeys.push(new Monkey(currentMonkeyIndex, [...currentStartingItems], currentOperation, currentTest));
    }
    if (last) {
        for (let i = 0; i < 20; i++) {
            experienceRound();
        }
        const itemInspections = [];
        monkeys.forEach(monkey => itemInspections.push(monkey.itemsInspected));
        itemInspections.sort((a, b) => b - a);
        console.log("Level of monkey business after 20 rounds: ", itemInspections[0] * itemInspections[1]);
    }
});
//# sourceMappingURL=puzzle01.js.map