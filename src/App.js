import React from 'react';
import './App.css';
// You have to import image to use it
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Blanko from './components/Blanko';
import Slido from './components/Slido';
import Mino from './components/Mino';

import { Box, Button, Container, Tab, Tabs, Typography } from '@mui/material';

const App = () => {
  const navigate = useNavigate();
  const [width, setWidth] = React.useState(window.innerWidth);
  const [score, setScore] = React.useState(localStorage.getItem('score'));
  const [tab, setTab] = React.useState(0)
  const resize = () => {
    setWidth(window.innerWidth);
  }
  React.useEffect(() => {
    window.addEventListener('resize', resize);
    if (localStorage.getItem('score') === null) {
      resetScore();
    }
  }, [score])
  const resetScore = () => {
    localStorage.setItem('score', 0);
    setScore(0)
  }
  const addScore = () => {
    localStorage.setItem('score', parseInt(localStorage.getItem('score')) + 1)
    setScore(localStorage.getItem('score'));
  }
  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(e, n) => {setTab(n)}}>
          <Tab label={width <= 800 ? 'H' : 'Home'} onClick={() => navigate("/")}/>
          <Tab label={width <= 800 ? 'B' : 'Blanko'} onClick={() => navigate("/blanko")}/>
          <Tab label={width <= 800 ? 'S' : 'Slido'} onClick={() => navigate("/slido")}/>
          <Tab label={width <= 800 ? 'M' : 'Mino'} onClick={() => navigate("/mino")}/>
        </Tabs>
      </Box>
      <Container>
        <Routes>
          <Route
            path="/blanko"
            element={<Blanko addScore={addScore}/>}
          />
          <Route
            path="/slido"
            element={<Slido addScore={addScore}/>}
          />
          <Route
            path="/mino"
            element={<Mino addScore={addScore}/>}
          />
          <Route
            path="/"
            element={
              <Box sx={{ width: '100%'}}>
                <Typography sx={{ color: 'red' }}>
                  Please choose an option from the nav bar
                </Typography>
                <Typography>Current Score: {score} <Button onClick={() => resetScore()}> (reset) </Button></Typography>
              </Box>
            }
          />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
