console.log("Day 23, Puzzle 02!")

import linereader from "line-reader";

class Coords {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Consideration {
    diffs: Coords[];
    effect: Coords;

    constructor(diffs: Coords[], effect: Coords) {
        this.diffs = diffs;
        this.effect = effect;
    }
}

class Elf {
    position: Coords;

    constructor(position: Coords) {
        this.position = position;
    }
}

let lineCount: number = 0;
const elfs: Elf[] = [];
linereader.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        line.split('').forEach((item, index) => {
            if (item === "#") {
                elfs.push(new Elf(new Coords(index, lineCount)));
            }
        });
        lineCount++;
    }

    if (last) {
        // N, NE, NW
        const considerationN_NE_NW = new Consideration([
                new Coords(0, -1),
                new Coords(-1, -1),
                new Coords(1, -1)
            ],
            new Coords(0, -1)
        );

        // S, SE, SW
        const considerationS_SE_SW = new Consideration([
                new Coords(0, 1),
                new Coords(-1, 1),
                new Coords(1, 1)
            ],
            new Coords(0, 1)
        );

        // W, NW, SW
        const considerationW_NW_SW = new Consideration([
                new Coords(-1, 0),
                new Coords(-1, -1),
                new Coords(-1, 1)
            ],
            new Coords(-1, 0)
        );

        // E, NE, SE
        const considerationE_NE_SE = new Consideration([
                new Coords(1, 0),
                new Coords(1, -1),
                new Coords(1, 1)
            ],
            new Coords(1, 0)
        );

        const elfConsiderations: Consideration[] = [
            considerationN_NE_NW,
            considerationS_SE_SW,
            considerationW_NW_SW,
            considerationE_NE_SE
        ];

        // visualization
        const printArea = () => {
            let minX = Number.POSITIVE_INFINITY;
            let maxX = Number.NEGATIVE_INFINITY;
            let minY = Number.POSITIVE_INFINITY;
            let maxY = Number.NEGATIVE_INFINITY;
            elfs.forEach(elf => {
                minX = Math.min(minX, elf.position.x);
                maxX = Math.max(maxX, elf.position.x);
                minY = Math.min(minY, elf.position.y);
                maxY = Math.max(maxY, elf.position.y);
            });

            const width: number = maxX - minX + 1;
            const height: number = maxY - minY + 1;
            const area: string[][] = [];
            for (let y=0; y < height; y++) {
                area.push(new Array(width).fill('.'));
            }

            elfs.forEach(elf => {
                area[elf.position.y - minY][elf.position.x - minX] = '#';
            });

            area.forEach(line => console.log(line.join('')));
        };

        let elfPresence: Set<String> = new Set();
        elfs.forEach(elf => elfPresence.add(`${elf.position.x},${elf.position.y}`));
        let round: number = 0;
        let movingElves: number = 0;
        do {
            round++;

            // step one: considerations
            let considerations: Map<string, Elf[]> = new Map();
            const isOccupied = (position: Coords): boolean => {
                return elfPresence.has(`${position.x},${position.y}`);
            };

            const consider = (elf: Elf, position: Coords) => {
                let record: Elf[] | undefined = considerations.get(`${position.x},${position.y}`);
                if (record === undefined) {
                    record = [];
                    considerations.set(`${position.x},${position.y}`, record);
                }
                record.push(elf);
            };

            const diff = (position: Coords, diff: Coords): Coords => {
                return new Coords(position.x + diff.x, position.y + diff.y);
            };

            elfs.forEach(elf => {
                if (!isOccupied(new Coords(elf.position.x - 1, elf.position.y - 1)) &&
                    !isOccupied(new Coords(elf.position.x, elf.position.y - 1)) &&
                    !isOccupied(new Coords(elf.position.x + 1, elf.position.y - 1)) &&
                    !isOccupied(new Coords(elf.position.x - 1, elf.position.y)) &&
                    !isOccupied(new Coords(elf.position.x + 1, elf.position.y)) &&
                    !isOccupied(new Coords(elf.position.x - 1, elf.position.y + 1)) &&
                    !isOccupied(new Coords(elf.position.x, elf.position.y + 1)) &&
                    !isOccupied(new Coords(elf.position.x + 1, elf.position.y + 1))) {

                    return;
                }

                for (let i=0; i < elfConsiderations.length; i++) {
                    if (!isOccupied(diff(elf.position, elfConsiderations[i].diffs[0])) &&
                        !isOccupied(diff(elf.position, elfConsiderations[i].diffs[1])) &&
                        !isOccupied(diff(elf.position, elfConsiderations[i].diffs[2]))) {

                        consider(elf, diff(elf.position, elfConsiderations[i].effect));
                        break;
                    }
                }
            });

            // step 2
            movingElves = 0;
            Array.from(considerations.entries()).forEach(entry => {
                const rawPosition: string[] = entry[0].split(',');
                const elfs: Elf[] = entry[1];
                if (elfs.length === 1) {
                    elfPresence.delete(`${elfs[0].position.x},${elfs[0].position.y}`);
                    elfs[0].position.x = parseInt(rawPosition[0]);
                    elfs[0].position.y = parseInt(rawPosition[1]);
                    elfPresence.add(`${elfs[0].position.x},${elfs[0].position.y}`);
                    movingElves++;
                }
            });

            // step 3
            const consideration = elfConsiderations.splice(0,1);
            elfConsiderations.push(consideration[0]);

            // console.log(`Round ${round + 1}:`);
            // printArea();
            // console.log('');
        } while (movingElves > 0);

        console.log("First round where no elve moved: ", round);
    }
});
