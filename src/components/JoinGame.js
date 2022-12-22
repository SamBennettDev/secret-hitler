import React, { useState } from "react";
import { db } from "../firebase";
import {
  setDoc,
  getDoc,
  doc,
  arrayUnion,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

function generateRandomGameId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += characters[Math.floor(Math.random() * characters.length)];
  }
  return code;
}

function JoinGame(props) {
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState("");
  const [isJoining, setIsJoining] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isJoining) {
      // Add the user to the players array in the game document
      updateDoc(doc(db, "games", gameId), {
        players: arrayUnion(name),
      });
      props.setCurrentUser(name);
      props.setGameId(gameId);
      // Get the current game status from the database and update the app state
      getDoc(doc(db, "games", gameId)).then((snapshot) => {
        props.setGameStatus(snapshot.data().status);
      });
    } else {
      // Create a new game document with the host's name and a random game ID
      const newGameId = generateRandomGameId();
      setDoc(doc(db, "games", newGameId), {
        host: name,
        players: [name],
        status: "waiting for players",
        createdAt: serverTimestamp(),
      });
      props.setCurrentUser(name);
      props.setGameId(newGameId);
      props.setGameStatus("waiting for players");
    }
  };

  return (
    <div>
      {isJoining ? (
        <form onSubmit={handleSubmit}>
          <h1>Join a Game</h1>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label>
            Game ID:
            <input
              type="text"
              value={gameId}
              onChange={(event) => setGameId(event.target.value)}
            />
          </label>
          <input type="submit" value="Join Game" />
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <h1>Create a Game</h1>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <input type="submit" value="Create Game" />
        </form>
      )}
      <label>
        <input
          type="checkbox"
          checked={isJoining}
          onChange={(event) => setIsJoining(event.target.checked)}
        />
        Join an existing game
      </label>
    </div>
  );
}

export default JoinGame;
