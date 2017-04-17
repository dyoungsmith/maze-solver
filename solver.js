// BIG THING TO FIGURE OUT: how to represent the maze -- AS A GRAPH!! :D

const fs = require('fs');
const MAZES = require('./mazes.txt');
const TEST_MAZE = require('./maze-test.txt');


// Constructor for each cell (represented as nodes)
class CellNode {
    constructor(idx, code) {
        // features
        this.idx = idx;
        this.code = code;
        this.start = null;
        this.end = null;
        this.mine = null;

        // edges: LINK TO OTHER NODES WHEN CONSTRUCTING
        this.edges = []; // strings
        this.left = null;
        this.right = null;
        this.up = null;
        this.down = null;
    }

    // Determine and set the state of each cell
    setState() {
        const states = ['up', 'right', 'down', 'left', 'start', 'end', 'mine'];

        states.forEach((state, i) => {
            if (this.code & Math.pow(2, i)) {
                if (i < 4) this.edges.push(state);
                else this[state] = true;
            };
        });
    }

    // Create references to edge nodes
    // This will be used recursively in the Maze constructor
    linkEdges() {

    }
}

// // Build Maze: FIGURE OUT STRUCTURE
class Maze {
    constructor(mazeStr) {
        this.mazeStr = mazeStr;
        this.height = 0;
        this.width = 0;
        this.cellArr = [];
    }

    setData() {
        // remove leading/trailing brackets; separate dimensions from structure
        // edited = ['h,w', 'cellCodes']
        let edited = this.mazeStr.substring(1, maze.length - 1).split(')-[');

        // set Maze dimensions
        const dims = edited[0].split(',');
        this.height = Number(dims[0]);
        this.width = Number(dims[1]);

        // set Maze cells
        const cellStrs = edited[1].split(',');
        cellStrs.forEach(str => {
            this.cellArr.push(Number(str));
        });
    }
}

// Maze Solver: A* Pathfinding Algorithm (https://en.wikipedia.org/wiki/A*_search_algorithm)
/* A*: minimize this at each step: f(n) = g(n) + h(n)
        g(n) = distance from start to current node
            use x and y to calculate
        h(n) = estimated minimum distance from current node to target node (straightline) - 'heuristic'
            use 1 for each block, 1.4 for each diagonal >> multiply by 10 >> 10 and 14
            use x and y to calculate
        for equal f costs, select the node with the lowest h cost
        update neighbor paths to reflect best possible path
   To keep track of path: keep a reference to each node's parent >> use a reconstructing algorithm at the end to get path
   node values: {x, y, directions (possible neighbors): [], characteristics: [(S, E, *)]}
*/

// Solve it
// Load mazes from mazes.txt
fs.readFile(MAZES, 'utf8', (err, mazes) => {
    // probably need a variable for solutions to print to console

    if (err) console.error(err);
    else {
        let mazeArr = mazes.trim().split('\n'); // separate mazes

        // edit maze data to be usable
        mazeArr.forEach(maze => {
            // CALL MAZE CONSTRUCTOR + SOLVER ON EACH MAZE

        });
    }
});
// .then(mazeArr => {

// })
