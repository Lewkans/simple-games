import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import Brightness5Icon from '@mui/icons-material/Brightness5';

const DEFAULT_SIZE = 10
const DEFAULT_BOMBS = 10

const Tile = class {

    constructor() {
        this.bomb = false;
        this.reveal = false;
        this.surround = 0;
        this.flag = false;
    }
}

const Mino = (props) => {
    const {addScore} = props;
    const [grid, setGrid] = React.useState(Array.from({length: DEFAULT_SIZE}, () => Array.from({length: DEFAULT_SIZE}, () => new Tile())));
    const [run, setRun] = React.useState('running')
    const [size, setSize] = React.useState(DEFAULT_SIZE);
    const [noBombs, setNoBombs] = React.useState(DEFAULT_BOMBS);
    
    const newGrid = (size, bombs) => {
        resetGrid(size)
        setBombs(bombs);
        setSurrounding();
    }
    
    const resetGrid = (size) => {
        setGrid(Array.from({length: size}, () => Array.from({length: size}, () => new Tile())))
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                setCell(i, j, new Tile());
            }
        }
        setRun('running')
    }
    
    const setCell = (row, col, val) => {
        const newGrid = [...grid];
        grid[row][col] = val;
        setGrid(newGrid);
    }
    
    const setFlag = (row, col) => {
        if (run !== 'lose') {
            const temp = {...grid[row][col], flag: !grid[row][col].flag}
            setCell(row, col, temp);
        }
    }
    
    const checkWin = () => {
        // Check if all elements are revealed if not bomb or not revealed if bomb
        return grid.every((row) => row.every((tile) => (tile.bomb && !tile.reveal) || (!tile.bomb && tile.reveal)))
    }
    
    const setSurrounding = () => {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const sum =
                    (row > 0 && col > 0 && grid[row - 1][col - 1].bomb) // Top Left
                    + (row > 0 && grid[row - 1][col].bomb) // Top Mid
                    + (row > 0 && col < size - 1 && grid[row - 1][col + 1].bomb) // Top Right
                    + (col > 0 && grid[row][col - 1].bomb) // Left
                    + (col < size - 1 && grid[row][col + 1].bomb) // Right
                    + (row < size - 1 && col > 0 && grid[row + 1][col - 1].bomb) // Bot Left
                    + (row < size - 1 && grid[row + 1][col].bomb) // Bot Mid
                    + (row < size - 1 && col < size - 1 && grid[row + 1][col + 1].bomb) // Bot Right
                const temp = {...grid[row][col], surround: sum}
                setCell(row, col, temp);
            }
        }
    }
    
    const setBombs = (num) => {
        let i = 0
        while (i < num) {
            const row = randInt(size);
            const col = randInt(size);
            if (!grid[row][col].bomb) {
                const temp = {...grid[row][col], bomb: true}
                setCell(row, col, temp);
                i++;
            }
        }
    }
    
    const randInt = (max) => {
        return Math.floor(Math.random() * Math.ceil(max));
    }
    
    const revealCell = (row, col) => {
        if (run !== 'running') {
            return;
        }
        if (row < 0 || row > size - 1 || col < 0 || col > size - 1) {
            return;
        }
        // Check if cell is already revealed
        if (grid[row][col].reveal) {
            return;
        }
        // Reveal
        const temp = {...grid[row][col], reveal: true}
        setCell(row, col, temp);
        // Check if cell is bomb
        if (grid[row][col].bomb) {
            setRun('lose')
            return;
        }
        // If === 0 then revealCell() the surrounding
        if (grid[row][col].surround === 0) {
            revealCell(row - 1, col - 1);
            revealCell(row - 1, col);
            revealCell(row - 1, col + 1);
            revealCell(row, col - 1);
            revealCell(row, col + 1);
            revealCell(row + 1, col - 1);
            revealCell(row + 1, col);
            revealCell(row + 1, col + 1);
        }
        if (checkWin()) {
            setRun("win");
            addScore();
        }
    }
    
    React.useEffect(() => {
        newGrid(DEFAULT_SIZE, DEFAULT_BOMBS);
    }, [])
    
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
            }}
        >
            <Grid
                container
                sx={{
                    textAlign: 'center',
                }}
            >
                {Array.from({length: size}, (_, x) => x).map((row) => (
                    <Grid
                        container
                        item
                    >
                        {grid[row].map((val, col) => (
                            <Grid
                                item
                                sx={{
                                    border: 1,
                                    height: 50,
                                    width: 50,
                                    cursor: 'pointer',
                                    "&:hover": {
                                        backgroundColor: 'grey',
                                    },
                                }}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                onContextMenu={(e) => {e.preventDefault(); setFlag(row, col)}}
                                onClick={() => revealCell(row, col)}
                            >
                                <Typography>
                                    {val.reveal ? (val.bomb ? <Brightness5Icon /> : val.surround) : (val.flag ? <FlagIcon /> : '')}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                ))}
            </Grid>
            {run === 'running' &&
                <Button onClick={() => newGrid(size, noBombs)}>Give Up</Button>
            }
            {run === 'win' &&
                <Button onClick={() => newGrid(size, noBombs)}>Restart</Button>
            }
            {run === 'lose' &&
                <Button onClick={() => newGrid(size, noBombs)}>Restart</Button>
            }
        </Box>
    )
}

export default Mino;