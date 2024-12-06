import React, { useState } from 'react';
import { Container, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box, Typography, Paper, ToggleButton, ToggleButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import './App.css'; // CSS 파일 임포트

function App() {
  const [yourDeck, setYourDeck] = useState('');
  const [opponentDeck, setOpponentDeck] = useState('');
  const [selectedOption, setSelectedOption] = useState('first');
  const [result, setResult] = useState('win');
  const [wins, setWins] = useState(0);
  const [matches, setMatches] = useState([]);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const calculateStats = () => {
    const total = matches.length; // 총 게임 수
    const winsCount = matches.filter(match => match.result === 'win').length; // 승리 수
    return { totalGames: total, winRate: total > 0 ? ((winsCount / total) * 100).toFixed(2) : 0 }; // 승률 계산
  };

  const { totalGames, winRate } = calculateStats(); // 계산된 통계 가져오기

  const handleAddMatch = () => {
    if (yourDeck && opponentDeck) {
      setMatches([...matches, {
        yourDeck,
        opponentDeck,
        position: selectedOption,
        result: result
      }]);
      setYourDeck('');
      setOpponentDeck('');
    } else {
      alert("Please enter both decks.");
    }
  };

  const handleToggleChange = (event, newValue) => {
    if (newValue !== null) {
      setSelectedOption(newValue);
    }
  };

  return (
    <Container style={{ padding: '16px' }}>
      <Typography variant="h5" gutterBottom>Card Game Tracker</Typography>

      <Box display="flex" gap={2} marginBottom={2}>
        <TextField
          label="Your Deck"
          variant="outlined"
          value={yourDeck}
          onChange={handleInputChange(setYourDeck)}
          fullWidth
        />
        <TextField
          label="Opponent Deck"
          variant="outlined"
          value={opponentDeck}
          onChange={handleInputChange(setOpponentDeck)}
          fullWidth
        />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <ToggleButtonGroup
          value={selectedOption}
          exclusive
          onChange={handleToggleChange}
          aria-label="deck selection"
        >
          <ToggleButton value="first" aria-label="first deck">First</ToggleButton>
          <ToggleButton value="second" aria-label="second deck">Second</ToggleButton>
        </ToggleButtonGroup>
        <Button variant="contained" onClick={handleAddMatch}>+ Add</Button>
      </Box>

      <Box display="flex" marginBottom={2}>
        <ToggleButtonGroup
          value={result}
          exclusive
          onChange={(e, newValue) => {
            if (newValue !== null) {
              setResult(newValue);
            }
          }}
          aria-label="game result"
        >
          <ToggleButton value="win" aria-label="win">Win</ToggleButton>
          <ToggleButton value="lose" aria-label="lose">Lose</ToggleButton>
          <ToggleButton value="draw" aria-label="draw">Draw</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Paper style={{ padding: '16px', backgroundColor: '#f0f0f0' }}>
        <Box display="flex" justifyContent="space-between">
          <Typography>Total Games: {totalGames}</Typography>
          <Typography>Win Rate: {winRate}%</Typography>
        </Box>
      </Paper>

      <Paper style={{ marginTop: '16px' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className="table-cell">You</TableCell>
              <TableCell className="table-cell">Opponent</TableCell>
              <TableCell className="table-cell-small">Position</TableCell>
              <TableCell className="table-cell-small">Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches
              .filter(match => match.yourDeck)
              .sort((a, b) => a.yourDeck.localeCompare(b.yourDeck))
              .map((match, index) => (
                <TableRow key={index}>
                  <TableCell className="table-cell">{match.yourDeck}</TableCell>
                  <TableCell className="table-cell">{match.opponentDeck}</TableCell>
                  <TableCell className="table-cell-small">{match.position}</TableCell>
                  <TableCell className="table-cell-small">{match.result}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

export default App;
