

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

            td.textContent = puzzle[i][j] !== 'NONE' ? puzzle[i][j] : ''; 
            if (puzzle[i][j] === 'NONE') {
                td.classList.add('empty-cell');
            }

            td.addEventListener('click', (function(iLocal, jLocal) {
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
        while (isSolvable(puzzle) === false){
            scramblePuzzle();
        }
        updateTable();
    }

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
    
    function updateTable() {
        const trs = table.getElementsByTagName('tr');
        for (let i = 0; i < 4; i++) {
            const tds = trs[i].getElementsByTagName('td');
            for (let j = 0; j < 4; j++) {
                tds[j].textContent = puzzle[i][j] !== 'NONE' ? puzzle[i][j] : '';
                tds[j].onclick = () => cellClickEvent(i, j);
            }
        }
    }
    function resetTable(){
        for (let i = 0; i < 4; i++) {
            puzzle[i] = [i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 3];
        }
        puzzle[3][3] = 'NONE';
        updateTable();
    }
    

    function swapCells(i, j, emptyI, emptyJ) {
        // 클릭된 셀과 빈 셀의 위치를 교환
        let temp = puzzle[i][j];
        puzzle[i][j] = puzzle[emptyI][emptyJ];
        puzzle[emptyI][emptyJ] = temp;
        updateTable(); // 테이블 업데이트
    }
    
    function cellClickEvent(i, j) {
        // 빈 칸('NONE')의 위치 찾기
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
    
        // 클릭된 셀이 빈 칸과 인접한지 확인
        if ((Math.abs(emptyI - i) === 1 && emptyJ === j) || (Math.abs(emptyJ - j) === 1 && emptyI === i)) {
            swapCells(i, j, emptyI, emptyJ);
        }
    }
    
});


