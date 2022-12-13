console.log("Day 13, Puzzle 02!")

import linereader from "line-reader";

const compareClauses = (leftClause: any, rightClause: any): number => {
    const result = compareClausesSub(leftClause, rightClause);
    if (result === null) {
        return 0;
    }

    return result;
};

const compareClausesSub = (leftClause: any, rightClause: any): number | null => {
    if (!Array.isArray(leftClause)) {
        leftClause = [leftClause];
    }

    if (!Array.isArray(rightClause)) {
        rightClause = [rightClause];
    }

    for (let i=0; i < leftClause.length; i++) {
        if (i >= rightClause.length) {
            return 1;
        }

        if (Array.isArray(leftClause[i]) || Array.isArray(rightClause[i])) {
            let result = compareClausesSub(leftClause[i], rightClause[i]);
            if (result !== null) {
                return result;
            }

            continue;
        }

        if (leftClause[i] < rightClause[i]) {
            return -1;
        } else if (leftClause[i] > rightClause[i]) {
            return 1;
        }
    }

    // at this point, when left clause was fully processed and no match was found, we ran out of items on left
    // which means according to the rules the order is correct
    if (rightClause.length > leftClause.length) {
        return -1;
    }

    return null;
};

const clauses: any[] = [];
linereader.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        clauses.push(JSON.parse(line));
    }

    if (last) {
        clauses.push(JSON.parse("[[2]]"));
        clauses.push(JSON.parse("[[6]]"));

        clauses.sort((a, b) => compareClauses(a, b));
        // clauses.forEach(clause => console.log(JSON.stringify(clause)));

        const firstDividerPacket = clauses.findIndex(value => JSON.stringify(value)  === "[[2]]") + 1;
        const secondDividerPacket = clauses.findIndex(value => JSON.stringify(value) === "[[6]]") + 1;
        console.log("Decoder key: ", firstDividerPacket * secondDividerPacket);
    }
});

