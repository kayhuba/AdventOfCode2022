console.log("Day 11, Puzzle 01!")

import linereader from "line-reader";

type worryLevelOperationFunction = (old: number) => number;
type worryLevelTestFunction = (worryLevel: number) => number;

class Monkey {
    monkeyIndex: number;
    items: number[];
    operation: worryLevelOperationFunction;
    test: worryLevelTestFunction;
    itemsInspected: number = 0;

    constructor(monkeyIndex: number,
                items: number[],
                operation: worryLevelOperationFunction,
                test: worryLevelTestFunction) {
        this.monkeyIndex = monkeyIndex;
        this.items = items;
        this.operation = operation;
        this.test = test;
    }
}

const experienceRound = () => {
    monkeys.forEach(monkey => {
        const items: number[] = [...monkey.items];
        monkey.items = [];
        items.forEach(item => {
            const newWorryLevel = Math.floor(monkey.operation(item) / 3);
            const monkeyThrowTo = monkey.test(newWorryLevel);
            monkeys[monkeyThrowTo].items.push(newWorryLevel);
        });
        monkey.itemsInspected += items.length;
    });
};

const monkeys: Monkey[] = [];
let currentMonkeyIndex: number;
let currentStartingItems: number[];
let currentOperation: worryLevelOperationFunction;
let currentTestDivisor: number;
let currentTestTrueThrowTo: number;
let currentTestFalseThrowTo: number;
let currentTest: worryLevelTestFunction;

linereader.eachLine("./input/input.txt", (line, last) => {
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
            } else if (operationRaw[0] === "+") {
                currentOperation = old => old + old;
            }
        } else {
            const operand = parseInt(operationRaw[1]);
            if (operationRaw[0] === "*") {
                currentOperation = old => old * operand;
            } else if (operationRaw[0] === "+") {
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
            } else {
                return testFalseThrowTo;
            }
        };
    }

    if (line.length === 0 || last) {
        monkeys.push(
            new Monkey(
                currentMonkeyIndex,
                [...currentStartingItems],
                currentOperation,
                currentTest
            ));
    }

    if (last) {
        for (let i=0; i < 20; i++) {
            experienceRound();
        }

        const itemInspections: number[] = [];
        monkeys.forEach(monkey => itemInspections.push(monkey.itemsInspected));
        itemInspections.sort((a, b) => b - a);
        console.log("Level of monkey business after 20 rounds: ", itemInspections[0] * itemInspections[1]);
    }
});

