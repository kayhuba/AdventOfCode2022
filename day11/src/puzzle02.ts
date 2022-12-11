console.log("Day 11, Puzzle 02!")

import linereader from "line-reader";

class Item {
    startValue: number;
    divisors: number[] = [];
    remainders: number[] = [];

    constructor(startValue: number) {
        this.startValue = startValue;
    }

    applyDivisors(divisors: number[]) {
        this.divisors = [...divisors];
        this.divisors.forEach(divisor => this.remainders.push(this.startValue % divisor));
    }
}

type worryLevelOperationFunction = (old: Item) => void;
type worryLevelTestFunction = (item: Item) => number;

class Monkey {
    monkeyIndex: number;
    items: Item[];
    operation: worryLevelOperationFunction;
    test: worryLevelTestFunction;
    itemsInspected: number = 0;

    constructor(monkeyIndex: number,
                items: Item[],
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
        const items: Item[] = [...monkey.items];
        monkey.items = [];
        items.forEach(item => {
            monkey.operation(item);
            const monkeyThrowTo = monkey.test(item);
            monkeys[monkeyThrowTo].items.push(item);
        });
        monkey.itemsInspected += items.length;
    });
};

const monkeys: Monkey[] = [];
const divisors: number[] = [];
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
                currentOperation = item => {
                    item.remainders.forEach(
                        (remainder, index, array) =>
                            array[index] = (remainder * remainder) % item.divisors[index]
                    );
                }
            }
        } else {
            const operand = parseInt(operationRaw[1]);
            if (operationRaw[0] === "*") {
                currentOperation = item => {
                    item.remainders.forEach(
                        (remainder, index, array) =>
                            array[index] = (remainder * operand) % item.divisors[index]
                    );
                };
            } else if (operationRaw[0] === "+") {
                currentOperation = item => {
                    item.remainders.forEach(
                        (remainder, index, array) =>
                            array[index] = (remainder + operand) % item.divisors[index]
                    );
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
            } else {
                return testFalseThrowTo;
            }
        };
        divisors.push(divisor);
    }

    if (line.length === 0 || last) {
        const startingItems: Item[] = [];
        currentStartingItems.forEach(item => startingItems.push(new Item(item)));

        monkeys.push(
            new Monkey(
                currentMonkeyIndex,
                startingItems,
                currentOperation,
                currentTest
            ));
    }

    if (last) {
        // first, apply all divisors for all items in all monkeys
        monkeys.forEach(monkey => monkey.items.forEach(item => item.applyDivisors(divisors)));

        // monkeys are ready - experience some round of watching
        for (let i=0; i < 10000; i++) {
            experienceRound();
        }

        const itemInspections: number[] = [];
        monkeys.forEach(monkey => itemInspections.push(monkey.itemsInspected));
        itemInspections.sort((a, b) => b - a);
        console.log("Level of monkey business after 10000 rounds: ", itemInspections[0] * itemInspections[1]);
    }
});

