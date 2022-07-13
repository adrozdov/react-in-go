import React, { useRef } from "react";
import Cell from "./Cell";
import "./Game.css";

const WIDTH = 800;
const HEIGHT = 600;
const CELL_SIZE = 20;

export default function Game() {
  const rows = HEIGHT / CELL_SIZE;
    const cols = WIDTH / CELL_SIZE;
    
    const boardRef = useRef(null);

  const makeEmptyBoard = () => {
    let board = [];
    for (let y = 0; y < rows; y++) {
      board[y] = [];
      for (let x = 0; x < cols; x++) {
        board[y][x] = false;
      }
    }

    return board;
  };

  var board = makeEmptyBoard();

  const makeCells = () => {
    let cells = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (board[y][x]) {
          cells.push({ x, y });
        }
      }
    }

    return cells;
  };

  const [cells, setCells] = React.useState(makeCells());
  const [isRunning, setIsRunning] = React.useState(false);
  const [interval, setInterval] = React.useState(100);

  const getElementOffset = () => {
    const rect = boardRef.current.getBoundingClientRect();
    const doc = document.documentElement;

    return {
      x: rect.left + window.pageXOffset - doc.clientLeft,
      y: rect.top + window.pageYOffset - doc.clientTop,
    };
  };

  const handleClick = (event) => {
    const elemOffset = getElementOffset();
    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;

    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

    if (x >= 0 && x <= cols && y >= 0 && y <= rows) {
      board[y][x] = !board[y][x];
    }

    setCells(makeCells());
  };

  const runGame = () => {
    setIsRunning(true);
    runIteration();
  };

  const timeoutHandler = window.setTimeout(() => {
    runIteration();
  }, interval);

  const stopGame = () => {
    setIsRunning(false);
    if (timeoutHandler) {
      window.clearTimeout(timeoutHandler);
    //   timeoutHandler(null);
    }
  };

  const runIteration = () => {
    let newBoard = makeEmptyBoard();

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let neighbors = calculateNeighbors(board, x, y);
        if (board[y][x]) {
          if (neighbors === 2 || neighbors === 3) {
            newBoard[y][x] = true;
          } else {
            newBoard[y][x] = false;
          }
        } else {
          if (!board[y][x] && neighbors === 3) {
            newBoard[y][x] = true;
          }
        }
      }
    }

    board = newBoard;
  };

  /**
   * Calculate the number of neighbors at point (x, y)
   * @param {Array} board
   * @param {int} x
   * @param {int} y
   */
  const calculateNeighbors = (board, x, y) => {
    let neighbors = 0;
    const dirs = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
    ];
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      let y1 = y + dir[0];
      let x1 = x + dir[1];

      if (x1 >= 0 && x1 < cols && y1 >= 0 && y1 < rows && board[y1][x1]) {
        neighbors++;
      }
    }

    return neighbors;
  };

  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
  };

  const handleClear = () => {
    board = makeEmptyBoard();
    setCells(makeCells());
  };

  const handleRandom = () => {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        board[y][x] = Math.random() >= 0.5;
      }
    }
  };
  return (
    <div>
      <div
        className="Board"
        style={{
          width: WIDTH,
          height: HEIGHT,
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
        }}
        onClick={handleClick}
        ref={boardRef}
          >
        {cells.map((cell) => (
          <Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`} />
        ))}
      </div>

      <div className="controls">
        Update every <input value={interval} onChange={handleIntervalChange} />{" "}
        msec
        {isRunning ? (
          <button className="button" onClick={stopGame}>
            Stop
          </button>
        ) : (
          <button className="button" onClick={runGame}>
            Run
          </button>
        )}
        <button className="button" onClick={handleRandom}>
          Random
        </button>
        <button className="button" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
}
