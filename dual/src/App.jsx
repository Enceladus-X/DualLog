import React, { useState } from 'react';
import { Container, Button, ToggleButton, ToggleButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Snackbar, IconButton, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh'; // 리로드 아이콘
import './App.css'; // CSS 파일 임포트

function App() {
  const [yourDeck, setYourDeck] = useState('');
  const [opponentDeck, setOpponentDeck] = useState('');
  const [selectedOption, setSelectedOption] = useState('first');
  const [result, setResult] = useState('win');
  const [matches, setMatches] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleAddMatch = () => {
    if (yourDeck && opponentDeck) {
      setMatches([...matches, { yourDeck, opponentDeck, position: selectedOption, result }]);
      setYourDeck('');
      setOpponentDeck('');
    } else {
      setSnackbarMessage("Please enter both decks.");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container style={{ padding: '16px' }}>
      {/* Header */}
      <Box
        sx={{
          position: 'absolute',
          left: '16px',
          top: '16px',
          width: '328px',
          height: '28px',
          opacity: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0px',
          rowGap: '0px',
          flexWrap: 'wrap',
          alignContent: 'center',
          background: 'rgba(0, 0, 0, 0)',
          zIndex: 0,
        }}
      >
        <Typography variant="h6">Card Game Tracker</Typography>
        <IconButton onClick={() => window.location.reload()}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Input Section */}
      <Box className="input-section">
        {/* 왼쪽 덱 입력 박스 */}
        <Box className="left-deck-input">
          <input
            type="text"
            placeholder="Your Deck"
            value={yourDeck}
            onChange={(e) => setYourDeck(e.target.value)}
            style={{ width: '100%', height: '100%', border: 'none', outline: 'none', padding: '5px' }}
          />
        </Box>

        {/* 오른쪽 덱 입력 박스 */}
        <Box className="right-deck-input">
          <input
            type="text"
            placeholder="Opponent Deck"
            value={opponentDeck}
            onChange={(e) => setOpponentDeck(e.target.value)}
            style={{ width: '100%', height: '100%', border: 'none', outline: 'none', padding: '5px' }}
          />
        </Box>

        {/* Position Selection and Add Button */}
        <Box className="position-selection">
          <ToggleButtonGroup
            value={selectedOption}
            exclusive
            onChange={(event, newValue) => setSelectedOption(newValue)}
            aria-label="deck selection"
          >
            <ToggleButton value="first" aria-label="first deck">First</ToggleButton>
            <ToggleButton value="second" aria-label="second deck">Second</ToggleButton>
          </ToggleButtonGroup>
          <Button variant="contained" onClick={handleAddMatch}>+ Add</Button>
        </Box>

        {/* Result Selection */}
        <Box className="result-selection">
          <ToggleButtonGroup
            value={result}
            exclusive
            onChange={(event, newValue) => setResult(newValue)}
            aria-label="result selection"
          >
            <ToggleButton value="win" aria-label="win">Win</ToggleButton>
            <ToggleButton value="lose" aria-label="lose">Lose</ToggleButton>
            <ToggleButton value="draw" aria-label="draw">Draw</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Paper style={{ padding: '16px', marginTop: '16px', backgroundColor: '#f0f0f0' }}>
        <TableContainer>
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
        </TableContainer>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
}

export default App;
