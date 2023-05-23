import React, { useState } from "react"; //important to have this as useState will throw error usesate not defined no-undef
import { Redirect } from "react-router-dom";
import uuid from "uuid/v4";
import { ColorContext } from "../context/colorcontext";
const socket = require("../connection/socket").socket;

/**
 * Onboard is where we create the game room.
 */

class CreateNewGame extends React.Component {
  state = {
    didGetUserName: false,
    inputText: "",
    gameId: "",
    isTournament: false,
    tournamentId: "",
  };

  constructor(props) {
    super(props);
    this.textArea = React.createRef();
  }

  send = () => {
    /**
     * This method should create a new room in the '/' namespace
     * with a unique identifier.
     */
    const newGameRoomId = uuid();

    // set the state of this component with the gameId so that we can
    // redirect the user to that URL later.
    if (this.state.isTournament) {
      this.setState({
        tournamentId: newGameRoomId,
      });
      socket.emit("createNewTournamentGame", newGameRoomId);
    } else {
      this.setState({
        gameId: newGameRoomId,
      });
      socket.emit("createNewGame", newGameRoomId);
    }

    // emit an event to the server to create a new room
   // socket.emit("createNewGame", newGameRoomId);
    // socket.emit('setGsmeDetails', playerCount)
  };

  typingUserName = () => {
    // grab the input text from the field from the DOM
    const typedText = this.textArea.current.value;

    // set the state with that text
    this.setState({
      inputText: typedText,
    });
  };

  render() {
    // !!! TODO: edit this later once you have bought your own domain.

    return (
      <React.Fragment>
        {this.state.didGetUserName ? (
          <Redirect
            to={
              this.state.isTournament
                ? "/tournament/" + this.state.tournamentId
                : "/game/" + this.state.gameId
            }
          >
            <button
              className="btn btn-success"
              style={{
                marginLeft: String(window.innerWidth / 2 - 60) + "px",
                width: "120px",
              }}
            >
              Start Game
            </button>
          </Redirect>
        ) : (
          <div>
            <input
              type="radio"
              //checked={value === true}
              onChange={() => this.setState({ isTournament: true })}
              style={{
                marginLeft: String(window.innerWidth / 2 - 120) + "px",
              }}
            ></input>
            Tournament
            <br></br>
            <input
              placeholder="Type username here"
              style={{
                marginLeft: String(window.innerWidth / 2 - 120) + "px",
                width: "240px",
                marginTop: "62px",
              }}
              ref={this.textArea}
              onInput={this.typingUserName}
            ></input>
            <button
              className="btn btn-primary"
              style={{
                marginLeft: String(window.innerWidth / 2 - 60) + "px",
                width: "120px",
                marginTop: "62px",
              }}
              disabled={!(this.state.inputText.length > 0)}
              onClick={() => {
                // When the 'Submit' button gets pressed from the username screen,
                // We should send a request to the server to create a new room with
                // the uuid we generate here.
                this.props.didRedirect();
                this.props.setUserName(this.state.inputText);
                this.setState({
                  didGetUserName: true,
                });

                this.send();
              }}
            >
              Submit
            </button>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const Onboard = (props) => {
  const color = React.useContext(ColorContext);

  return (
    <CreateNewGame
      didRedirect={color.playerDidRedirect}
      setUserName={props.setUserName}
    />
  );
};

export default Onboard;
