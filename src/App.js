import React, { useState } from "react";
import JoinGame from "./components/JoinGame";
import WaitingForPlayers from "./components/WaitingForPlayers";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [gameStatus, setGameStatus] = useState(null);

  if (!currentUser) {
    return (
      <JoinGame
        setCurrentUser={setCurrentUser}
        setGameId={setGameId}
        setGameStatus={setGameStatus}
      />
    );
  }

  if (gameStatus === "waiting for players") {
    return (
      <WaitingForPlayers
        gameId={gameId}
        currentUser={currentUser}
        setGameStatus={setGameStatus}
      />
    );
  }

  // Add other game pages here (e.g. Game, Game Over)

  return <div>Error: Invalid game status</div>;
}

export default App;
