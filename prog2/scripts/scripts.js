

document.addEventListener('DOMContentLoaded', function() {
    let puzzle = [
        [ 0,  1,  2,  3],
        [ 4,  5,  6,  7],
        [ 8,  9, 10, 11],
        [12, 13, 14, 'NONE']
    ];
    const puzzleContainer = document.querySelector('.puzzle-container');
    
    // Create table
    const table = document.createElement('table');
    for (let i = 0; i < 4; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < 4; j++) {
            const td = document.createElement('td');

            td.textContent = puzzle[i][j] !== 'NONE' ? puzzle[i][j] : ''; // allocate the number to the cell
            if (puzzle[i][j] === 'NONE') {
                td.classList.add('empty-cell'); // specify the empty cell
            }
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

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; 
        }
    }
    
    function scramblePuzzle() {
        let flattened = puzzle.flat();
        shuffleArray(flattened);
    
        for (let i = 0; i < 4; i++) {
            puzzle[i] = flattened.slice(i * 4, i * 4 + 4);
        }
    
        updateTable();
    }
    
    function updateTable() {
        const trs = table.getElementsByTagName('tr');
        for (let i = 0; i < 4; i++) {
            const tds = trs[i].getElementsByTagName('td');
            for (let j = 0; j < 4; j++) {
                tds[j].textContent = puzzle[i][j] !== 'NONE' ? puzzle[i][j] : '';
            }
        }
        console.log("updateTable");
    }

    function resetTable(){
        for (let i = 0; i < 4; i++) {
            puzzle[i] = [i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 3];
        }
        puzzle[3][3] = 'NONE';
        updateTable();
    }
    
});


