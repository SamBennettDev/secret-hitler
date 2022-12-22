import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";

function WaitingForPlayers(props) {
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const gameId = props.gameId;

  useEffect(() => {
    const q = query(collection(db, "games"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let game = null;
      querySnapshot.forEach((doc) => {
        if (doc.id === props.gameId) {
          game = { ...doc.data(), id: doc.id };
        }
      });
      setGame(game);
      setPlayers(game.players);
    });
    return () => unsubscribe();
  }, [props.gameId]);

  const handleStartGame = () => {
    collection(db, "games").doc(props.gameId).update({
      status: "in progress",
    });
  };

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Waiting for Players</h1>
      <p>Players: {players.join(", ")}</p>
      <p>{gameId}</p>
      {game.host === props.currentUser &&
      players.length >= 5 &&
      players.length <= 10 ? (
        <button onClick={handleStartGame}>Start Game</button>
      ) : null}
    </div>
  );
}

export default WaitingForPlayers;
