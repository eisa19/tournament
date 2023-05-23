//
/**
 * Here is where we should register event listeners and emitters.
 */

//const { mySocketId } = require("../frontend-work/src/connection/socket")

var io;
var gameSocket;
// gamesInSession stores an array of all active socket connections
var gamesInSession = [];

const initializeGame = (sio, socket) => {
  /**
   * initializeGame sets up all the socket event listeners.
   */

  // initialize global variables.
  io = sio;
  gameSocket = socket;

  // pushes this socket to an array which stores all the active sockets.
  gamesInSession.push(gameSocket);

  // Run code when the client disconnects from their socket session.
  gameSocket.on("disconnect", onDisconnect);

  // Sends new move to the other socket session in the same room.
  gameSocket.on("new move", newMove);


// Sends new move to the corresponding socket session in the same room.
  gameSocket.on("new tournamentmove", newTournamentMove);

  // User creates new game room after clicking 'submit' on the frontend
  gameSocket.on("createNewGame", createNewGame);

  gameSocket.on("createNewTournamentGame", createNewTournamentGame);
  

  // User joins gameRoom after going to a URL with '/game/:gameId'
  gameSocket.on("playerJoinGame", playerJoinsGame);

  
  // User joins gameRoom after going to a URL with '/tournament/:tournamentId'
  gameSocket.on("playerJoinTournament", playerJoinsTournament);

  gameSocket.on("request username", requestUserName);

  gameSocket.on("recieved userName", recievedUserName);

  gameSocket.on("request tournamentusername", requesttournamentUserName);

  gameSocket.on("recieved tournamentuserName", recievedtournamentUserName);

  // register event listeners for video chat app:
  videoChatBackend();
};

function videoChatBackend() {
  // main function listeners
  gameSocket.on("callUser", (data) => {
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  gameSocket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
}

function playerJoinsGame(idData) {
  /**
   * Joins the given socket to a session with it's gameId
   */

  // A reference to the player's Socket.IO socket object
  var sock = this;

  // Look up the room ID in the Socket.IO manager object.
  var room = io.sockets.adapter.rooms[idData.gameId];

   console.log(room)

  // If the room exists...
  if (room === undefined) {
    this.emit("status", "This game session does not exist.");
    return;
  }
  if (room.length < 2) {
    // attach the socket id to the data object.
    idData.mySocketId = sock.id;

    // Join the room
    sock.join(idData.gameId);

    console.log("The room size using J's logic:", room.length);
    console.log("roomID from J's logic:", idData.gameId);

    if (room.length === 2) {
      io.sockets.in(idData.gameId).emit("start game", idData.userName);
    }

    // Emit an event notifying the clients that the player has joined the room.
    io.sockets.in(idData.gameId).emit("playerJoinedRoom", idData);
  } else {
    // Otherwise, send an error message back to the player.
    this.emit("status", "There are already 2 people playing in this room.");
  }
}

function playerJoinsTournament(tidData) {
  /**
   * Joins the given socket to a session with it's gameId
   */

  // A reference to the player's Socket.IO socket object
  var sock = this;

  // Look up the room ID in the Socket.IO manager object.
  var room = io.sockets.adapter.rooms[tidData.tournamentId];

   console.log(room)

  // If the room exists...
  if (room === undefined) {
   
    this.emit("status", "This game session does not exist at this time.");
    return;
  }
  if (room.length < 4) {
    // attach the socket id to the data object.
    tidData.mySocketId = sock.id;

    // Join the room
    sock.join(tidData.tournamentId);

    console.log("The room size using J's logic:", room.length);
    console.log("roomID from J's logic:", tidData.tournamentId);

    if (room.length === 4) {
      io.sockets.in(tidData.tournamentId).emit("start tournament", tidData.userName);
    }

    // Emit an event notifying the clients that the player has joined the room.
    io.sockets.in(tidData.tournamentId).emit("playerJoinedTournament", tidData);
  } else {
    // Otherwise, send an error message back to the player.
    this.emit("status", "There are already 2 people playing in this room.");
  }
}



function createNewGame(gameId) {
  // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
  this.emit("createNewGame", { gameId: gameId, mySocketId: this.id });
  //need to modify this to send if this a tournament that's being created. 
  //push 
  // Join the Room and wait for the other player
  this.join(gameId);
}

function createNewTournamentGame(tournamentId) {
  // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
  this.emit("createNewTournamentGame", { tournamentId: tournamentId, mySocketId: this.id });
  //need to modify this to send if this a tournament that's being created. 
  //push 
  // Join the Room and wait for the other player
  this.join(tournamentId);
}

function newMove(move) {
  /**
   * First, we need to get the room ID in which to send this message.
   * Next, we actually send this message to everyone except the sender
   * in this room.
   */

  const gameId = move.gameId;

  io.to(gameId).emit("opponent move", move);
}

function newTournamentMove(move) {
  /**
   * First, we need to get the room ID in which to send this message.
   * Next, we actually send this message to everyone except the sender
   * in this room.
   */

  const tournamentId = move.tournamentId;

  io.to(tournamentId).emit("opponent move", move);
}

function onDisconnect() {
  var i = gamesInSession.indexOf(gameSocket);
  gamesInSession.splice(i, 1);
}

function requestUserName(gameId) {
  io.to(gameId).emit("give userName", this.id);
}

function recievedUserName(data) {
  data.socketId = this.id;
  io.to(data.gameId).emit("get Opponent UserName", data); //change back to gameId
}


function requesttournamentUserName(tournamentId) {
  io.to(tournamentId).emit("give userName", this.id);
}

function recievedtournamentUserName(data) {
  data.socketId = this.id;
  io.to(data.tournamentId).emit("get Opponent UserName", data); //change back to gameId
}

exports.initializeGame = initializeGame;
