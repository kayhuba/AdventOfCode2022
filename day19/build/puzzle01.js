"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
console.log("Day 19, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
var Resource;
(function (Resource) {
    Resource[Resource["ORE"] = 0] = "ORE";
    Resource[Resource["CLAY"] = 1] = "CLAY";
    Resource[Resource["OBSIDIAN"] = 2] = "OBSIDIAN";
    Resource[Resource["GEODE"] = 3] = "GEODE";
})(Resource || (Resource = {}));
class Cost {
    constructor(price, resource) {
        this.price = price;
        this.resource = resource;
    }
}
class RobotConstruction {
    constructor(collects) {
        this.costs = [];
        this.collects = collects;
    }
}
class ResourceCollector {
    constructor(resource, creationTime) {
        this.resource = resource;
        this.creationTime = creationTime;
    }
}
class Blueprint {
    constructor(id) {
        this.robotConstructions = [];
        this.id = id;
    }
}
var Action;
(function (Action) {
    Action[Action["NONE"] = 0] = "NONE";
    Action[Action["CREATE_ORE_COLLECTOR"] = 1] = "CREATE_ORE_COLLECTOR";
    Action[Action["CREATE_CLAY_COLLECTOR"] = 2] = "CREATE_CLAY_COLLECTOR";
    Action[Action["CREATE_OBSIDIAN_COLLECTOR"] = 3] = "CREATE_OBSIDIAN_COLLECTOR";
    Action[Action["CREATE_GEODE_COLLECTOR"] = 4] = "CREATE_GEODE_COLLECTOR";
})(Action || (Action = {}));
class Decision {
    constructor(action, minute, previous, resourceCollectors, resources) {
        this.action = action;
        this.minute = minute;
        this.previous = previous;
        this.resourceCollectors = [...resourceCollectors];
        this.resources = [...resources];
    }
    compareTo(other) {
        return Math.sign(other.resources[Resource.GEODE] - this.resources[Resource.GEODE]) * 19 +
            Math.sign(other.resources[Resource.OBSIDIAN] - this.resources[Resource.OBSIDIAN]) * 17 +
            Math.sign(other.resources[Resource.CLAY] - this.resources[Resource.CLAY]) * 13 +
            Math.sign(other.resources[Resource.ORE] - this.resources[Resource.ORE]) * 11 +
            Math.sign(other.resourceCollectors.filter(collector => collector.resource === Resource.GEODE).length -
                this.resourceCollectors.filter(collector => collector.resource === Resource.GEODE).length) * 7 +
            Math.sign(other.resourceCollectors.filter(collector => collector.resource === Resource.OBSIDIAN).length -
                this.resourceCollectors.filter(collector => collector.resource === Resource.OBSIDIAN).length) * 5 +
            Math.sign(other.resourceCollectors.filter(collector => collector.resource === Resource.CLAY).length -
                this.resourceCollectors.filter(collector => collector.resource === Resource.CLAY).length) * 3 +
            Math.sign(other.resourceCollectors.filter(collector => collector.resource === Resource.ORE).length -
                this.resourceCollectors.filter(collector => collector.resource === Resource.ORE).length) * 2;
    }
}
const blueprints = [];
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const blueprintIdMatch = /^Blueprint (\d+):/.exec(line);
        // @ts-ignore
        const blueprintId = parseInt(blueprintIdMatch[1]);
        const regex = /\sEach (\w+) robot costs (?:(\d+) (\w+)(?: and (?:(\d+) (\w+)))?)\./g;
        const robotConstructions = [];
        let instructionsMatch;
        while ((instructionsMatch = regex.exec(line)) !== null) {
            // @ts-ignore
            const producerOf = Resource[instructionsMatch[1].toUpperCase()];
            const robot = new RobotConstruction(producerOf);
            let price = parseInt(instructionsMatch[2]);
            // @ts-ignore
            let resourceCost = Resource[instructionsMatch[3].toUpperCase()];
            robot.costs.push(new Cost(price, resourceCost));
            if (instructionsMatch[4] !== undefined) {
                price = parseInt(instructionsMatch[4]);
                // @ts-ignore
                resourceCost = Resource[instructionsMatch[5].toUpperCase()];
                robot.costs.push(new Cost(price, resourceCost));
            }
            robotConstructions.push(robot);
        }
        const blueprint = new Blueprint(blueprintId);
        blueprint.robotConstructions = robotConstructions;
        blueprints.push(blueprint);
    }
    if (last) {
        let blueprintQualityLevels = [];
        const minutes = 24;
        blueprints.forEach(blueprint => {
            let latestDecisions = [new Decision(Action.NONE, 0, null, [new ResourceCollector(Resource.ORE, 0)], [0, 0, 0, 0])];
            for (let minute = 1; minute <= minutes; minute++) {
                let newLatestDecisions = [];
                for (let i = 0; i < latestDecisions.length; i++) {
                    const lastDecision = latestDecisions[i];
                    const possibleActions = blueprint.robotConstructions
                        .filter(construction => construction.costs
                        // @ts-ignore
                        .reduce((combined, cost) => (combined && lastDecision.resources[cost.resource] >= cost.price), true))
                        .map(construction => {
                        switch (construction.collects) {
                            case Resource.ORE:
                                return Action.CREATE_ORE_COLLECTOR;
                            case Resource.CLAY:
                                return Action.CREATE_CLAY_COLLECTOR;
                            case Resource.OBSIDIAN:
                                return Action.CREATE_OBSIDIAN_COLLECTOR;
                            case Resource.GEODE:
                                return Action.CREATE_GEODE_COLLECTOR;
                        }
                    });
                    possibleActions.push(Action.NONE);
                    newLatestDecisions = newLatestDecisions.concat(possibleActions.map(action => new Decision(action, minute, lastDecision, lastDecision.resourceCollectors, lastDecision.resources)));
                }
                latestDecisions = newLatestDecisions;
                latestDecisions.forEach(decision => {
                    // construct
                    let resourceCollectorToConstruct;
                    switch (decision.action) {
                        case Action.CREATE_ORE_COLLECTOR:
                            resourceCollectorToConstruct = Resource.ORE;
                            break;
                        case Action.CREATE_CLAY_COLLECTOR:
                            resourceCollectorToConstruct = Resource.CLAY;
                            break;
                        case Action.CREATE_OBSIDIAN_COLLECTOR:
                            resourceCollectorToConstruct = Resource.OBSIDIAN;
                            break;
                        case Action.CREATE_GEODE_COLLECTOR:
                            resourceCollectorToConstruct = Resource.GEODE;
                            break;
                        case Action.NONE:
                            // NOP
                            break;
                    }
                    if (resourceCollectorToConstruct !== undefined) {
                        const plan = blueprint.robotConstructions.find(plan => plan.collects === resourceCollectorToConstruct);
                        (0, assert_1.default)(plan !== undefined);
                        plan.costs.forEach(cost => decision.resources[cost.resource] -= cost.price);
                        decision.resourceCollectors.push(new ResourceCollector(resourceCollectorToConstruct, minute));
                    }
                    // with the latest decisions done, collect
                    decision.resourceCollectors
                        .filter(collector => collector.creationTime < minute)
                        .forEach(collector => {
                        decision.resources[collector.resource] += 1;
                    });
                });
                // optimize / drop duplicates
                latestDecisions = latestDecisions
                    .sort((a, b) => a.compareTo(b))
                    .filter((decision, index, array) => !index || decision.compareTo(array[index - 1]) !== 0);
                // optimize / drop decisions that cannot win anymore
                const maxActiveGeodeCrackers = latestDecisions
                    .reduce((max, decision) => Math.max(max, decision.resourceCollectors.filter(collector => collector.resource === Resource.GEODE && collector.creationTime < minute)
                    .length), 0);
                if (maxActiveGeodeCrackers > 0) {
                    // the one we found will produce
                    const minimalGeodesCrackedByBest = (minutes - minute) * maxActiveGeodeCrackers;
                    // for any decision that is currently not the best but will create a new geode cracker every minute
                    // from now on (that would be the optimal thing to do).
                    // The number of geodes such a decision would produce is:
                    // geodes_cracked_late = currentGeodes + currentActiveGeodeCrackers + 0.5 * remaining_minutes * (remaining_minutes + 1)
                    // Let's compare this with the current best
                    // if geodes_cracked_late < minimalGeodesCrackedByBest then we can drop that decision
                    latestDecisions = latestDecisions
                        .filter(decision => {
                        const currentGeodes = decision.resources[Resource.GEODE];
                        const currentActiveGeodeCrackers = decision.resourceCollectors.filter(collector => collector.resource === Resource.GEODE && collector.creationTime < minute)
                            .length;
                        const geodesCrackedLate = currentGeodes +
                            currentActiveGeodeCrackers +
                            0.5 * (minutes - minute) * (minutes - minute + 1);
                        return geodesCrackedLate >= minimalGeodesCrackedByBest;
                    });
                }
            }
            latestDecisions.sort((a, b) => a.resources[Resource.GEODE] - b.resources[Resource.GEODE]);
            console.log(`Blueprint ${blueprint.id} can crack ${latestDecisions[0].resources[Resource.GEODE]} geodes in ${minutes} minutes`);
            blueprintQualityLevels.push(blueprint.id * latestDecisions[0].resources[Resource.GEODE]);
        });
        const summedQualityLevels = blueprintQualityLevels.reduce((sum, currentLevel) => sum += currentLevel, 0);
        console.log("Sum of all quality levels: ", summedQualityLevels);
    }
});
//# sourceMappingURL=puzzle01.js.map