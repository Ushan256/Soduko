import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [grid, setGrid] = useState(Array(9).fill(0).map(() => Array(9).fill(0)));
  const [initialGrid, setInitialGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [difficulty, setDifficulty] = useState(40);
  const [status, setStatus] = useState("Ready to Play");

  const fetchNewGame = async () => {
    const res = await axios.get(`http://127.0.0.1:8000/generate/${difficulty}`);
    setGrid(res.data.grid);
    setInitialGrid(res.data.grid.map(row => [...row]));
    setStatus("Good Luck!");
  };

  const handleInput = (r, c, val) => {
    // Validation: Only allow single digits 1-9
    if (val === "" || /^[1-9]$/.test(val)) {
      const newGrid = grid.map((row, rIdx) => 
        row.map((cell, cIdx) => (rIdx === r && cIdx === c) ? (parseInt(val) || 0) : cell)
      );
      setGrid(newGrid);
      setSelectedCell({ r, c });
    }
  };

  const checkStatus = async () => {
    const res = await axios.post('http://127.0.0.1:8000/validate', { grid });
    if (res.data.result === "Win") setStatus("🏆 YOU WIN!");
    else if (res.data.result === "Loss") setStatus("❌ YOU LOSE!");
    else setStatus("Keep Filling...");
  };

  const solveAll = async () => {
    const res = await axios.post('http://127.0.0.1:8000/solve', { grid: initialGrid });
    setGrid(res.data.solution);
    setStatus("AI Solved It!");
  };

  const getHint = async () => {
    if (!selectedCell || grid[selectedCell.r][selectedCell.c] !== 0) {
      alert("Click an empty cell first!");
      return;
    }
    const res = await axios.post(`http://127.0.0.1:8000/hint?row=${selectedCell.r}&col=${selectedCell.c}`, { grid });
    const newGrid = [...grid];
    newGrid[selectedCell.r][selectedCell.c] = res.data.value;
    setGrid(newGrid);
  };

  return (
    <div className="container">
      <h1 className="neon-text">NEON SUDOKU</h1>
      <h3 className="status">{status}</h3>
      
      <div className="slider-box">
        <label>Difficulty: {difficulty} empties</label>
        <input type="range" min="20" max="65" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
      </div>

      <div className="board">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="row">
            {row.map((cell, cIdx) => (
              <input
                key={`${rIdx}-${cIdx}`}
                className={`${initialGrid[rIdx]?.[cIdx] !== 0 ? "fixed" : "user"} ${selectedCell?.r === rIdx && selectedCell?.c === cIdx ? "active" : ""}`}
                value={cell === 0 ? "" : cell}
                readOnly={initialGrid[rIdx]?.[cIdx] !== 0}
                onClick={() => setSelectedCell({ r: rIdx, c: cIdx })}
                onChange={(e) => handleInput(rIdx, cIdx, e.target.value)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="buttons">
        <button className="btn blue" onClick={fetchNewGame}>New Game</button>
        <button className="btn pink" onClick={getHint}>Hint</button>
        <button className="btn green" onClick={solveAll}>Solve All</button>
        <button className="btn yellow" onClick={checkStatus}>Verify</button>
      </div>
    </div>
  );
}

export default App;