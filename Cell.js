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

module.exports = Cell;
