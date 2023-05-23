import io from 'socket.io-client'

const URL =  'http://localhost:8000'//'https://multiplayer-chess-game-app.herokuapp.com/' 

const socket = io(URL)

var mySocketId
// register preliminary event listeners here:


socket.on("createNewGame", statusUpdate => {
    console.log("A new game has been created! Username: " + statusUpdate.userName + ", Game id: " + statusUpdate.gameId + " Socket id: " + statusUpdate.mySocketId)
    mySocketId = statusUpdate.mySocketId
})


socket.on("createNewTournamentGame", statusUpdate => {
    console.log("A new tournament game has been created! Username: " + statusUpdate.userName + ", Game id: " + statusUpdate.tournamentId + " Socket id: " + statusUpdate.mySocketId)
    mySocketId = statusUpdate.mySocketId
})



export {
    socket,
    mySocketId
}