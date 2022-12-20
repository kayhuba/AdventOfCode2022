import assert from "assert";

console.log("Day 20, Puzzle 02!")

import linereader from "line-reader";

class Item {
    prev?: Item;
    next?: Item;
    value: number;

    constructor(value: number) {
        this.value = value;
    }
}

const printFromItem = () => {
    let zeroItem: Item = firstItem;
    while (zeroItem.value !== 0) {
        // @ts-ignore
        zeroItem = zeroItem.next;
    }

    const currentOrder: number[] = [];
    let currentItem = firstItem;
    do {
        currentOrder.push(currentItem.value);
        // @ts-ignore
        currentItem = currentItem.next;
    } while (currentItem !== firstItem);
    console.log(currentOrder.join(', '));
};

let firstItem: Item;
let lastItem: Item;
const originalNumberOrder: Item[] = [];
linereader.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const num = parseInt(line) * 811589153;
        const item = new Item(num);
        originalNumberOrder.push(item);
        if (firstItem === undefined) {
            firstItem = item;
            lastItem = item;
        } else {
            lastItem.next = item;
            firstItem.prev = item;
            item.prev = lastItem;
            item.next = firstItem;
            lastItem = item;
        }
    }

    const removeItem = (item: Item) => {
        const prev = item.prev;
        const next = item.next;
        assert(prev);
        assert(next);
        item.next = undefined;
        item.prev = undefined;
        prev.next = next;
        next.prev = prev;
    };

    const insertItemAfter = (item: Item, after: Item) => {
        const prev = after;
        const next = after.next;
        assert(prev);
        assert(next);
        item.next = next;
        item.prev = prev;
        next.prev = item;
        prev.next = item;
    };

    if (last) {
        for (let j=0; j < 10; j++) {
            // printFromItem();

            const numberCount: number = originalNumberOrder.length;
            originalNumberOrder.forEach((item, index) => {
                if (item.value === 0) {
                    return;
                }

                assert(item.prev);
                let insertAfterItem: Item = item.prev;
                removeItem(item);

                if (Math.sign(item.value) > 0) {
                    for (let i=0; i < Math.abs(item.value) % (numberCount - 1); i++) {
                        assert(insertAfterItem.next);
                        insertAfterItem = insertAfterItem.next;
                    }
                } else {
                    for (let i=0; i < Math.abs(item.value) % (numberCount - 1); i++) {
                        assert(insertAfterItem.prev);
                        insertAfterItem = insertAfterItem.prev;
                    }
                }
                insertItemAfter(item, insertAfterItem);
            });
        }

        // printFromItem();

        let relevantNumberSum: number = 0;
        let zeroItem: Item = firstItem;
        while (zeroItem.value !== 0) {
            // @ts-ignore
            zeroItem = zeroItem.next;
        }

        for (let i=0; i <= 3000; i++) {
            if (i === 1000 || i === 2000 || i === 3000) {
                relevantNumberSum += zeroItem.value;
                console.log(`${i}th number is ${zeroItem.value}`);
            }
            assert(zeroItem.next);
            zeroItem = zeroItem.next;
        }

        console.log("The sum of the three numbers that form the grove coordinates is: ", relevantNumberSum);
    }
});
