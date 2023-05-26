import React from 'react';
import { Box, Button, Grid } from '@mui/material';

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

const Mino = () => {
    const [grid, setGrid] = React.useState(Array.from({length: DEFAULT_SIZE}, () => Array.from({length: DEFAULT_SIZE}, () => new Tile())));
    const [run, setRun] = React.useState('stop')
    const [size, setSize] = React.useState(DEFAULT_SIZE);
    
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
    }
    
    const setCell = (row, col, val) => {
        const newGrid = [...grid];
        grid[row][col] = val;
        setGrid(newGrid);
    }
    
    const setFlag = (row, col) => {
        const temp = {...grid[row][col], flag: !grid[row][col].flag}
        setCell(row, col, temp);
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
        if (row < 0 || row > size - 1 || col < 0 || col > size - 1) {
            return
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
            setRun('over')
            return
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
    }
    
    const checkWin = () => {
        return false;
    }
    
    React.useEffect(() => {
        newGrid(DEFAULT_SIZE, DEFAULT_BOMBS);
    }, [])
    
    return (
        <Box
        >
            <Grid
                container
                sx={{textAlign: 'center'}}
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
                                onContextMenu={(e) => {e.preventDefault(); setFlag(row, col)}}
                                onClick={() => revealCell(row, col)}
                            >
                                {val.reveal ? (val.bomb ? 'b' : val.surround) : (val.flag ? 'F' : '')}
                            </Grid>
                        ))}
                    </Grid>
                ))}
            </Grid>
            <Button onClick={() => newGrid(DEFAULT_SIZE, DEFAULT_BOMBS)}>Reset</Button>
        </Box>
    )
}

export default Mino;