import React from 'react';
import {strs} from'../data/blanko';
import { Box, Button, Grid } from '@mui/material';

const size = 12;
const empty = 3;

const Blanko = (props) => {
  const {addScore} = props;
  const [word, setWord] = React.useState('');
  const [guess, setGuess] = React.useState('');
  const [fullGuess, setFullGuess] = React.useState('');
  React.useEffect(() => {
    newWord();
  }, []);
  const newWord = () => {
    const w = strs[randInt(strs.length)];
    const missing = [];
    let i = 0;
    while (i < empty) {
      let temp = randInt(size);
      if (!missing.includes(temp) && w.charAt(temp).trim() !== '') {
        missing.push(temp);
        i++;
      }
    }
    let nw = '';
    for (let j = 0; j < size; j++) {
      if (missing.includes(j)) {
        nw += '-';
      } else {
        nw += w.charAt(j);
      }
    }
    console.log(w);
    console.log(nw);
    setWord(w);
    setGuess(nw);
    setFullGuess(nw);
  }
  const setGuessChar = (e, idx) => {
    let char = e.target.value;
    if (char.length > 1) {
      e.target.value = char[0];
      return;
    }
    if (char.length === 0) {
      char = '-';
    }
    const newGuess = fullGuess.slice(0, idx) + char + fullGuess.slice(idx + 1, size);
    setFullGuess(newGuess);
    if (newGuess === word) {
      addScore();
      newWord();
      alert('Correct!');
    }
  }
  const randInt = (max) => {
    return Math.floor(Math.random() * Math.ceil(max));
  }
  return (
    <Box sx={{display: 'flex', flexDirection: 'column'}}>
      <Grid container spacing={0.5} sx={{alignContent: 'center', justifyContent: 'center'}}>
        {
          Array.from(Array(size)).map((v, idx) => {
            return (
              <Grid item sx={{border: '1px solid black', padding: 3}} key={idx}>
                {
                  guess.charAt(idx) === '-'
                    ? <input onKeyUp={(e) => setGuessChar(e, idx)} size="1"/>
                    : guess.charAt(idx)
                }
              </Grid>
            )
          })
        }
      </Grid>
      <Box sx={{flex: 1}}>
        <Button onClick={() => newWord()} >Reset</Button>
      </Box>
    </Box>
  )
}

export default Blanko;
