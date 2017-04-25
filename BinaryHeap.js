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

module.exports = BinaryHeap;
