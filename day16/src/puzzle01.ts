console.log("Day 16, Puzzle 01!")

import linereader from "line-reader";

class NodeGain {
    name: string;
    stepsAway: number;
    flowRate: number;

    constructor(name: string, stepsAway: number, flowRate: number) {
        this.name = name;
        this.stepsAway = stepsAway;
        this.flowRate = flowRate;
    }
}

class ValveNode {
    name: string;
    parent: ValveNode | undefined;
    children: ValveNode[];
    flowRate: number | undefined;
    otherNodesGain: NodeGain[] = [];

    constructor(name: string, flowRate?: number, parent?: ValveNode) {
        this.name = name;
        this.flowRate = flowRate;
        this.parent = parent;
        this.children = [];
    }
}

const updateOrCreateValveNode = (name: string, flowRate?: number): ValveNode => {
    let node: ValveNode | undefined = knownValves.get(name);
    if (!node) {
        node = new ValveNode(name, flowRate);
        knownValves.set(name, node);
    } else if (flowRate !== undefined) {
        node.flowRate = flowRate;
    }
    return node;
};

const knownValves: Map<string, ValveNode> = new Map();
let root: ValveNode;
linereader.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const match = /Valve ([A-Z]{2}) has flow rate=(\d+); tunnel(?:s)? lead(?:s)? to valve(?:s)? ([A-Z]{2}(, [A-Z]{2})*)/.exec(line);
        if (match) {
            const name = match[1];
            const flowRate = parseInt(match[2]);
            const childrenValves: string[] = match[3].split(', ');

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
        const evaluateOtherNodesGain = (valve: ValveNode): NodeGain[] => {
            // BFS
            const discovered: ValveNode[] = [];
            const visited: Set<string> = new Set();
            let currentVisit: ValveNode | undefined = valve;

            const nodeDistances: Map<string, number> = new Map();
            let distance: number = 0;
            nodeDistances.set(currentVisit.name, distance);
            const otherNodes: NodeGain[] = [];
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
            const totalFlow = (steps: number, flowRate: number): number => Math.max(0, (29 - steps)) * flowRate;
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

        interface DiscoveredPathElement {
            nodeGain: NodeGain;
            pathToThisElement: NodeGain[];
            visited: Set<string>;
        }

        const evaluateBestPath = (valve: ValveNode): number => {
            const discovered: DiscoveredPathElement[] = [];
            let visited: Set<string>;
            let currentPath: NodeGain[];
            let currentVisit: DiscoveredPathElement | undefined = {
                nodeGain: new NodeGain(valve.name, 0, 0),
                pathToThisElement: [],
                visited: new Set()
            };
            let bestPath: NodeGain[] = [];
            let bestPathPressureRelease: number = 0;
            do {
                currentPath = currentVisit.pathToThisElement;
                visited = currentVisit.visited;
                visited.add(currentVisit.nodeGain.name);

                const currentPathSteps = currentPath.reduce((total, current) => total += current.stepsAway + 1, 0);
                // @ts-ignore
                const candidates = knownValves.get(currentVisit.nodeGain.name).otherNodesGain
                    .filter(nodeGain => !visited.has(nodeGain.name))
                    .filter(nodeGain => currentPathSteps + nodeGain.stepsAway <= 30);

                if (candidates.length === 0) {
                    // end of path
                    // evaluate path total pressure released
                    let totalPressureReleased = 0;
                    let currentStep = 0;
                    for (let i=0; i < currentPath.length; i++) {
                        if (currentStep + currentPath[i].stepsAway > 30) {
                            break;
                        }

                        currentStep += currentPath[i].stepsAway + 1;
                        totalPressureReleased += Math.max(0, (30 - currentStep)) * currentPath[i].flowRate;
                    }
                    if (totalPressureReleased > bestPathPressureRelease) {
                        bestPath = [...currentPath];
                        bestPathPressureRelease = totalPressureReleased;
                    }
                    currentPath = [];
                }
                candidates
                    .forEach(nodeGain => {
                        discovered.push({nodeGain: nodeGain, pathToThisElement: [...currentPath, nodeGain], visited: new Set(visited)});
                    });
                currentVisit = discovered.pop();
            } while (currentVisit !== undefined);

            return bestPathPressureRelease;
        };

        const totalPressureRelease = evaluateBestPath(root);
        console.log("Most pressure released: ", totalPressureRelease);
    }
});

