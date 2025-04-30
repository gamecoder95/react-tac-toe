import { useState } from 'react';

function Square({value, onSquareClick, isWinningSquare, isDraw}) {

    const className = `square ${isWinningSquare ? 'win' : ''} ${isDraw ? 'draw' : ''}`;
    
    return <button className={className} onClick={onSquareClick}>{value}</button>;
}

function Board({xIsNext, squares, onPlay}) {

    function handleClick(i) {

        if (squares[i] || calculateWinner(squares)[0]) {
            return;
        }

        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext? 'X' : 'O';

        onPlay(nextSquares);
    }

    const [winner, winningLine] = calculateWinner(squares);
    const isDraw = !squares.includes(null);
    const statusText = winner ? `Winner: ${winner}` : (isDraw ? 'Draw!' : `Next player: ${xIsNext ? "X" : "O"}`); 

    const boardRows = [];
    for (let i = 0; i < 9; i += 3) {
        boardRows.push(
            <div className="board-row" key={i/3}>
                <Square value={squares[i]} onSquareClick={() => handleClick(i)} isWinningSquare={winningLine.includes(i)} isDraw={isDraw} />
                <Square value={squares[i + 1]} onSquareClick={() => handleClick(i + 1)} isWinningSquare={winningLine.includes(i + 1)} isDraw={isDraw} />
                <Square value={squares[i + 2]} onSquareClick={() => handleClick(i + 2)} isWinningSquare={winningLine.includes(i + 2)} isDraw={isDraw} />
            </div>
        );
    }
    
    return (
    <>
        <div className="status">{statusText}</div>
        {boardRows}
    </>);
}

export default function Game() {

    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [isHistoryDescending, setIsHistoryDescending] = useState(false);

    const currentSquares = history[currentMove];
    const xIsNext = currentMove % 2 === 0;

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    function handleSwitchHistorySortingOrder() {
        setIsHistoryDescending(!isHistoryDescending);
    }

    const moves = history.map((squares, move) => {

        let description = move === currentMove ? `You are at move #${currentMove}` : (move > 0 ? `Go to move #${move}` : 'Go to game start');
        
        return (
            <li key={move}>
                {
                    move === currentMove ? <p>{description}</p> : <button onClick={() => jumpTo(move)}>{description}</button>
                }
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <button onClick={handleSwitchHistorySortingOrder}>{isHistoryDescending ? 'Ascending' : 'Descending'}</button>
                <ol>{isHistoryDescending ? moves.toReversed() : moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {

    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; ++i) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
            return [squares[a], lines[i]];
        }
    }

    return [null, []];
}