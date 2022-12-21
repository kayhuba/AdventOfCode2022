"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
console.log("Day 21, Puzzle 02!");
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
    evaluateToString() {
        if (this.left.canEvaluate() && this.right.canEvaluate()) {
            return this.evaluate();
        }
        let left;
        left = this.left.evaluateToString();
        let right;
        right = this.right.evaluateToString();
        return "(" + left + "+" + right + ")";
    }
    canEvaluate() {
        return this.left.canEvaluate() && this.right.canEvaluate();
    }
    inverseClause(left) {
        let toInverse = this.right;
        let right = this.left;
        if (this.right.canEvaluate()) {
            toInverse = this.left;
            right = this.right;
        }
        return toInverse.inverseClause(new MinusClause("inv_" + this.variable, left, right));
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
    evaluateToString() {
        if (this.left.canEvaluate() && this.right.canEvaluate()) {
            return this.evaluate();
        }
        let left;
        left = this.left.evaluateToString();
        let right;
        right = this.right.evaluateToString();
        return "(" + left + "-" + right + ")";
    }
    canEvaluate() {
        return this.left.canEvaluate() && this.right.canEvaluate();
    }
    inverseClause(left) {
        if (this.left.canEvaluate()) {
            return this.right.inverseClause(new MultiplyClause("inv_" + this.variable + "_partTwo", new AssignmentClause("_", -1), new MinusClause("inv_" + this.variable + "_partOne", left, this.left)));
        }
        return this.left.inverseClause(new PlusClause("inv_" + this.variable, left, this.right));
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
    evaluateToString() {
        if (this.left.canEvaluate() && this.right.canEvaluate()) {
            return this.evaluate();
        }
        let left;
        left = this.left.evaluateToString();
        let right;
        right = this.right.evaluateToString();
        return "(" + left + "*" + right + ")";
    }
    canEvaluate() {
        return this.left.canEvaluate() && this.right.canEvaluate();
    }
    inverseClause(left) {
        let toInverse = this.right;
        let right = this.left;
        if (this.right.canEvaluate()) {
            toInverse = this.left;
            right = this.right;
        }
        return toInverse.inverseClause(new DivideClause("inv_" + this.variable, left, right));
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
    evaluateToString() {
        if (this.left.canEvaluate() && this.right.canEvaluate()) {
            return this.evaluate();
        }
        let left;
        left = this.left.evaluateToString();
        let right;
        right = this.right.evaluateToString();
        return "(" + left + "/" + right + ")";
    }
    canEvaluate() {
        return this.left.canEvaluate() && this.right.canEvaluate();
    }
    inverseClause(left) {
        if (this.left.canEvaluate()) {
            return this.right.inverseClause(new DivideClause("inv_" + this.variable + "_partTwo", new AssignmentClause("_", 1), new DivideClause("inv_" + this.variable + "_partOne", left, this.left)));
        }
        return this.left.inverseClause(new MultiplyClause("inv_" + this.variable, left, this.right));
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
    evaluateToString() {
        return this.evaluate();
    }
    canEvaluate() {
        return true;
    }
    inverseClause(left) {
        return new AssignmentClause("inv_" + this.variable, this.literal);
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
    evaluateToString() {
        if (this.canEvaluate()) {
            return this.evaluate();
        }
        if (this.clause === undefined) {
            return this.variable;
        }
        return this.clause.evaluateToString();
    }
    canEvaluate() {
        if (this.clause === undefined) {
            return false;
        }
        return this.clause.canEvaluate();
    }
    inverseClause(left) {
        if (this.clause === undefined) {
            // this is humn
            return left;
        }
        return this.clause.inverseClause(left);
    }
}
let rootLeft;
let rootRight;
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
            if (variable === "humn") {
                return;
            }
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
            if (variable === "root") {
                rootLeft = left;
                rootRight = right;
            }
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
        if (variable !== "root") {
            clauseMap.set(variable, clause);
            if (placeholderMap.has(variable)) {
                // @ts-ignore
                placeholderMap.get(variable).clause = clause;
            }
        }
    }
    if (last) {
        let resolution;
        if (rootLeft.canEvaluate()) {
            resolution = rootRight.inverseClause(rootLeft);
        }
        else {
            resolution = rootLeft.inverseClause(rootRight);
        }
        console.log(`Number I yell: ${resolution.evaluateToString()}`);
    }
});
//# sourceMappingURL=puzzle02.js.map