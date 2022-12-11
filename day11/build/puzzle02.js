"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 11, Puzzle 02!");
const line_reader_1 = __importDefault(require("line-reader"));
class Item {
    constructor(startValue) {
        this.divisors = [];
        this.remainders = [];
        this.startValue = startValue;
    }
    applyDivisors(divisors) {
        this.divisors = [...divisors];
        this.divisors.forEach(divisor => this.remainders.push(this.startValue % divisor));
    }
}
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
            monkey.operation(item);
            const monkeyThrowTo = monkey.test(item);
            monkeys[monkeyThrowTo].items.push(item);
        });
        monkey.itemsInspected += items.length;
    });
};
const monkeys = [];
const divisors = [];
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
                currentOperation = item => {
                    item.remainders.forEach((remainder, index, array) => array[index] = (remainder * remainder) % item.divisors[index]);
                };
            }
        }
        else {
            const operand = parseInt(operationRaw[1]);
            if (operationRaw[0] === "*") {
                currentOperation = item => {
                    item.remainders.forEach((remainder, index, array) => array[index] = (remainder * operand) % item.divisors[index]);
                };
            }
            else if (operationRaw[0] === "+") {
                currentOperation = item => {
                    item.remainders.forEach((remainder, index, array) => array[index] = (remainder + operand) % item.divisors[index]);
                };
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
        currentTest = item => {
            const index = item.divisors.indexOf(divisor);
            if (item.remainders[index] === 0) {
                return testTrueThrowTo;
            }
            else {
                return testFalseThrowTo;
            }
        };
        divisors.push(divisor);
    }
    if (line.length === 0 || last) {
        const startingItems = [];
        currentStartingItems.forEach(item => startingItems.push(new Item(item)));
        monkeys.push(new Monkey(currentMonkeyIndex, startingItems, currentOperation, currentTest));
    }
    if (last) {
        // first, apply all divisors for all items in all monkeys
        monkeys.forEach(monkey => monkey.items.forEach(item => item.applyDivisors(divisors)));
        // monkeys are ready - experience some round of watching
        for (let i = 0; i < 10000; i++) {
            experienceRound();
        }
        const itemInspections = [];
        monkeys.forEach(monkey => itemInspections.push(monkey.itemsInspected));
        itemInspections.sort((a, b) => b - a);
        console.log("Level of monkey business after 10000 rounds: ", itemInspections[0] * itemInspections[1]);
    }
});
//# sourceMappingURL=puzzle02.js.map