
// 과일 이미지 배열
const fruitImages = [];

// 이미지 로딩 함수
function loadImage(imagePath) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${imagePath}`));
        img.src = imagePath;
    });
}

// 이미지 로딩 및 배열에 저장
async function loadImages() {
    const imagePaths = [
        'images/appleGreen.png',
        'images/appleRed.png',
        'images/cherry.png',
        'images/grape.png',
        'images/orange.png',
        'images/strawberry.png',
        'images/watermelon.png'
    ];

    try {
        const loadedImages = await Promise.all(imagePaths.map(loadImage));
        fruitImages.push(null); // 인덱스 0은 빈 값으로 채움
        loadedImages.forEach(img => fruitImages.push(img));
        console.log('Images loaded successfully');
    } catch (error) {
        console.error('Error loading images:', error);
    }
}

// 그리드 그리기 함수
function displayGrid(grid) {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 50;

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const fruitIndex = grid[row][col];
            const fruitImage = fruitImages[fruitIndex];
            ctx.drawImage(fruitImage, col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
}

// 리더보드 업데이트 함수
function displayPlayerList(plist) {
    const leaderboardBody = document.querySelector('#leaderboard-table tbody');
    leaderboardBody.innerHTML = '';

    plist.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.score}</td>
        `;
        leaderboardBody.appendChild(row);
    });
}

// 캔버스 이벤트 핸들러 (드래그 앤 드롭)
let isDragging = false;
let startCell = null;

function handleCanvasMouseDown(event) {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cellSize = 50;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    startCell = { row, col };
    isDragging = true;
}

function handleCanvasMouseUp(event) {
    if (!isDragging) return;

    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cellSize = 50;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    const endCell = { row, col };

    // TODO: 서버에 이미지 교환 요청 보내기
    console.log('Swap images:', startCell, endCell);

    isDragging = false;
    startCell = null;
}

// 초기화 함수
async function init() {
    await loadImages();

    const canvas = document.getElementById('game-canvas');
    canvas.width = 500;
    canvas.height = 400;
    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);

    // 테스트용 그리드 데이터
    const testGrid = [
        [1, 2, 3, 4, 5, 6, 7, 1, 2, 3],
        [4, 5, 6, 7, 1, 2, 3, 4, 5, 6],
        [7, 1, 2, 3, 4, 5, 6, 7, 1, 2],
        [3, 4, 5, 6, 7, 1, 2, 3, 4, 5],
        [6, 7, 1, 2, 3, 4, 5, 6, 7, 1],
        [2, 3, 4, 5, 6, 7, 1, 2, 3, 4],
        [5, 6, 7, 1, 2, 3, 4, 5, 6, 7],
        [1, 2, 3, 4, 5, 6, 7, 1, 2, 3]
    ];
    displayGrid(testGrid);

    // 테스트용 플레이어 리스트 데이터
    const testPlayerList = [
        { name: 'Player 1', score: 100 },
        { name: 'Player 2', score: 80 },
        { name: 'Player 3', score: 120 }
    ];
    displayPlayerList(testPlayerList);
}

// 초기화 함수 호출
init();