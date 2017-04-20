# To run:
* `npm install`
* `node solver.js`

# OBJECTIVE: Find the shortest path through the maze
* 3 lives >> can die twice, then resurrect at current location

# Loading Mazes
* Each line is one maze, as a string
* Structure: `'(height, width)-[structureArr]'`
    - Each elem in the structureArr is a cell (top left >> bottom right)
    - Each number = state of the cell
    - To determine the state: bitwise AND operation against feature code (if it returns 0, then the cell does not have the state of that feature code)

# Feature Code
* UP = 1        (2^0)
* RIGHT = 2     (2^1)
* DOWN = 4      (2^2)
* LEFT = 8      (2^3)
* START = 16    (2^4)
* END = 32      (2^5)
* MINE = 64     (2^6)

# Solving a Maze: A* Pathfinding Algorithm
* I chose the A* algorithm because it solves for the shortest-path between a given start and end node using weighted estimates of distance to target node and from the start node. Additionally, I liked the binary heap implementation for more efficient wayfinding as well as being a calculated approach rather than a brute force recursive approach that calculates all possible paths and ultimately returns the smallest.
* A* example repo: https://github.com/bgrins/javascript-astar

# What to print
* An array of the solution directions
    - ex: ['up', 'up', 'left']