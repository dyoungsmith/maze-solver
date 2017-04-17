const fs = require('fs');
const MAZES = require('./mazes.txt');
const TEST_MAZE = require('./maze-test.txt');

// Cell constructor (cells as nodes)
class Cell {
    constructor(idx, code) {
        // features
        this.idx = idx;
        this.start = null;
        this.end = null;
        this.mine = null;

        // edges: LINK TO OTHER NODES WHEN CONSTRUCTING
        this.edges = []; // strings
        this.left = null;
        this.right = null;
        this.up = null;
        this.down = null;

        this.setState(code);
    }

    // Determine and set the state of each cell
    setState(code) {
        const states = ['up', 'right', 'down', 'left', 'start', 'end', 'mine'];

        states.forEach((state, i) => {
            if (code & Math.pow(2, i)) {
                if (i < 4) this.edges.push(state);
                else this[state] = true;
            };
        });
    }

    // Create references to edge nodes
    // This will be used recursively in the Maze constructor ???
    linkEdges() {

    }
}

// // Build Maze: FIGURE OUT BEST STRUCTURE
class Maze {
    constructor(mazeStr) {
        this.height = 0;
        this.width = 0;
        this.cellArr = [];

        this.start = {};
        this.end = {};

        this.setData(mazeStr);
    }

    setData(mazeStr) {
        // remove leading/trailing brackets; separate dimensions from structure
        // edited = ['h,w', 'cellCodes']
        let edited = mazeStr.substring(1, maze.length - 1).split(')-[');

        // set Maze dimensions
        const dims = edited[0].split(',');
        this.height = Number(dims[0]);
        this.width = Number(dims[1]);

        // set cell code array
        const cellStrs = edited[1].split(',');
        cellStrs.forEach(str => {
            this.cellArr.push(Number(str));
        });
    }

    // // Build the maze, transforming each cell
    // // Replace each cell code with node, then link based on idx???
    // // OR find start and end cells thru bitwise, then perform A* on edges from start to end
    // if (currCell.start) this.start = currNode;
    // if (currCell.end) this.end = currNode;
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

        // CALL MAZE CONSTRUCTOR + SOLVER ON EACH MAZE
        mazeArr.forEach(maze => {

        });
    }
});
