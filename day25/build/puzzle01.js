"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
console.log("Day 25, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
const toDecimalValue = (snafuValue) => {
    switch (snafuValue) {
        case "2":
        case "1":
        case "0":
            return parseInt(snafuValue);
        case "-":
            return -1;
        case "=":
            return -2;
    }
    (0, assert_1.default)(false);
};
/**
 * this function only supports adding numbers smaller than five
 */
const snafuAdd = (snafuValues, value, additionPosition) => {
    (0, assert_1.default)(value < 5);
    if (additionPosition < 0) {
        if (value === 0) {
            return snafuValues;
        }
        (0, assert_1.default)(value > 0);
        if (value === 4) {
            return snafuValues.splice(0, 0, 1, -1);
        }
        if (value === 3) {
            return snafuValues.splice(0, 0, 1, -2);
        }
        return snafuValues.splice(0, 0, value);
    }
    if (additionPosition === snafuValues.length) {
        snafuValues.push(0);
    }
    (0, assert_1.default)(additionPosition < snafuValues.length);
    let sum = snafuValues[additionPosition] + value;
    if (sum > 2) {
        snafuValues[additionPosition] = sum - 5;
        return snafuAdd(snafuValues, 1, additionPosition - 1);
    }
    snafuValues[additionPosition] = sum;
    return snafuValues;
};
const toSnafuValues = (decimalValue) => {
    const snafuNumbers = [];
    const snafuDigits = Math.floor(Math.log10(decimalValue) / Math.log10(5)) + 1;
    for (let digit = snafuDigits; digit > 0; digit--) {
        let nextMostSignificantValue = Math.floor(decimalValue / Math.pow(5, digit - 1));
        decimalValue -= nextMostSignificantValue * Math.pow(5, digit - 1);
        snafuAdd(snafuNumbers, nextMostSignificantValue, snafuNumbers.length);
    }
    return snafuNumbers;
};
const toSnafuString = (decimalValue) => {
    const snafuValues = toSnafuValues(decimalValue);
    let result = "";
    snafuValues.forEach(value => {
        if (value >= 0) {
            result += value;
            return;
        }
        if (value === -1) {
            result += "-";
            return;
        }
        if (value === -2) {
            result += "=";
            return;
        }
        (0, assert_1.default)(false);
    });
    return result;
};
const snafusInDecimal = [];
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const snafuInDecimal = line.split('')
            .reverse()
            .map((place, index) => toDecimalValue(place) * Math.pow(5, index))
            .reverse()
            .reduce((combined, value) => combined += value, 0);
        snafusInDecimal.push(snafuInDecimal);
    }
    if (last) {
        // diagnostics
        // snafusInDecimal.forEach(decimal => console.log(`snafu: ${toSnafuString(decimal)}, decimal: ${decimal}`));
        const sum = snafusInDecimal.reduce((combined, current) => combined += current, 0);
        const snafuString = toSnafuString(sum);
        console.log("SNAFU number to supply to Bob's console: ", snafuString);
    }
});
//# sourceMappingURL=puzzle01.js.map