import assert from "assert";

console.log("Day 21, Puzzle 02!")

import linereader from "line-reader";

interface Clause {
    variable: string;
    evaluate: () => number;
    evaluateToString: () => number | string;
    canEvaluate: () => boolean;

    // return the inverse clause of the current clause where
    // the provided parameter left is operated on
    inverseClause: (left: Clause) => Clause;
}

class PlusClause implements Clause {
    variable: string;
    left: Clause;
    right: Clause;

    evaluate(): number {
        return this.left.evaluate() + this.right.evaluate();
    }

    evaluateToString(): number | string {
        if (this.left.canEvaluate() && this.right.canEvaluate()) {
            return this.evaluate();
        }

        let left: number | string;
        left = this.left.evaluateToString();

        let right: number | string;
        right = this.right.evaluateToString();

        return "(" + left + "+" + right + ")";
    }

    canEvaluate(): boolean {
        return this.left.canEvaluate() && this.right.canEvaluate();
    }

    inverseClause(left: Clause): Clause {
        let toInverse: Clause = this.right;
        let right: Clause = this.left;
        if (this.right.canEvaluate()) {
            toInverse = this.left;
            right = this.right;
        }
        return toInverse.inverseClause(new MinusClause("inv_" + this.variable, left, right));
    }

    constructor(variable: string, left: Clause, right: Clause) {
        this.variable = variable;
        this.left = left;
        this.right = right;
    }
}

class MinusClause implements Clause {
    variable: string;
    left: Clause;
    right: Clause;

    evaluate(): number {
        return this.left.evaluate() - this.right.evaluate();
    }

    evaluateToString(): number | string {
        if (this.left.canEvaluate() && this.right.canEvaluate()) {
            return this.evaluate();
        }

        let left: number | string;
        left = this.left.evaluateToString();

        let right: number | string;
        right = this.right.evaluateToString();

        return "(" + left + "-" + right + ")";
    }

    canEvaluate(): boolean {
        return this.left.canEvaluate() && this.right.canEvaluate();
    }

    inverseClause(left: Clause): Clause {
        if (this.left.canEvaluate()) {
            return this.right.inverseClause(
                new MultiplyClause("inv_" + this.variable + "_partTwo",
                    new AssignmentClause("_", -1),
                    new MinusClause("inv_" + this.variable + "_partOne", left, this.left)
                )
            );
        }

        return this.left.inverseClause(new PlusClause("inv_" + this.variable, left, this.right));
    }

    constructor(variable: string, left: Clause, right: Clause) {
        this.variable = variable;
        this.left = left;
        this.right = right;
    }
}

class MultiplyClause implements Clause {
    variable: string;
    left: Clause;
    right: Clause;

    evaluate(): number {
        return this.left.evaluate() * this.right.evaluate();
    }

    evaluateToString(): number | string {
        if (this.left.canEvaluate() && this.right.canEvaluate()) {
            return this.evaluate();
        }

        let left: number | string;
        left = this.left.evaluateToString();

        let right: number | string;
        right = this.right.evaluateToString();

        return "(" + left + "*" + right + ")";
    }

    canEvaluate(): boolean {
        return this.left.canEvaluate() && this.right.canEvaluate();
    }

    inverseClause(left: Clause): Clause {
        let toInverse: Clause = this.right;
        let right: Clause = this.left;
        if (this.right.canEvaluate()) {
            toInverse = this.left;
            right = this.right;
        }
        return toInverse.inverseClause(new DivideClause("inv_" + this.variable, left, right));
    }

    constructor(variable: string, left: Clause, right: Clause) {
        this.variable = variable;
        this.left = left;
        this.right = right;
    }
}

class DivideClause implements Clause {
    variable: string;
    left: Clause;
    right: Clause;

    evaluate(): number {
        return this.left.evaluate() / this.right.evaluate();
    }

    evaluateToString(): number | string {
        if (this.left.canEvaluate() && this.right.canEvaluate()) {
            return this.evaluate();
        }

        let left: number | string;
        left = this.left.evaluateToString();

        let right: number | string;
        right = this.right.evaluateToString();

        return "(" + left + "/" + right + ")";
    }

