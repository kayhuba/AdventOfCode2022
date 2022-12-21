import assert from "assert";

console.log("Day 21, Puzzle 01!")

import linereader from "line-reader";

interface Clause {
    variable: string;
    evaluate: () => number;
}

class PlusClause implements Clause {
    variable: string;
    left: Clause;
    right: Clause;

    evaluate(): number {
        return this.left.evaluate() + this.right.evaluate();
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

    constructor(variable: string) {
        this.variable = variable;
    }
}

let root: Clause;
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
        if (variable === "root") {
            root = clause;
        } else {
            clauseMap.set(variable, clause);
            if (placeholderMap.has(variable)) {
                // @ts-ignore
                placeholderMap.get(variable).clause = clause;
            }
        }
    }

    if (last) {
        const result: number = root.evaluate();
        console.log("The monkey root will yell: ", result);
    }
});
