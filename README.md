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

# Drawing Mazes (WE DON'T HAVE TO DRAW THIS)
* S = start
* E = end
* `*` = mine

# Solving a Maze
* Use an online maze-solving algorithm + code comment why that choice

# What to print
* An array of the solution directions
    - ex: ['up', 'up', 'left']