    canEvaluate(): boolean {
        return this.left.canEvaluate() && this.right.canEvaluate();
    }

    inverseClause(left: Clause): Clause {
        if (this.left.canEvaluate()) {
            return this.right.inverseClause(
                new DivideClause("inv_" + this.variable + "_partTwo",
                    new AssignmentClause("_", 1),
                    new DivideClause("inv_" + this.variable + "_partOne", left, this.left)
                )
            );
        }

        return this.left.inverseClause(new MultiplyClause("inv_" + this.variable, left, this.right));
    }

    constructor(variable: string, left: Clause, right: Clause) {
        this.variable = variable;
        this.left = left;
        this.right = right;
    }
}

class AssignmentClause implements Clause {
    variable: string;
    literal: number;

    evaluate(): number {
        return this.literal;
    }

    evaluateToString(): number | string {
        return this.evaluate();
    }

    canEvaluate(): boolean {
        return true;
    }

    inverseClause(left: Clause): Clause {
        return new AssignmentClause("inv_" + this.variable, this.literal);
    }

    constructor(variable: string, literal: number) {
        this.variable = variable;
        this.literal = literal;
    }
}

class Placeholder implements Clause {
    variable: string;
    clause?: Clause;

    evaluate(): number {
        assert(this.clause);
        return this.clause.evaluate();
    }

    evaluateToString(): number | string {
        if (this.canEvaluate()) {
            return this.evaluate();
        }

        if (this.clause === undefined) {
            return this.variable;
        }

        return this.clause.evaluateToString();
    }

    canEvaluate(): boolean {
        if (this.clause === undefined) {
            return false;
        }
        return this.clause.canEvaluate();
    }

    inverseClause(left: Clause): Clause {
        if (this.clause === undefined) {
            // this is humn
            return left;
        }

        return this.clause.inverseClause(left);
    }

    constructor(variable: string) {
        this.variable = variable;
    }
}

let rootLeft: Clause;
let rootRight: Clause;
const clauseMap: Map<string, Clause> = new Map();
const placeholderMap: Map<string, Placeholder> = new Map();
linereader.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const assignmentRaw = line.split(':');
        const variable: string = assignmentRaw[0];

        const regex = /\s(\d+)|(?:(\w+) ([+\-*\/]) (\w+))/;
        const match = regex.exec(assignmentRaw[1]);
        assert(match);

        let clause: Clause | undefined = undefined;
        if (match[1] !== undefined) {
            if (variable === "humn") {
                return;
            }

            clause = new AssignmentClause(variable, parseInt(match[1]));
        } else {
            const getClauseOrApplyPlaceholder = (variable: string): Clause => {
                let clause: Clause;
                if (clauseMap.has(variable)) {
                    // @ts-ignore
                    clause = clauseMap.get(variable);
                } else {
                    if (placeholderMap.has(variable)) {
                        // @ts-ignore
                        clause = placeholderMap.get(variable);
                    } else {
                        clause = new Placeholder(variable);
                        placeholderMap.set(variable, clause);
                    }
                }

                return clause;
            };

            const left: Clause = getClauseOrApplyPlaceholder(match[2]);
            const right: Clause = getClauseOrApplyPlaceholder(match[4]);

            if (variable === "root") {
                rootLeft = left;
                rootRight = right;
            }

            switch(match[3]) {
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

        assert(clause);
        if (variable !== "root") {
            clauseMap.set(variable, clause);
            if (placeholderMap.has(variable)) {
                // @ts-ignore
                placeholderMap.get(variable).clause = clause;
            }
        }
    }

    if (last) {
        let resolution: Clause;
        if (rootLeft.canEvaluate()) {
            resolution = rootRight.inverseClause(rootLeft);
        } else {
            resolution = rootLeft.inverseClause(rootRight);
        }

        console.log(`Number I yell: ${resolution.evaluateToString()}`);
    }
});
