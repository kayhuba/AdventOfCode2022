import assert from "assert";

console.log("Day 19, Puzzle 01!")

import linereader from "line-reader";

enum Resource {
    ORE,
    CLAY,
    OBSIDIAN,
    GEODE
}

class Cost {
    price: number;
    resource: Resource;

    constructor(price: number, resource: Resource) {
        this.price = price;
        this.resource = resource;
    }
}

class RobotConstruction {
    collects: Resource;
    costs: Cost[] = [];

    constructor(collects: Resource) {
        this.collects = collects;
    }
}

class ResourceCollector {
    resource: Resource;
    creationTime: number;

    constructor(resource: Resource, creationTime: number) {
        this.resource = resource;
        this.creationTime = creationTime;
    }
}

class Blueprint {
    id: number;
    robotConstructions: RobotConstruction[] = [];

    constructor(id: number) {
        this.id = id;
    }
}

enum Action {
    NONE,
    CREATE_ORE_COLLECTOR,
    CREATE_CLAY_COLLECTOR,
    CREATE_OBSIDIAN_COLLECTOR,
    CREATE_GEODE_COLLECTOR
}

class Decision {
    action: Action;
    minute: number;
    previous: Decision | null;
    resourceCollectors: ResourceCollector[];
    resources: number[];

    constructor(action: Action,
                minute: number,
                previous: Decision | null,
                resourceCollectors: ResourceCollector[],
                resources: number[]) {
        this.action = action;
        this.minute = minute;
        this.previous = previous;
        this.resourceCollectors = [...resourceCollectors];
        this.resources = [...resources];
    }

    compareTo(other: Decision): number {
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

const blueprints: Blueprint[] = [];
linereader.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const blueprintIdMatch = /^Blueprint (\d+):/.exec(line);
        // @ts-ignore
        const blueprintId: number = parseInt(blueprintIdMatch[1]);

        const regex = /\sEach (\w+) robot costs (?:(\d+) (\w+)(?: and (?:(\d+) (\w+)))?)\./g;
        const robotConstructions: RobotConstruction[] = [];
        let instructionsMatch: RegExpMatchArray | null;
        while ((instructionsMatch = regex.exec(line)) !== null) {
            // @ts-ignore
            const producerOf: Resource = Resource[instructionsMatch[1].toUpperCase()];
            const robot = new RobotConstruction(producerOf);

            let price: number = parseInt(instructionsMatch[2]);
            // @ts-ignore
            let resourceCost: Resource = Resource[instructionsMatch[3].toUpperCase()];
            robot.costs.push(new Cost(price, resourceCost));

            if (instructionsMatch[4] !== undefined) {
                price = parseInt(instructionsMatch[4]);
                // @ts-ignore
                resourceCost = Resource[instructionsMatch[5].toUpperCase()];
                robot.costs.push(new Cost(price, resourceCost));
            }

            robotConstructions.push(robot);
        }

        const blueprint: Blueprint = new Blueprint(blueprintId);
        blueprint.robotConstructions = robotConstructions;
        blueprints.push(blueprint);
    }

    if (last) {
        let blueprintQualityLevels: number[] = [];
        const minutes: number = 24;
        blueprints.forEach(blueprint => {
            let latestDecisions: Decision[] = [new Decision(
                Action.NONE,
                0,
                null,
                [new ResourceCollector(Resource.ORE, 0)],
                [0,0,0,0]
            )];

            for (let minute=1; minute <= minutes; minute++) {
                let newLatestDecisions: Decision[] = [];
                for (let i=0; i < latestDecisions.length; i++) {
                    const lastDecision = latestDecisions[i];
                    const possibleActions: Action[] = blueprint.robotConstructions
                        .filter(construction =>
                            construction.costs
                                // @ts-ignore
                                .reduce((combined, cost) => (combined && lastDecision.resources[cost.resource] >= cost.price), true))
                        .map(construction => {
                            switch(construction.collects) {
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

                    newLatestDecisions = newLatestDecisions.concat(
                        possibleActions.map(action => new Decision(
                            action,
                            minute,
                            lastDecision,
                            lastDecision.resourceCollectors,
                            lastDecision.resources)
                    ));
                }
                latestDecisions = newLatestDecisions;

                latestDecisions.forEach(decision => {
                    // construct
                    let resourceCollectorToConstruct: Resource | undefined;
                    switch(decision.action) {
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
                        assert(plan !== undefined);
                        plan.costs.forEach(cost => decision.resources[cost.resource] -= cost.price);
                        decision.resourceCollectors.push(new ResourceCollector(resourceCollectorToConstruct, minute))
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
                    .filter((decision, index, array) => !index || decision.compareTo(array[index - 1]) !== 0)

                // optimize / drop decisions that cannot win anymore
                const maxActiveGeodeCrackers = latestDecisions
                    .reduce((max, decision) =>
                        Math.max(max, decision.resourceCollectors.filter(collector =>
                            collector.resource === Resource.GEODE && collector.creationTime < minute)
                            .length)
                        , 0);

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
                            const currentActiveGeodeCrackers = decision.resourceCollectors.filter(collector =>
                                collector.resource === Resource.GEODE && collector.creationTime < minute)
                                .length;

                            const geodesCrackedLate =
                                currentGeodes +
                                currentActiveGeodeCrackers +
                                0.5 * (minutes - minute) * (minutes - minute + 1);

                            return geodesCrackedLate >= minimalGeodesCrackedByBest
                        });
                }
            }

            latestDecisions.sort((a, b) => a.resources[Resource.GEODE] - b.resources[Resource.GEODE]);

            console.log(`Blueprint ${blueprint.id} can crack ${latestDecisions[0].resources[Resource.GEODE]} geodes in ${minutes} minutes`);
            blueprintQualityLevels.push(blueprint.id * latestDecisions[0].resources[Resource.GEODE]);
        });

        const summedQualityLevels: number = blueprintQualityLevels.reduce((sum, currentLevel) => sum += currentLevel, 0);
        console.log("Sum of all quality levels: ", summedQualityLevels);
    }
});

