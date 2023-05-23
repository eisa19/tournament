import React, { useState } from "react";
import { useParams } from "react-router-dom";
const socket = require("../connection/socket").socket;

var x = [];

const JoinTournamentGameRoom = (tournamentId, userName, isCreator) => {
  console.log("join", userName);
  const tidData = {
    tournamentId: tournamentId,
    userName: userName,
    isCreator: isCreator,
  };
  socket.emit("playerJoinTournament", tidData);
};

const JoinTournament = (props) => {
  const { tournamentid } = useParams();
  const [tournamentLobby, setTournamentLobby] = useState([]);

  //   const handleChange = (event) => {
  //     setText(event.target.value);
  //   }

  //   socket.on('tournament-lobby-data', (data) => {
  //     console.log("a" +data); // Log the data received from the server
  //     // Update your UI with the received data
  //   });

  socket.on("tournament-lobby-data", (tournamentLobby) => {
    console.log(tournamentLobby);
    x = tournamentLobby;

    // Do something with the tournamentLobby array
  });
  //   socket.on('gamelobby', (tournamentLobbyData) => {
  //     setTournamentLobby(tournamentLobbyData);
  //   });

  JoinTournamentGameRoom(tournamentid, props.userName, props.isCreator);

  console.log(tournamentLobby);
  console.log(x);

  return (
    <div>
      <hr />
      {tournamentLobby.length > 0 && (
        <>
          <h2>Tournament Lobby:</h2>
          <ol>
            {tournamentLobby.map((playerName, index) => (
              <li key={index}>{playerName}</li>
            ))}
          </ol>
        </>
      )}
      <hr />
      <h1 style={{ textAlign: "center" }}>Welcome to Chess with Friend!</h1>
      <h3 style={{ textAlign: "center" }}>
        Made with ❤️ by{" "}
        <a href="https://Unavailable/" target="_blank">
          J
        </a>
        . Subscribe to my{" "}
        <a href="https://unavailable/" target="_blank">
          YouTube channel
        </a>
        . Follow me on{" "}
        <a href="https://unavailable" target="_blank">
          Instagram
        </a>
        .
      </h3>
      <hr />
    </div>
  );
};

export default JoinTournament;
