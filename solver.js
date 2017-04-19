const fs = require('fs');
// const MAZES = require('./mazes.txt');
const TEST_MAZE = require('./maze-test.txt');

// Cell constructor (cells are nodes)
class Cell {
    constructor(code, idx) {
        // features
        this.idx = idx;
        this.start = null;
        this.end = null;
        this.mine = null;

        // edges: LINK TO OTHER NODES WHEN CONSTRUCTING
        this.left = null;
        this.right = null;
        this.up = null;
        this.down = null;

        // A* values
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.cost = 1;
        this.visited = false;
        this.closed = false;
        this.parent = null;
        this.parentMoved = '';

        this.setState(code);
    }

    // Determine and set the state of each cell
    setState(code) {
        const states = ['up', 'right', 'down', 'left', 'start', 'end', 'mine'];

        states.forEach((state, i) => {
            if (code & Math.pow(2, i)) {
                this[state] = true;
            };
        });
    }
}

// BinaryHeap constructor for priority queue
class BinaryHeap {
    constructor(scoreFn) {
        this.content = [];
        this.scoreFn = scoreFn;
    }

    push(elem) {
        // add elem to content array
        this.content.push(elem);
        // allow it to sink down to create the heap
        this.sinkDown(this.content.length - 1);
    }

    pop() {
        const result = this.content[0];
        const end = this.content.pop();
        // If there are elems left, put the end elem at the start, then bubble up
        if (this.content.length) {
            this.content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    }

    remove(node) {
        const i = this.content.indexOf(node);
        // Fill the hole for the removed node
        const end = this.content.pop();

        if (i !== this.content.length - 1) {
            this.content[i] = end;
            if (this.scoreFn(end) < this.scoreFn(node)) {
                this.sinkDown(i);
            }
            else {
                this.bubbleUp(i);
            }
        }
    }

    size() {
        return this.content.length;
    }

    rescoreElement(node) {
        this.sinkDown(this.content.indexOf(node));
    }

    sinkDown(n) {
        // Grab the elem for sinking
        let elem = this.content[n];
        // idx = 0 is the farthest the elem can sink
        while (n > 0) {
            // Compute parent idx and grab the parent
            const parentN = ((n + 1) >> 1) - 1;
            let parent = this.content[parentN];
            // Swap elems if necessary
            if (this.scoreFn(elem) < this.scoreFn(parent)) {
                [elem, parent] = [parent, elem];    // CHECK IF THIS WORKS
                // Update n to continue
                n = parentN;
            }
            else break;
        }
    }

    bubbleUp(n) {
        // Get target elem and its score
        const length = this.content.length;
        const elem = this.content[n];
        const elemScore = this.scoreFn(elem);

        while (true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) << 1;
            var child1N = child2N - 1;
            // This is used to store the new position of the element, if any.
            var swap = null;
            var child1Score;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N];
                child1Score = this.scoreFn(child1);

                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore) {
                swap = child1N;
                }
            }

            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N];
                var child2Score = this.scoreFn(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = elem;
                n = swap;
            }
            // Otherwise, we are done.
            else {
                break;
            }
        }
    }
}

// Build Maze as a graph: cells are nodes, openings are edges
class Maze {
    constructor(mazeStr) {
        this.height = 0;
        this.width = 0;
        this.cellArr = [];
        this.start = {};
        this.end = {};

        this.setData(mazeStr);
        this.maze = this.buildMaze();
        // this.search();
    }

    // Translate and set input strings to usable data
    setData(mazeStr) {
        // remove leading/trailing brackets; separate dimensions from structure
        // edited = ['h,w', 'cellCodes']
        let edited = mazeStr.substring(1, mazeStr.length - 1).split(')-[');

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

    // Build the maze as a 2D array of nodes
    buildMaze() {
        let maze = [];
        let cellArrIdx = 0;

        for (let y = 0; y < this.height; y++) {
            let row = [];
            for (let x = 0; x < this.width; x++) {
                const newNode = new Cell(this.cellArr[cellArrIdx], cellArrIdx);
                newNode.pos = { y, x };
                if (newNode.start) this.start = newNode;
                if (newNode.end) this.end = newNode;
                row.push(newNode);
                cellArrIdx++;
            }
            maze.push(row);
        }
        // console.log('START', this.start.pos, 'END', this.end.pos)
        return maze;
    }

    // ~~~~~~~~~~~~~~ A* Implementation ~~~~~~~~~~~~~~~~~~~~
    // WRITE ABOUT HOW I CHOSE THIS ONE

    // // Returns the full path
    // reconstructPath(node) {
    //     let curr = node;
    //     let path = [];
    //     while (curr.parent) {
    //         // Will probably have to edit to get directions, not just parent node
    //         path.unshift(curr);
    //         curr = curr.parent;
    //     }
    //     return path;
    // }

    // Constructs a BinaryHeap scoring by f(n) values
    getHeap() {
        return new BinaryHeap(node => {
            return node.f;
        });
    }

    // Search function
    // MUST TAKE MINES INTO ACCT!!
    search() {
        const openHeap = this.getHeap();
        openHeap.push(this.start);

        while (openHeap.size() > 0) {
            // Grab the lowest f-score to process next
            const currNode = openHeap.pop();

            // End case: when End node has been found
            // DIVE DEEPER INTO THIS
            if (currNode.idx === this.end.idx) {
                let curr = currNode;
                const ret = [];
                while (curr.parent) {
                    ret.push(curr.parentMoved);
                    curr = curr.parent;
                }
                return ret.reverse();
            }

            // Normal Case: move currNode from open to closed; process neighbors
            currNode.closed = true;
            let neighbors = this.neighbors(currNode);

            for (let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];
                if (neighbor.closed) continue;

                // g = distance from start to currNode
                // Check if this is the shortest path to currNode
                const gScore = currNode.g + neighbor.cost;
                const beenVisited = neighbor.visited;

                if (!beenVisited || gScore < neighbor.g) {
                    // Score this path
                    neighbor.visited = true;
                    neighbor.parent = currNode;
                    neighbor.h = neighbor.h || this.manhattan(neighbor.pos, this.end.pos);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;

                    if (!beenVisited) openHeap.push(neighbor);
                    else openHeap.rescoreElement(neighbor);
                }
            }
        }
        return [];  // no result
    }

    // heuristic
    manhattan(pos0, pos1) {
        const d1 = Math.abs(pos1.x - pos0.x);
        const d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
    }

    neighbors(node) {
        let ret = [];
        const x = node.pos.x;
        const y = node.pos.y;

        if (node.left) {
            let neighborNode = this.maze[y][x - 1];
            neighborNode.parentMoved = 'left';
            ret.push(neighborNode);
        }

        if (node.right) {
            let neighborNode = this.maze[y][x + 1];
            neighborNode.parentMoved = 'right';
            ret.push(neighborNode);
        }

        if (node.down) {
            let neighborNode = this.maze[y + 1][x];
            neighborNode.parentMoved = 'down';
            ret.push(neighborNode);
        }

        if (node.up) {
            let neighborNode = this.maze[y - 1][x];
            neighborNode.parentMoved = 'up';
            ret.push(neighborNode);
        }
        return ret;
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
fs.readFile('./maze-test.txt', 'utf8', (err, mazes) => {
    // probably need a variable for solutions to print to console

    if (err) console.error(err);
    else {
        let mazeArr = mazes.trim().split('\n'); // separate mazes

        // CALL MAZE CONSTRUCTOR + SOLVER ON EACH MAZE
        mazeArr.forEach(mazeStr => {
            const maze = new Maze(mazeStr);
            console.log('SOLUTION??', maze.search())
        });
    }
});
