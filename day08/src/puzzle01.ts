console.log("Day 08, Puzzle 01!")

import linereader from "line-reader";

const isVisible = (col: number, row: number): boolean => {
    // all trees on the outer edge are visible
    if (col === 0 || col === treeMaze[0].length - 1) {
        return true;
    }

    if (row === 0 || row === treeMaze.length - 1) {
        return true;
    }

    // we go from outside to the tree and look for a tree that has a bigger height than ours
    // as soon as we have one, we abort with "not visible"
    const ourTreeHeight = treeMaze[row][col];
    if (ourTreeHeight === 0) {
        return false;
    }

    // check the line
    let visible = true;
    for (let i=0; i < col; i++) {
        if (treeMaze[row][i] >= ourTreeHeight) {
            visible = false;
            break;
        }
    }

    if (visible) {
        return true;
    }

    visible = true;
    for (let i=treeMaze[row].length - 1; i > col; i--) {
        if (treeMaze[row][i] >= ourTreeHeight) {
            visible = false;
            break;
        }
    }

    if (visible) {
        return true;
    }

    // check the row
    visible = true;
    for (let i=0; i < row; i++) {
        if (treeMaze[i][col] >= ourTreeHeight) {
            visible = false;
            break;
        }
    }

    if (visible) {
        return true;
    }

    visible = true;
    for (let i=treeMaze.length - 1; i > row; i--) {
        if (treeMaze[i][col] >= ourTreeHeight) {
            visible = false;
            break;
        }
    }

    return visible;
};

const treeMaze: number[][] = [];
linereader.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const treeLine: number[] = [];
        line.split('').forEach(rawHeight => treeLine.push(parseInt(rawHeight)));
        treeMaze.push(treeLine);
    }

    if (last) {
        let visibleTrees = 0;
        for (let row=0; row < treeMaze.length; row++) {
            for (let col=0; col < treeMaze[0].length; col++) {
                if (isVisible(col, row)) {
                    visibleTrees++;
                }
            }
        }
        console.log("Visible trees: ", visibleTrees);
    }
});

