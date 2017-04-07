// BIG THING TO FIGURE OUT: how to represent the maze

const fs = require('fs');


// Loading mazes from mazes.txt
let mazeArr = [];   // Contains the full maze description as original string
fs.readFile('./mazes.txt', 'utf8', (err, mazes) => {
    if (err) console.error(err);
    else {
        mazeArr = mazes.split('\n');
        // console.log(mazeArr)
    }
})
