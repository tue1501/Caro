(function() {
    const boardSize = 20;
    const gameBoard = document.getElementById('game-board');
    const gameStatus = document.getElementById('game-status');
    const resetButton = document.getElementById('reset-button');
    const winModal = document.getElementById('win-modal');
    const winMessage = document.getElementById('win-message');
    const playAgainButton = document.getElementById('play-again');
    let board = [];
    let currentPlayer = 'X';
    let gameOver = false;

    // Các thông điệp thắng ngẫu nhiên, hợp thời
    const winMessages = [
        "Chúc mừng {player}! Bạn đã thắng như một pro gamer thực thụ!",
        "Wow, {player}! Chiến thắng này đỉnh cao quá, trending luôn!",
        "Tuyệt vời {player}! Bạn vừa làm chủ ván cờ này, quá đỉnh!",
        "Đỉnh của chóp, {player}! Bạn đã thắng kiểu Gen Z!",
        "Chơi hay lắm {player}! Chiến thắng này xứng đáng lên top 1!",
    ];

    // Khởi tạo bảng
    function initBoard() {
        board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
        gameBoard.innerHTML = '';
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', handleCellClick);
                gameBoard.appendChild(cell);
            }
        }
        currentPlayer = 'X';
        gameStatus.textContent = `Lượt của người chơi: ${currentPlayer}`;
        gameOver = false;
        gameBoard.style.display = 'grid';
        resetButton.style.display = 'block';
        document.getElementById('menu').style.display = 'none';
    }

    // Xử lý khi người chơi click vào ô
    function handleCellClick(event) {
        if (gameOver) return;

        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        if (board[row][col]) return;

        makeMove(row, col, currentPlayer);
    }

    // Thực hiện nước đi
    function makeMove(row, col, player) {
        board[row][col] = player;
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.textContent = player;
        cell.dataset.value = player;
        cell.classList.add('taken');

        if (checkWin(row, col)) {
            gameStatus.textContent = `Người chơi ${player} thắng!`;
            gameOver = true;
            showWinMessage(player);
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        gameStatus.textContent = `Lượt của người chơi: ${currentPlayer}`;
    }

    // Hiển thị thông báo thắng với confetti
    function showWinMessage(player) {
        const randomMsg = winMessages[Math.floor(Math.random() * winMessages.length)];
        winMessage.textContent = randomMsg.replace('{player}', player);
        winModal.style.display = 'flex';
        playAgainButton.onclick = resetGame;

        // Thêm hiệu ứng confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#e74c3c', '#3498db', '#2ecc71']
        });
    }

    // Kiểm tra thắng
    function checkWin(row, col) {
        const player = board[row][col];
        const directions = [
            { dr: 0, dc: 1 },
            { dr: 1, dc: 0 },
            { dr: 1, dc: 1 },
            { dr: 1, dc: -1 }
        ];

        for (const { dr, dc } of directions) {
            let count = 1;

            for (let step = 1; step < 5; step++) {
                const r = row + dr * step;
                const c = col + dc * step;
                if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }

            for (let step = 1; step < 5; step++) {
                const r = row - dr * step;
                const c = col - dc * step;
                if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }

            if (count >= 5) return true;
        }

        return false;
    }

    // Reset trò chơi về menu
    function resetGame() {
        gameBoard.style.display = 'none';
        resetButton.style.display = 'none';
        winModal.style.display = 'none';
        document.getElementById('menu').style.display = 'block';
        gameStatus.textContent = '';
    }

    // Gắn sự kiện cho nút reset
    resetButton.addEventListener('click', resetGame);

    // Khởi tạo game khi script được tải
    initBoard();
})();