import React from 'react';

const ROWS = 12;
const COLS = 10;

const Tetro = (props) => {
  const [grid, setGrid] = React.useState(Array.from({length: ROWS}, () => Array.from({length: COLS}, () => '')));
  const [tile, setTile] = React.useState({
    row: 0,
    col: 0,
    blockType: -1,
  });
  const [win, setWin] = React.useState('stop');
  const blocks = [
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1],
      [1]
    ],
    [
      [1]
    ]
  ]
  const resetGame = () => {
    setGrid(Array.from({length: ROWS}, () => Array.from({length: COLS}, () => '')));
    setWin('stop');
  }
  const startGame = () => {
    setWin('running');
  }
  const keyDown = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        updateBoard("left")
        break;
      case "ArrowRight":
        updateBoard("right")
        break;
      default:
    }
  }
  const updateBoard = (step) => {
    console.log(step);
    let colChange = 0;
    let rowChange = 0;
    if (step === "left") {
      colChange = -1;
    }
    if (step === "right") {
      colChange = 1;
    }
    if (step === "down") {
      rowChange = 0;
    }
  }
  React.useEffect(() => {
    let drop = null;
    if (win === 'running') {
      window.addEventListener('keydown', keyDown)
    } else {
      clearInterval(drop);
      window.removeEventListener('keydown', keyDown);
    }
    return () => {
      clearInterval(drop);
      window.removeEventListener('keydown', keyDown);
    };
  }, [win])
  const {addScore} = props;
  return (
    <div className="tetro">
      <div className="tetris flex" onClick={() => startGame()}>
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => (
            <div className="row">
              {grid[id].map((cell, idx) => (
                <div className={"cell " + grid[idx][id]}>
                </div>
              ))}
            </div>
          ))
        }
      </div>
      <div className="flex">
        <button onClick={() => resetGame()}>Reset</button>
      </div>
    </div>
  )
}

export default Tetro;
