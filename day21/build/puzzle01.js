"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
console.log("Day 21, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
class PlusClause {
    constructor(variable, left, right) {
        this.variable = variable;
        this.left = left;
        this.right = right;
    }
    evaluate() {
        return this.left.evaluate() + this.right.evaluate();
    }
}
class MinusClause {
    constructor(variable, left, right) {
        this.variable = variable;
        this.left = left;
        this.right = right;
    }
    evaluate() {
        return this.left.evaluate() - this.right.evaluate();
    }
}
class MultiplyClause {
    constructor(variable, left, right) {
        this.variable = variable;
        this.left = left;
        this.right = right;
    }
    evaluate() {
        return this.left.evaluate() * this.right.evaluate();
    }
}
class DivideClause {
    constructor(variable, left, right) {
        this.variable = variable;
        this.left = left;
        this.right = right;
    }
    evaluate() {
        return this.left.evaluate() / this.right.evaluate();
    }
}
class AssignmentClause {
    constructor(variable, literal) {
        this.variable = variable;
        this.literal = literal;
    }
    evaluate() {
        return this.literal;
    }
}
class Placeholder {
    constructor(variable) {
        this.variable = variable;
    }
    evaluate() {
        (0, assert_1.default)(this.clause);
        return this.clause.evaluate();
    }
}
let root;
const clauseMap = new Map();
const placeholderMap = new Map();
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const assignmentRaw = line.split(':');
        const variable = assignmentRaw[0];
        const regex = /\s(\d+)|(?:(\w+) ([+\-*\/]) (\w+))/;
        const match = regex.exec(assignmentRaw[1]);
        (0, assert_1.default)(match);
        let clause = undefined;
        if (match[1] !== undefined) {
            clause = new AssignmentClause(variable, parseInt(match[1]));
        }
        else {
            const getClauseOrApplyPlaceholder = (variable) => {
                let clause;
                if (clauseMap.has(variable)) {
                    // @ts-ignore
                    clause = clauseMap.get(variable);
                }
                else {
                    if (placeholderMap.has(variable)) {
                        // @ts-ignore
                        clause = placeholderMap.get(variable);
                    }
                    else {
                        clause = new Placeholder(variable);
                        placeholderMap.set(variable, clause);
                    }
                }
                return clause;
            };
            const left = getClauseOrApplyPlaceholder(match[2]);
            const right = getClauseOrApplyPlaceholder(match[4]);
            switch (match[3]) {
                case '+':
                    clause = new PlusClause(variable, left, right);
                    break;
                case '-':
                    clause = new MinusClause(variable, left, right);
                    break;
                case '*':
                    clause = new MultiplyClause(variable, left, right);
                    break;
                case '/':
                    clause = new DivideClause(variable, left, right);
                    break;
            }
        }
        (0, assert_1.default)(clause);
        if (variable === "root") {
            root = clause;
        }
        else {
            clauseMap.set(variable, clause);
            if (placeholderMap.has(variable)) {
                // @ts-ignore
                placeholderMap.get(variable).clause = clause;
            }
        }
    }
    if (last) {
        const result = root.evaluate();
        console.log("The monkey root will yell: ", result);
    }
});
//# sourceMappingURL=puzzle01.js.map