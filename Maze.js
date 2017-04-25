const Cell = require('./Cell.js');
const BinaryHeap = require('./BinaryHeap.js');

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
    }

    // Translate and set input strings to usable data
    setData(mazeStr) {
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
        return maze;
    }

    // ~~~~~~~~~~~~~~ A* Implementation ~~~~~~~~~~~~~~~~~~~~
    // SEE README.md FOR WHY I CHOSE THIS ALGORITHM

    // Maze search and solver function
    // I'm having trouble constructing a solution that takes into account the mines and the number of lives a player has without a recursive solution that tests every path possible along the A* routes in order to keep track of the previous routes without 3 mines in them. But that would tank my time and space complexities to hold all the pathways, plus the binary heaps in memory while the program searches
    search() {
        // Construct a BinaryHeap for f(n) values
        const openHeap = new BinaryHeap(node => {
            return node.f;     
        });
        // Add start node to open list
        openHeap.push(this.start);

        while (openHeap.size() > 0) {
            // Grab the lowest f-score to process next
            const currNode = openHeap.pop();

            // End case: when End node has been found
            // DIVE DEEPER INTO THIS
            if (currNode.idx === this.end.idx) {
                let curr = currNode;
                let ret = [];
                while (curr.parent) {
                    ret.push(curr.parentMoved);
                    curr = curr.parent;
                }
                return ret.reverse();
            }

            // Normal Case: move currNode from open to closed; process neighbors
            currNode.closed = true;
            const neighbors = this.neighbors(currNode);

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

    // Heuristic
    manhattan(pos0, pos1) {
        const d1 = Math.abs(pos1.x - pos0.x);
        const d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
    }

    // Collect neighbors of current node
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

 module.exports = Maze;
