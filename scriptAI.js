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
    let isAIEnabled = true;
    const maxDepth = 3;
    let lastMove = null;

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
        lastMove = null;
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
        lastMove = { row, col };

        if (gameOver) return;

        if (isAIEnabled && currentPlayer === 'O') {
            setTimeout(makeAIMove, 100);
        }
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

    // Kiểm tra cơ hội thắng ngay lập tức cho AI
    function checkAndWin() {
        const directions = [
            { dr: 0, dc: 1 },
            { dr: 1, dc: 0 },
            { dr: 1, dc: 1 },
            { dr: 1, dc: -1 }
        ];

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === 'O') {
                    for (const { dr, dc } of directions) {
                        let count = 1;
                        let winPos = null;

                        for (let step = 1; step < 5; step++) {
                            const r = i + dr * step;
                            const c = j + dc * step;
                            if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
                                if (board[r][c] === 'O') count++;
                                else if (!board[r][c]) {
                                    winPos = { row: r, col: c };
                                    break;
                                } else break;
                            }
                        }

                        for (let step = 1; step < 5; step++) {
                            const r = i - dr * step;
                            const c = j - dc * step;
                            if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
                                if (board[r][c] === 'O') count++;
                                else if (!board[r][c] && !winPos) {
                                    winPos = { row: r, col: c };
                                    break;
                                } else break;
                            }
                        }

                        if (count === 4 && winPos) {
                            makeMove(winPos.row, winPos.col, 'O');
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    // Kiểm tra và chặn chuỗi nguy hiểm của đối thủ
    function checkAndBlock() {
        const directions = [
            { dr: 0, dc: 1 },
            { dr: 1, dc: 0 },
            { dr: 1, dc: 1 },
            { dr: 1, dc: -1 }
        ];

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === 'X') {
                    for (const { dr, dc } of directions) {
                        let count = 1;
                        let blockPos1 = null;
                        let blockPos2 = null;

                        for (let step = 1; step < 5; step++) {
                            const r = i + dr * step;
                            const c = j + dc * step;
                            if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
                                if (board[r][c] === 'X') count++;
                                else if (!board[r][c]) {
                                    blockPos1 = { row: r, col: c };
                                    break;
                                } else break;
                            }
                        }

                        for (let step = 1; step < 5; step++) {
                            const r = i - dr * step;
                            const c = j - dc * step;
                            if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
                                if (board[r][c] === 'X') count++;
                                else if (!board[r][c]) {
                                    blockPos2 = { row: r, col: c };
                                    break;
                                } else break;
                            }
                        }

                        if (count === 4 && (blockPos1 || blockPos2)) {
                            const blockPos = blockPos1 || blockPos2;
                            makeMove(blockPos.row, blockPos.col, 'O');
                            return true;
                        }
                        if (count === 3 && blockPos1 && blockPos2) {
                            makeMove(blockPos1.row, blockPos1.col, 'O');
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    // Logic AI với Minimax
    function makeAIMove() {
        if (checkAndWin()) return;
        if (checkAndBlock()) return;

        let bestMove = null;
        let bestScore = -Infinity;
        const moves = getPossibleMoves();

        if (moves.length === 0) {
            const center = Math.floor(boardSize / 2);
            makeMove(center, center, 'O');
            return;
        }

        for (const { row, col } of moves) {
            board[row][col] = 'O';
            let score = minimax(maxDepth - 1, -Infinity, Infinity, false);
            board[row][col] = null;
            if (score > bestScore) {
                bestScore = score;
                bestMove = { row, col };
            }
        }

        if (bestMove) {
            makeMove(bestMove.row, bestMove.col, 'O');
            lastMove = bestMove;
        }
    }

    // Thuật toán Minimax với cắt tỉa Alpha-Beta
    function minimax(depth, alpha, beta, isMaximizing) {
        if (depth === 0 || checkWinCondition()) {
            return evaluateBoard();
        }

        const moves = getPossibleMoves();
        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const { row, col } of moves) {
                board[row][col] = 'O';
                let eval = minimax(depth - 1, alpha, beta, false);
                board[row][col] = null;
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const { row, col } of moves) {
                board[row][col] = 'X';
                let eval = minimax(depth - 1, alpha, beta, true);
                board[row][col] = null;
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    // Kiểm tra điều kiện thắng trong Minimax
    function checkWinCondition() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] && checkWin(i, j)) return true;
            }
        }
        return false;
    }

    // Đánh giá bảng
    function evaluateBoard() {
        let score = 0;
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j]) {
                    score += evaluatePosition(i, j, board[i][j]);
                }
            }
        }
        return score;
    }

    // Đánh giá vị trí
    function evaluatePosition(row, col, player) {
        let score = 0;
        const directions = [
            { dr: 0, dc: 1 },
            { dr: 1, dc: 0 },
            { dr: 1, dc: 1 },
            { dr: 1, dc: -1 }
        ];
        const opponent = player === 'X' ? 'O' : 'X';

        for (const { dr, dc } of directions) {
            let playerCount = 0;
            let emptyCount = 0;
            let opponentCount = 0;
            let openEnds = 0;

            for (let step = -4; step <= 4; step++) {
                const r = row + dr * step;
                const c = col + dc * step;
                if (r < 0 || r >= boardSize || c < 0 || c >= boardSize) continue;
                if (board[r][c] === player) playerCount++;
                else if (board[r][c] === opponent) opponentCount++;
                else emptyCount++;
            }

            const leftR = row - dr * 4;
            const leftC = col - dc * 4;
            const rightR = row + dr * 4;
            const rightC = col + dc * 4;
            if (leftR >= 0 && leftR < boardSize && leftC >= 0 && leftC < boardSize && !board[leftR][leftC]) openEnds++;
            if (rightR >= 0 && rightR < boardSize && rightC >= 0 && rightC < boardSize && !board[rightR][rightC]) openEnds++;

            if (player === 'O') {
                if (playerCount === 4 && emptyCount >= 1) score += 1000000;
                else if (playerCount === 3 && emptyCount >= 2 && openEnds === 2) score += 50000;
                else if (playerCount === 3 && emptyCount >= 1) score += 10000;
                else if (playerCount === 2 && emptyCount >= 3 && openEnds === 2) score += 5000;
                else if (playerCount === 2 && emptyCount >= 2) score += 1000;
                if (opponentCount === 4 && emptyCount >= 1) score += 90000;
                else if (opponentCount === 3 && emptyCount >= 2 && openEnds === 2) score += 40000;
                else if (opponentCount === 3 && emptyCount >= 1) score += 8000;
                else if (opponentCount === 2 && emptyCount >= 3) score += 500;
            } else {
                if (playerCount === 4 && emptyCount >= 1) score -= 1000000;
                else if (playerCount === 3 && emptyCount >= 2 && openEnds === 2) score -= 50000;
                else if (playerCount === 3 && emptyCount >= 1) score -= 10000;
                else if (playerCount === 2 && emptyCount >= 3) score -= 1000;
            }
            score += playerCount * 20;
        }

        return score;
    }

    // Lấy các nước đi khả thi
    function getPossibleMoves() {
        const moves = new Set();
        const radius = 3;

        if (!lastMove) {
            const center = Math.floor(boardSize / 2);
            return [{ row: center, col: center }];
        }

        const { row: lr, col: lc } = lastMove;
        for (let di = -radius; di <= radius; di++) {
            for (let dj = -radius; dj <= radius; dj++) {
                const r = lr + di;
                const c = lc + dj;
                if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && !board[r][c]) {
                    moves.add(`${r},${c}`);
                }
            }
        }

        return Array.from(moves).map(move => {
            const [row, col] = move.split(',').map(Number);
            return { row, col };
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