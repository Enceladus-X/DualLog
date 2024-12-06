import React, { useState } from "react";

function App() {
  const [yourDeck, setYourDeck] = useState("");
  const [opponentDeck, setOpponentDeck] = useState("");
  const [position, setPosition] = useState("");
  const [result, setResult] = useState("");
  const [records, setRecords] = useState([]);

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!yourDeck || !opponentDeck || !position || !result) {
      alert("모든 필드를 입력하세요.");
      return;
    }

    const newRecord = { yourDeck, opponentDeck, position, result };
    setRecords([...records, newRecord]);
    setYourDeck("");
    setOpponentDeck("");
    setPosition("");
    setResult("");
  };

  const clearRecords = () => {
    setRecords([]);
  };

  return (
    <div className="w-[360px] p-4 bg-white shadow-sm font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-900">Card Game Tracker</h1>
        <button className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-redo-alt"></i>
        </button>
      </header>

      {/* Form */}
      <form onSubmit={handleAddRecord} className="space-y-3 mb-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={yourDeck}
            onChange={(e) => setYourDeck(e.target.value)}
            placeholder="Your Deck"
            className="w-full h-9 px-3 text-sm border border-gray-300 rounded focus:border-custom focus:ring-1 focus:ring-custom"
          />
          <input
            type="text"
            value={opponentDeck}
            onChange={(e) => setOpponentDeck(e.target.value)}
            placeholder="Opponent Deck"
            className="w-full h-9 px-3 text-sm border border-gray-300 rounded focus:border-custom focus:ring-1 focus:ring-custom"
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="space-x-3">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="position"
                value="First"
                checked={position === "First"}
                onChange={(e) => setPosition(e.target.value)}
                className="text-custom focus:ring-custom h-4 w-4"
              />
              <span className="ml-2">First</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="position"
                value="Second"
                checked={position === "Second"}
                onChange={(e) => setPosition(e.target.value)}
                className="text-custom focus:ring-custom h-4 w-4"
              />
              <span className="ml-2">Second</span>
            </label>
          </div>
          <button
            type="submit"
            className="bg-custom text-white px-4 h-8 text-sm rounded hover:bg-custom/90"
          >
            <i className="fas fa-plus mr-1"></i> Add
          </button>
        </div>

        <div className="flex space-x-4 text-sm">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="result"
              value="Win"
              checked={result === "Win"}
              onChange={(e) => setResult(e.target.value)}
              className="text-custom focus:ring-custom h-4 w-4"
            />
            <span className="ml-2">Win</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="result"
              value="Lose"
              checked={result === "Lose"}
              onChange={(e) => setResult(e.target.value)}
              className="text-custom focus:ring-custom h-4 w-4"
            />
            <span className="ml-2">Lose</span>
          </label>
        </div>
      </form>

      {/* Summary */}
      <div className="flex justify-between text-sm bg-gray-50 p-3 rounded-lg mb-4">
        <div>
          <span className="text-gray-600">Total Games:</span>
          <span className="font-medium ml-1">{records.length}</span>
        </div>
        <div>
          <span className="text-gray-600">Win Rate:</span>
          <span className="font-medium ml-1">
            {records.length > 0
              ? (
                  (records.filter((r) => r.result === "Win").length /
                    records.length) *
                  100
                ).toFixed(2) + "%"
              : "0%"}
          </span>
        </div>
      </div>

      {/* Records Table */}
      <div className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-500 border-b-2 border-gray-300">
                Your Deck
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 border-b-2 border-gray-300">
                Opponent
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 border-b-2 border-gray-300">
                Position
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 border-b-2 border-gray-300">
                Result
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.map((record, index) => (
              <tr key={index}>
                <td className="px-3 py-2 border-b border-gray-200">{record.yourDeck}</td>
                <td className="px-3 py-2 border-b border-gray-200">{record.opponentDeck}</td>
                <td className="px-3 py-2 border-b border-gray-200">{record.position}</td>
                <td
                  className={`px-3 py-2 border-b border-gray-200 ${
                    record.result === "Win"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {record.result}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 text-right">
        <button
          onClick={clearRecords}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          <i className="fas fa-trash-alt mr-1"></i> Clear All
        </button>
      </div>
    </div>
  );
}

export default App;
