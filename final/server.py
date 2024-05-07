from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
app = Flask(__name__)
CORS(app)

def is_valid(board, row, col, num):
    # Check if the number is not repeated in the row, column, or the 3x3 sub-grid
    block_row, block_col = 3 * (row // 3), 3 * (col // 3)
    return not (num in board[row] or
                num in board[:, col] or
                num in board[block_row:block_row + 3, block_col:block_col + 3])

def solve_sudoku(board):
    # Find an empty space on the board
    empty = np.where(board == 0)
    if empty[0].size == 0:
        return True  # Puzzle solved
    row, col = empty[0][0], empty[1][0]

    for num in np.random.permutation(range(1, 10)):  # Try numbers 1-9 in random order
        if is_valid(board, row, col, num):
            board[row, col] = num  # Place the number
            if solve_sudoku(board):
                return True
            board[row, col] = 0  # Remove the number and backtrack
    return False

# generate answer board
def generate_sudoku():
    board = np.zeros((9, 9), dtype=int)
    np.random.seed()  # Ensure different board each time
    solve_sudoku(board)
    return board

def remove_numbers_from_board(board, holes=40):
    attempts = holes
    while attempts > 0:
        row = np.random.randint(0, 9)
        col = np.random.randint(0, 9)
        if board[row][col] != 0:  # 이미 빈 칸이 아니면
            temp = board[row][col]
            board[row][col] = 0
            if not is_unique_solution(board):
                board[row][col] = temp  # 유일한 해결책이 보장되지 않으면 원래대로 복구
            else:
                attempts -= 1
    return board  # 수정된 보드를 반환

def is_unique_solution(board):
    def solve_sudoku_modified(board, solution_count=[0]):
        if solution_count[0] > 1:
            return False  # 두 번째 해결책을 찾았으므로 중단

        empty = np.where(board == 0)
        if empty[0].size == 0:
            solution_count[0] += 1  # 해결책 찾기
            return solution_count[0] == 1

        row, col = empty[0][0], empty[1][0]
        for num in range(1, 10):
            if is_valid(board, row, col, num):
                board[row, col] = num  # 숫자 채우기
                if not solve_sudoku_modified(board, solution_count):
                    if solution_count[0] > 1:
                        return False
                board[row, col] = 0  # 백트래킹

        return solution_count[0] == 1

    # 스도쿠 보드의 복사본을 사용하여 원본을 변경하지 않고 해결 여부를 검사
    copy_board = np.copy(board)
    return solve_sudoku_modified(copy_board)


# 현재 선택된 퍼즐을 저장할 변수
board = None
answer = None

# sudoku generator
def generate_puzzle(difficulty):
    global initial_board, answer
    answer = generate_sudoku()
    for i in answer:
        print(i)
    if difficulty == 'hard':
        board = remove_numbers_from_board(np.copy(answer), holes=1)
    initial_board = np.copy(board)
    return board

@app.route('/api/puzzle', methods=['POST'])
def get_puzzle():
    global board
    difficulty = request.json['difficulty']
    board = generate_puzzle(difficulty)
    return jsonify({'puzzle': board.tolist()})

@app.route('/api/update', methods=['POST'])
def update_cell():
    global board, answer
    data = request.json
    row = data['row']
    col = data['col']
    value = data['value']
    board[row][col] = int(value) if value else 0
    # 모든 셀이 채워졌는지 확인
    if np.count_nonzero(board) == 81:
        if np.array_equal(board, answer):
            is_correct = True
        else:
            is_correct = False
    else:
        is_correct = None
    print(is_correct)
    return jsonify({'board': board.tolist(), 'is_correct': is_correct})

@app.route('/api/restart', methods=['POST'])
def restart_puzzle():
    global board
    board = np.zeros((9, 9), dtype=int)  # 스도쿠 보드 초기화
    return jsonify({'message': 'Game has been restarted'}), 200


if __name__ == '__main__':
    app.run()