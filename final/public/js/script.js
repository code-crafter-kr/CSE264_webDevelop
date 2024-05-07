var initial_board;

$(document).ready(function() {
    // 9x9 예시 퍼즐 데이터

    // 난이도 버튼 클릭 이벤트 핸들러
    $('#easy').click(function() {
      startGame('easy');
    });
  
    $('#medium').click(function() {
      startGame('medium');
    });
  
    $('#hard').click(function() {
      startGame('hard');
    });
  
    // start game
    function startGame(difficulty) {
      $('#menu').hide();
      $('#game').show();
      
      $.ajax({
        url: 'http://localhost:5000/api/puzzle',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ difficulty: difficulty }),
        success: function(response) {
          var puzzle = response.puzzle;
          initial_board = puzzle;  // 초기 퍼즐 상태 저장
          renderBoard(puzzle);
      },
        error: function() {
          alert('Error occurred while getting the puzzle. Please try again.');
        }
      });
    }
    
    // board rendering
    function renderBoard(board) {
      var tableBody = $('#sudoku-board tbody');
      tableBody.empty();
      for (var i = 0; i < 9; i++) {
          var row = $('<tr>');
          for (var j = 0; j < 9; j++) {
              var cell = $('<td>');
              var value = board[i][j];
              if (value !== 0) {
                  if (value === initial_board[i][j]) {
                      cell.text(value).addClass('fixed');
                  } else {
                      var input = $('<input>')
                          .attr('type', 'number')
                          .attr('maxlength', '1')
                          .addClass('cell-input')
                          .attr('data-row', i)
                          .attr('data-col', j)
                          .val(value);
                      cell.append(input).attr('data-state', 'user-input');
                  }
              } else {
                  var input = $('<input>')
                      .attr('type', 'number')
                      .attr('maxlength', '1')
                      .addClass('cell-input')
                      .attr('data-row', i)
                      .attr('data-col', j)
                      .val('');
                  cell.append(input);
              }
              row.append(cell);
          }
          tableBody.append(row);
      }
  }
  $('#sudoku-board').on('change', '.cell-input', function() {
    var row = $(this).data('row');
    var col = $(this).data('col');
    var value = $(this).val();
    
    $.ajax({
        url: 'http://localhost:5000/api/update',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ row: row, col: col, value: value }),
        success: function(response) {
            renderBoard(response.board);
            
            if (response.is_correct === true) {
                showMessage('Congratulations!');
            } else if (response.is_correct === false) {
                showMessage('Wrong Answer.. Please try again.');
            }
        },
        error: function() {
            alert('Error occurred while updating the cell.');
        }
    });
});

function showMessage(text) {
    $('#message-text').text(text);
    $('#message-box').removeClass('hidden');
}

$('#close-message').on('click', function() {
    $('#message-box').addClass('hidden');
});
    
  
    // 'New Game' 버튼 클릭 이벤트 핸들러
    $('#new-game').click(function() {
      // 서버에 게임을 리셋하도록 요청
      $.ajax({
        url: 'http://localhost:5000/api/restart',
        method: 'POST',
        success: function() {
          // 요청 성공 후 페이지 새로고침
          location.reload();
        },
        error: function() {
          alert('Error occurred while starting a new game.');
        }
      });
    });
    
    // 힌트 버튼 클릭 이벤트 핸들러
    $('#hint').click(function() {
      $.ajax({
        url: 'http://localhost:5000/api/hint',
        method: 'GET',
        success: function(response) {
          if (response.error) {
            var selector = `#sudoku-board tr:eq(${response.error.row}) td:eq(${response.error.col}) input`;
            $(selector).addClass('error-highlight');
            setTimeout(function() {
              $(selector).removeClass('error-highlight');
            }, 2000); // 2초 후 하이라이트 제거
          } else if (response.hint) {
            var selector = `#sudoku-board tr:eq(${response.hint.row}) td:eq(${response.hint.col}) input`;
            $(selector).addClass('hint-highlight');
            setTimeout(function() {
              $(selector).removeClass('hint-highlight');
            }, 2000); // 2초 후 하이라이트 제거
          } else {
            alert(response.message);
          }
        },
        error: function() {
          alert('Error occurred while requesting a hint.');
        }
      });
    });
    

  });

  