import React from 'react';
import './style.css'
const size = 3;

const Slido = (props) => {
  const {addScore} = props;
  const [grid, setGrid] = React.useState(Array.from({length: size}, () => Array.from({length: size}, () => null)));

  const correct = [
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, null]
  ]
  const setCell = (row, col, val) => {
    const copy = [...grid];
    copy[row][col] = val;
    setGrid(copy);
  }
  const loopGrid = (func, init) => {
    let ret = init;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        ret = func(i, j, ret);
      }
    }
    return ret;
  }
  const newGrid = () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, null];
    // randomise array
    arr.sort(() => Math.random() - 0.5);
    loopGrid((i, j) => setCell(i, j, arr[i * size + j]));
  }
  const solveGrid = () => {
    setGrid(correct);
  }
  const moveTile = (row, col) => {
    if (grid[row][col] === null) {
      return;
    }
    const val = grid[row][col];
    if (row !== 0) {
      // Check up
      if (grid[row - 1][col] === null) {
        setCell(row - 1, col, val);
        setCell(row, col, null);
        checkWin();
        return;
      }
    }
    if (row !== size - 1) {
      // Check down
      if (grid[row + 1][col] === null) {
        setCell(row + 1, col, val);
        setCell(row, col, null);
        checkWin();
        return;
      }
    }
    if (col !== 0) {
      // Check left
      if (grid[row][col - 1] === null) {
        setCell(row, col - 1, val);
        setCell(row, col, null);
        checkWin();
        return;
      }
    }
    if (col !== size - 1) {
      // Check right
      if (grid[row][col + 1] === null) {
        setCell(row, col + 1, val);
        setCell(row, col, null);
        checkWin();
        return;
      }
    }
  }
  const checkWin = () => {
    if (correctGrid()) {
      alert('Correct!');
      addScore();
      newGrid();
    }
  }
  const move = (rowC, colC) => {
    const nullTile = {row: -1, col: -1};
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === null) {
          nullTile.row = i;
          nullTile.col = j;
          break;
        }
      }
    }
    const moveRow = rowC + nullTile.row;
    const moveCol = colC + nullTile.col;
    if (
      !(
        moveRow < 0
        || moveRow > size - 1
        || moveCol < 0
        || moveCol > size - 1
      )
    ) {
      const val = grid[moveRow][moveCol];
      setCell(moveRow, moveCol, null);
      setCell(nullTile.row, nullTile.col, val);
    }
  }
  const correctGrid = () => {
    return JSON.stringify(grid) === JSON.stringify(correct);
  }
  React.useEffect(() => {
    newGrid();
    window.addEventListener('keydown', (e) => {
      switch(e.key) {
        case "ArrowUp":
          move(0, 1);
          break;
        case "ArrowLeft":
          move(1, 0);
          break;
        case "ArrowDown":
          move(0, -1);
          break;
        case "ArrowRight":
          move(-1, 0);
          break;
        default:
      }
      checkWin();
    })
    return window.removeEventListener('keydown', null);
  }, [])
  return (
    <div className="screen">
      <div className="grid">
        {/* id = col, index = row */}
        {[0, 1, 2].map((id) => (
          <div>
            {grid[id].map((cell, index) => (
              <div key={index} className="tile" onClick={() => moveTile(id, index)}>
                {cell !== null && <img src={require(`../data/shrek/${cell}.png`)} alt={cell}/>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="buttons">
        <button onClick={() => solveGrid()} disabled={correctGrid()}>Solve</button>
        <button onClick={() => newGrid()}>Reset</button>
      </div>
    </div>
  )
}

export default Slido;
