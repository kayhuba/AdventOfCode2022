"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 16, Puzzle 02!");
const line_reader_1 = __importDefault(require("line-reader"));
class NodeGain {
    constructor(name, stepsAway, flowRate) {
        this.name = name;
        this.stepsAway = stepsAway;
        this.flowRate = flowRate;
    }
}
class ValveNode {
    constructor(name, flowRate, parent) {
        this.otherNodesGain = [];
        this.name = name;
        this.flowRate = flowRate;
        this.parent = parent;
        this.children = [];
    }
}
const updateOrCreateValveNode = (name, flowRate) => {
    let node = knownValves.get(name);
    if (!node) {
        node = new ValveNode(name, flowRate);
        knownValves.set(name, node);
    }
    else if (flowRate !== undefined) {
        node.flowRate = flowRate;
    }
    return node;
};
const knownValves = new Map();
let root;
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const match = /Valve ([A-Z]{2}) has flow rate=(\d+); tunnel(?:s)? lead(?:s)? to valve(?:s)? ([A-Z]{2}(, [A-Z]{2})*)/.exec(line);
        if (match) {
            const name = match[1];
            const flowRate = parseInt(match[2]);
            const childrenValves = match[3].split(', ');
            const node = updateOrCreateValveNode(name, flowRate);
            childrenValves.forEach(childName => {
                const child = updateOrCreateValveNode(childName);
                child.parent = node;
                node.children.push(child);
            });
            if (name === "AA") {
                root = node;
            }
        }
    }
    if (last) {
        const evaluateOtherNodesGain = (valve) => {
            // BFS
            const discovered = [];
            const visited = new Set();
            let currentVisit = valve;
            const nodeDistances = new Map();
            let distance = 0;
            nodeDistances.set(currentVisit.name, distance);
            const otherNodes = [];
            do {
                // @ts-ignore
                distance = nodeDistances.get(currentVisit.name);
                visited.add(currentVisit.name);
                currentVisit.children
                    .filter(valve => !visited.has(valve.name))
                    .forEach(valve => {
                    discovered.push(valve);
                    // @ts-ignore
                    if (valve.flowRate > 0) {
                        // @ts-ignore
                        otherNodes.push(new NodeGain(valve.name, distance + 1, valve.flowRate));
                    }
                    nodeDistances.set(valve.name, distance + 1);
                });
                currentVisit = discovered.shift();
            } while (currentVisit !== undefined);
            const totalFlow = (steps, flowRate) => Math.max(0, (29 - steps)) * flowRate;
            otherNodes.sort((a, b) => {
                const totalFlowA = totalFlow(b.stepsAway, b.flowRate);
                const totalFlowB = totalFlow(a.stepsAway, a.flowRate);
                if (totalFlowA === totalFlowB) {
                    return b.stepsAway - a.stepsAway;
                }
                return totalFlowB - totalFlowA;
            });
            return otherNodes;
        };
        knownValves.forEach(valve => valve.otherNodesGain = evaluateOtherNodesGain(valve));
        const totalTimeAvailable = 26;
        const evaluateBestPath = (valve) => {
            const discovered = [];
            let visited;
            let currentPath;
            let currentVisit = {
                nodeGain: new NodeGain(valve.name, 0, 0),
                pathToThisElement: [],
                visited: new Set()
            };
            let goodPaths = [];
            do {
                currentPath = currentVisit.pathToThisElement;
                visited = currentVisit.visited;
                visited.add(currentVisit.nodeGain.name);
                const currentPathSteps = currentPath.reduce((total, current) => total += current.stepsAway + 1, 0);
                // @ts-ignore
                const candidates = knownValves.get(currentVisit.nodeGain.name).otherNodesGain
                    .filter(nodeGain => !visited.has(nodeGain.name))
                    .filter(nodeGain => currentPathSteps + nodeGain.stepsAway <= totalTimeAvailable);
                if (candidates.length === 0) {
                    // end of path
                    // evaluate path total pressure released
                    let totalPressureReleased = 0;
                    let currentStep = 0;
                    for (let i = 0; i < currentPath.length; i++) {
                        if (currentStep + currentPath[i].stepsAway > totalTimeAvailable) {
                            break;
                        }
                        currentStep += currentPath[i].stepsAway + 1;
                        totalPressureReleased += Math.max(0, (totalTimeAvailable - currentStep)) * currentPath[i].flowRate;
                    }
                    goodPaths.push({ path: [...currentPath], pressureRelease: totalPressureReleased });
                    currentPath = [];
                }
                candidates
                    .forEach(nodeGain => {
                    discovered.push({ nodeGain: nodeGain, pathToThisElement: [...currentPath, nodeGain], visited: new Set(visited) });
                });
                currentVisit = discovered.pop();
            } while (currentVisit !== undefined);
            goodPaths.sort((a, b) => b.pressureRelease - a.pressureRelease);
            const bestPath = goodPaths[0];
            const otherPath = goodPaths.filter(path => {
                for (let i = 0; i < bestPath.path.length; i++) {
                    const pathElement = bestPath.path[i];
                    for (let j = 0; j < path.path.length; j++) {
                        if (path.path[j] === pathElement) {
                            return false;
                        }
                    }
                }
                return true;
            });
            const secondBestPath = otherPath[0];
            return bestPath.pressureRelease + secondBestPath.pressureRelease;
        };
        const totalPressureRelease = evaluateBestPath(root);
        console.log("Most pressure released together with Elephant: ", totalPressureRelease);
    }
});
//# sourceMappingURL=puzzle02.js.map