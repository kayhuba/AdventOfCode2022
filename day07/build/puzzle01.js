"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 07, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
const filesystem = {
    "": {
        "_totalSize": 0
    }
};
let currentPath = "";
const cd = (path) => {
    if (path.endsWith('/')) {
        path = path.substring(0, path.length - 2);
    }
    const segments = path.split('/');
    let currentPathObject = filesystem[segments[0]];
    for (let i = 1; i < segments.length; i++) {
        currentPathObject = currentPathObject[segments[i]];
    }
    return currentPathObject;
};
const cdUp = (path) => {
    if (path.length === 0 || path === "/") {
        return null;
    }
    return path.substring(0, path.lastIndexOf('/'));
};
const interpretCommandLine = (commandAndParams) => {
    if (commandAndParams[0] === "cd") {
        if (commandAndParams[1] === "/") {
            currentPath = "/";
            return;
        }
        if (commandAndParams[1] === "..") {
            currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            return;
        }
        if (currentPath === "/") {
            currentPath = "";
        }
        currentPath += "/" + commandAndParams[1];
    }
    else if (commandAndParams[0] === "ls") {
        // NOP
    }
};
const interpretLs = (line) => {
    const currentPathObject = cd(currentPath);
    if (line.startsWith('dir')) {
        const dirName = line.split(' ')[1];
        currentPathObject[dirName] = {
            "_totalSize": 0
        };
        return;
    }
    const fileInfoParts = line.split(' ');
    const fileSize = parseInt(fileInfoParts[0]);
    currentPathObject[fileInfoParts[1]] = fileSize;
    currentPathObject["_totalSize"] += fileSize;
    let path = cdUp(currentPath);
    while (path !== null) {
        cd(path)["_totalSize"] += fileSize;
        path = cdUp(path);
    }
};
const findDirsSmallerThanOrEqual = (path, matchingDirectories, maxSize) => {
    const currentPathObject = cd(path);
    if (currentPathObject['_totalSize'] <= maxSize) {
        matchingDirectories.push({
            "dirName": path.substring(path.lastIndexOf('/')),
            "totalSize": currentPathObject["_totalSize"]
        });
    }
    if (path === "/") {
        path = "";
    }
    Object.entries(currentPathObject).forEach(([name, entry]) => {
        if (typeof entry === "object") {
            findDirsSmallerThanOrEqual(path + "/" + name, matchingDirectories, maxSize);
        }
    });
};
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (line.startsWith("$")) {
        const commandAndParams = line.substring(2).split(' ');
        // command line interpreter
        interpretCommandLine(commandAndParams);
    }
    else {
        interpretLs(line);
    }
    if (last) {
        const matchingDirectories = [];
        findDirsSmallerThanOrEqual("/", matchingDirectories, 100000);
        const sum = matchingDirectories.reduce((sum, match) => sum += match.totalSize, 0);
        console.log("Total size of directories smaller or equal than 100000: ", sum);
    }
});
//# sourceMappingURL=puzzle01.js.map