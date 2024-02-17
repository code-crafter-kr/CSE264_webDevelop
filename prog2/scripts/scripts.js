

document.addEventListener('DOMContentLoaded', function() {
    let solving = false; // Track the status of the puzzle

    let puzzle = [ // initial state of the puzzle
        [ 1,  2,  3,  4],
        [ 5,  6,  7,  8],
        [ 9,  10, 11, 12],
        [13, 14, 15, 'NONE']
    ];
    
    const puzzleContainer = document.querySelector('.puzzle-container');
    // Create table
    const table = document.createElement('table');
    for (let i = 0; i < 4; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < 4; j++) {
            const td = document.createElement('td');

            td.textContent = puzzle[i][j] !== 'NONE' ? puzzle[i][j] : '';  // allocate the number to the cell / NONE is empty cell
            if (puzzle[i][j] === 'NONE') {
                td.classList.add('empty-cell');
            }

            td.addEventListener('click', (function(iLocal, jLocal) { // Add event listener to each cell
                return function() {
                    cellClickEvent(iLocal, jLocal);
                };
            })(i, j));

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    puzzleContainer.appendChild(table);

    // Scramble button
    const scrambleButton = document.createElement('button');
    scrambleButton.textContent = 'Scramble';
    scrambleButton.addEventListener('click', scramblePuzzle);
    puzzleContainer.appendChild(scrambleButton);

    // Reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', resetTable);
    puzzleContainer.appendChild(resetButton);

    // Shuffle the puzzle
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; 
        }
    }

    // Scramble the puzzle
    function scramblePuzzle() {
        let flattened = puzzle.flat();
        shuffleArray(flattened);
    
        for (let i = 0; i < 4; i++) {
            puzzle[i] = flattened.slice(i * 4, i * 4 + 4);
        }
        while (isSolvable(puzzle) === false){
            scramblePuzzle();
        }
        updateTable();
        solving = false;
    }

    // Check if the puzzle is solvable
    function isSolvable(puzzle) {
        let inversions = 0;
        let flattened = puzzle.flat();
        let emptyRow;
    
        for (let i = 0; i < flattened.length; i++) {
            if (flattened[i] === 'NONE') {
                emptyRow = Math.floor(i / 4) + 1;
                continue;
            }
            for (let j = i + 1; j < flattened.length; j++) {
                if (flattened[j] === 'NONE') {
                    continue;
                }
                if (flattened[i] > flattened[j]) {
                    inversions++;
                }
            }
        }
    
        if (emptyRow % 2 === 0) {
            return inversions % 2 === 1;
        } else {
            return inversions % 2 === 0;
        }
    }
    
    // Update the table
    function updateTable() {
        const trs = table.getElementsByTagName('tr');
        for (let i = 0; i < 4; i++) {
            const tds = trs[i].getElementsByTagName('td');
            for (let j = 0; j < 4; j++) {
                tds[j].textContent = puzzle[i][j] !== 'NONE' ? puzzle[i][j] : '';
                tds[j].onclick = () => cellClickEvent(i, j);
                tds[j].classList.remove('solved');
            }

        }
    }

    // Reset the table
    function resetTable(){
        for (let i = 0; i < 4; i++) {
            puzzle[i] = [i * 4 + 1, i * 4 + 2, i * 4 + 3, i * 4 + 4];
        }
        puzzle[3][3] = 'NONE';
        updateTable();
        solving = false;
    }
    
    // Swap the cells
    function swapCells(i, j, emptyI, emptyJ) {
        solving = true;
        let temp = puzzle[i][j];
        puzzle[i][j] = puzzle[emptyI][emptyJ];
        puzzle[emptyI][emptyJ] = temp;
        updateTable(); // update table
        if (isSolved(puzzle)) { // if the puzzle is solved
            solving = false; // initialize the solving status - false
        }
    }
    
    function cellClickEvent(i, j) {
        // find the empty cell
        let emptyI, emptyJ;
        puzzle.find((row, rowIndex) => {
            let colIndex = row.indexOf('NONE');
            if (colIndex !== -1) {
                emptyI = rowIndex;
                emptyJ = colIndex;
                return true;
            }
            return false;
        });
    
        // check if the cell is next to the empty cell
        if ((Math.abs(emptyI - i) === 1 && emptyJ === j) || (Math.abs(emptyJ - j) === 1 && emptyI === i)) {
            swapCells(i, j, emptyI, emptyJ);
        }
    }
    
    // Check if the puzzle is solved
    function isSolved(puzzle) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (i === 3 && j === 3) {
                    if (puzzle[i][j] !== 'NONE') {
                        return false;
                    }
                } else if (puzzle[i][j] !== i * 4 + j + 1) {
                    return false;
                }
            }
        }
        // Add solved class to all cells - color change
        document.querySelectorAll('td').forEach(td => {
            td.classList.add('solved');
        });
        return true;
    }
});


