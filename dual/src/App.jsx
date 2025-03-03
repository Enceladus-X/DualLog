import React, { useState, useEffect } from 'react';

function App() {
  const [yourDeck, setYourDeck] = useState('');
  const [opponentDeck, setOpponentDeck] = useState('');
  const [selectedOption, setSelectedOption] = useState('first');
  const [result, setResult] = useState('win');
  const [matches, setMatches] = useState(() => {
    const storedMatches = localStorage.getItem('matches');
    return storedMatches ? JSON.parse(storedMatches) : [];
  });
  const [totalGames, setTotalGames] = useState(0);
  const [winRate, setWinRate] = useState(0);

  useEffect(() => {
    const currentTotalGames = matches.length;
    setTotalGames(currentTotalGames);
    const wins = matches.filter(match => match.result === 'win').length;
    setWinRate(currentTotalGames > 0 ? (wins / currentTotalGames) * 100 : 0);
  }, [matches]);

  const handleAddMatch = () => {
    const newMatch = {
      yourDeck,
      opponentDeck,
      position: selectedOption,
      result,
    };
    const updatedMatches = [...matches, newMatch];
    setMatches(updatedMatches);
    localStorage.setItem('matches', JSON.stringify(updatedMatches));
    setOpponentDeck('');
    setResult('win');
    setSelectedOption('first');
  };

  const handleClearAll = () => {
    setMatches([]);
    localStorage.removeItem('matches');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Game Tracker</h1>

      {/* Input Section */}
      <div className="input-section flex mb-2">
        {/* 왼쪽 덱 입력 박스 */}
        <div className="left-deck-input w-1/2 pr-2">
          <input
            type="text"
            placeholder="Your Deck"
            value={yourDeck}
            onChange={(e) => setYourDeck(e.target.value)}
            className="w-full h-12 border border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
          />
        </div>

        {/* 오른쪽 덱 입력 박스 */}
        <div className="right-deck-input w-1/2 pl-2">
          <input
            type="text"
            placeholder="Opponent Deck"
            value={opponentDeck}
            onChange={(e) => setOpponentDeck(e.target.value)}
            className="w-full h-12 border border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
          />
        </div>
      </div>

      {/* Position Selection and Result Selection */}
      <div className="flex mb-2">
        <div className="flex-1 mr-1">
          <button
            onClick={() => setSelectedOption('first')}
            className={`w-full border border-gray-300 rounded-none shadow-sm p-2 text-lg font-bold ${selectedOption === 'first' ? 'bg-blue-400 text-white' : 'bg-white'}`}
          >
            FIRST
          </button>
        </div>
        <div className="flex-1 ml-1">
          <button
            onClick={() => setSelectedOption('second')}
            className={`w-full border border-gray-300 rounded-none shadow-sm p-2 text-lg font-bold ${selectedOption === 'second' ? 'bg-red-400 text-white' : 'bg-white'}`}
          >
            SECOND
          </button>
        </div>
      </div>

      <div className="flex mb-2">
        <div className="flex-1 mr-1">
          <button
            onClick={() => setResult('win')}
            className={`w-full border border-gray-300 rounded-none shadow-sm p-2 text-lg font-bold ${result === 'win' ? 'bg-blue-400 text-white' : 'bg-white'}`}
          >
            WIN
          </button>
        </div>
        <div className="flex-1 ml-1">
          <button
            onClick={() => setResult('lose')}
            className={`w-full border border-gray-300 rounded-none shadow-sm p-2 text-lg font-bold ${result === 'lose' ? 'bg-red-400 text-white' : 'bg-white'}`}
          >
            LOSE
          </button>
        </div>
        <div className="flex-1 ml-1">
          <button
            onClick={() => setResult('draw')}
            className={`w-full border border-gray-300 rounded-none shadow-sm p-2 text-lg font-bold ${result === 'draw' ? 'text-yellow-600' : 'bg-white'}`}
          >
            DRAW
          </button>
        </div>
      </div>

      <button onClick={handleAddMatch} className="bg-blue-400 text-white p-2 rounded-none w-full text-lg font-bold">
        ADD
      </button>

      <div className="mb-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm font-medium">Total Games</p>
            <p className="text-2xl font-bold">{totalGames}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm font-medium">Win Rate</p>
            <p className="text-2xl font-bold">{winRate.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      <div className="mb-6 overflow-y-auto" style={{ maxHeight: '300px' }}>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left font-bold">Your Deck</th>
              <th className="p-3 text-left font-bold">Opponent</th>
              <th className="p-3 text-left font-bold">Position</th>
              <th className="p-3 text-left font-bold">Result</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr key={index} className={`border-b ${match.result === 'win' ? 'bg-blue-100' : match.result === 'lose' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                <td className="p-3 font-bold">{match.yourDeck}</td>
                <td className="p-3 font-bold">{match.opponentDeck}</td>
                <td className={`p-3 font-bold ${match.position === 'first' ? 'text-blue-600' : 'text-red-600'}`}>{match.position.toUpperCase()}</td>
                <td className={`p-3 font-bold ${match.result === 'win' ? 'text-blue-600' : 'text-red-600'}`}>{match.result.toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={handleClearAll} className="bg-red-500 text-white p-2 rounded-none w-full text-lg font-bold mt-2">
        CLEAR ALL
      </button>
    </div>
  );
}

export default App;