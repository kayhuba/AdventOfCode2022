"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
console.log("Day 20, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
class Item {
    constructor(value) {
        this.value = value;
    }
}
const printCurrent = (when, processedItem) => {
    const currentOrder = [];
    let currentItem = firstItem;
    do {
        currentOrder.push(currentItem.value);
        // @ts-ignore
        currentItem = currentItem.next;
    } while (currentItem !== firstItem);
    console.log(`${when} processing number ${processedItem.value}: ${currentOrder}`);
};
const printFromItem = (firstItem) => {
    const currentOrder = [];
    let currentItem = firstItem;
    do {
        currentOrder.push(currentItem.value);
        // @ts-ignore
        currentItem = currentItem.next;
    } while (currentItem !== firstItem);
    console.log(currentOrder.join(', '));
};
let firstItem;
let lastItem;
const originalNumberOrder = [];
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const num = parseInt(line);
        const item = new Item(num);
        originalNumberOrder.push(item);
        if (firstItem === undefined) {
            firstItem = item;
            lastItem = item;
        }
        else {
            lastItem.next = item;
            firstItem.prev = item;
            item.prev = lastItem;
            item.next = firstItem;
            lastItem = item;
        }
    }
    const removeItem = (item) => {
        const prev = item.prev;
        const next = item.next;
        (0, assert_1.default)(prev);
        (0, assert_1.default)(next);
        item.next = undefined;
        item.prev = undefined;
        prev.next = next;
        next.prev = prev;
    };
    const insertItemAfter = (item, after) => {
        const prev = after;
        const next = after.next;
        (0, assert_1.default)(prev);
        (0, assert_1.default)(next);
        item.next = next;
        item.prev = prev;
        next.prev = item;
        prev.next = item;
    };
    if (last) {
        const numberCount = originalNumberOrder.length;
        originalNumberOrder.forEach((item, index) => {
            // printCurrent("Before", item);
            if (item.value === 0) {
                return;
            }
            (0, assert_1.default)(item.prev);
            let insertAfterItem = item.prev;
            removeItem(item);
            if (Math.sign(item.value) > 0) {
                for (let i = 0; i < Math.abs(item.value) % (numberCount - 1); i++) {
                    (0, assert_1.default)(insertAfterItem.next);
                    insertAfterItem = insertAfterItem.next;
                }
            }
            else {
                for (let i = 0; i < Math.abs(item.value) % (numberCount - 1); i++) {
                    (0, assert_1.default)(insertAfterItem.prev);
                    insertAfterItem = insertAfterItem.prev;
                }
            }
            insertItemAfter(item, insertAfterItem);
            // printCurrent("After", item);
        });
        let relevantNumberSum = 0;
        let zeroItem = firstItem;
        while (zeroItem.value !== 0) {
            // @ts-ignore
            zeroItem = zeroItem.next;
        }
        // printFromItem(zeroItem);
        for (let i = 0; i <= 3000; i++) {
            if (i === 1000 || i === 2000 || i === 3000) {
                relevantNumberSum += zeroItem.value;
                console.log(`${i}th number is ${zeroItem.value}`);
            }
            (0, assert_1.default)(zeroItem.next);
            zeroItem = zeroItem.next;
        }
        console.log("The sum of the three numbers that form the grove coordinates is: ", relevantNumberSum);
    }
});
//# sourceMappingURL=puzzle01.js.map