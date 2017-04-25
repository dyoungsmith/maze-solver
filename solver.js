const fs = require('fs');
const Maze = require('./constructors/Maze.js');

// Solve the maze and print the solution to the console.
fs.readFile('./mazes.txt', 'utf8', (err, mazes) => {
    if (err) console.error(err);
    else {
        let mazeArr = mazes.trim().split('\n'); // separate mazes

        // Call maze constructor and solver on each maze
        mazeArr.forEach((mazeStr, i) => {
            const maze = new Maze(mazeStr);
            const soln = maze.search();
            console.log(`SOLUTION ${i + 1}:`, soln)
        });
    }
});
