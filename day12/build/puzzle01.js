"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 12, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
class Node {
    constructor(position, targetPosition, previousNode) {
        this.pathCost = 0;
        this.position = position;
        this.estimatedDistanceToTarget = Math.abs(targetPosition.x - position.x) + Math.abs(targetPosition.y - position.y);
        this.previousNode = previousNode;
    }
}
const findPath = () => {
    const examineNode = (node) => {
        const successorNodes = [];
        const checkAndAddNode = (node, dx, dy) => {
            const heightDifference = heightMap[node.position.y][node.position.x] - heightMap[node.position.y + dy][node.position.x + dx];
            // we walk _backwards_ means: we can walk down only one height, but up as many as we want
            if (heightDifference <= 1) {
                successorNodes.push(new Node({
                    x: node.position.x + dx,
                    y: node.position.y + dy
                }, startPosition, node));
            }
        };
        // up
        if (node.position.y > 0) {
            checkAndAddNode(node, 0, -1);
        }
        // down
        if (node.position.y < (heightMap.length - 1)) {
            checkAndAddNode(node, 0, 1);
        }
        // left
        if (node.position.x > 0) {
            checkAndAddNode(node, -1, 0);
        }
        // right
        if (node.position.x < (heightMap[0].length - 1)) {
            checkAndAddNode(node, 1, 0);
        }
        successorNodes.forEach(successor => {
            if (closedList.has(`${successor.position.x},${successor.position.y}`)) {
                return;
            }
            const newPathCost = node.pathCost + 1;
            let successorInOpenList = openList.find(value => value.position.x === successor.position.x && value.position.y === successor.position.y);
            if (successorInOpenList && newPathCost >= successorInOpenList.pathCost) {
                return;
            }
            if (!successorInOpenList) {
                successorInOpenList = successor;
                openList.push(successorInOpenList);
            }
            successorInOpenList.previousNode = node;
            successorInOpenList.pathCost = newPathCost;
        });
    };
    const openList = [];
    const closedList = new Map();
    const startNode = new Node(bestSignalPosition, startPosition);
    openList.push(startNode);
    do {
        openList.sort((a, b) => (b.pathCost + b.estimatedDistanceToTarget) - (a.pathCost + a.estimatedDistanceToTarget));
        // @ts-ignore
        const node = openList.pop();
        if (node.position.x === startPosition.x && node.position.y === startPosition.y) {
            const path = [];
            let traceBackNode = node;
            do {
                path.push(traceBackNode.position);
                traceBackNode = traceBackNode.previousNode;
            } while (traceBackNode !== undefined);
            return path;
        }
        closedList.set(`${node.position.x},${node.position.y}`, node);
        examineNode(node);
    } while (openList.length > 0);
    return [];
};
const heightMap = [];
let startPosition;
let bestSignalPosition;
let currentRow = 0;
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    const lineHeights = [];
    const lineCharacters = line.split('');
    lineCharacters.forEach((char, index) => {
        if (char === 'S') {
            startPosition = { x: index, y: currentRow };
            lineHeights.push(0);
            return;
        }
        if (char === 'E') {
            bestSignalPosition = { x: index, y: currentRow };
            lineHeights.push(25);
            return;
        }
        lineHeights.push(char.charCodeAt(0) - 'a'.charCodeAt(0));
    });
    heightMap.push(lineHeights);
    currentRow++;
    if (last) {
        const path = findPath();
        console.log("Fewest steps required to get from current position to best signal position: ", path.length - 1);
    }
});
//# sourceMappingURL=puzzle01.js.map