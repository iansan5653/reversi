import React from "react";
import "./App.css";
import * as RU from "./reversiUtils";

const Piece = ({ team }: { team: RU.Team }) => (
  <div className="Piece" style={{ backgroundColor: team }} />
);

const Square = ({
  status,
  location,
  onClick,
}: {
  status: RU.StatusOrValid;
  location: RU.Coordinates;
  onClick: (location: RU.Coordinates) => void;
}) => (
  <div onClick={() => onClick(location)} className={`Square ${status}`}>
    {(status === RU.b || status === RU.w) && <Piece team={status} />}
  </div>
);

const Board = ({ children }: { children: React.ReactNode }) => (
  <div className="Board">{children}</div>
);

interface AppState {
  gameStatus: RU.GameStatus;
  currentTeam: RU.Team;
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    gameStatus: RU.copyGame(RU.gameSetup),
    currentTeam: RU.b,
  };

  private attemptMove = (location: RU.Coordinates) => {
    const cellStatus = RU.getStatusAt(this.state.gameStatus, location);
    if (cellStatus === RU.x) {
      const wouldBeFlipped = RU.collectFlippedByMove(
        this.state.gameStatus,
        location,
        this.state.currentTeam
      );

      if (wouldBeFlipped.length > 0) {
        const grid = RU.copyGame(this.state.gameStatus);

        [location, ...wouldBeFlipped].forEach(
          (cell) => (grid[cell.row][cell.column] = this.state.currentTeam)
        );

        this.setState({
          gameStatus: grid,
          currentTeam: RU.getOtherTeam(this.state.currentTeam),
        });
      }
    }
  };

  public render(): React.ReactNode {
    const statusesWithValid = RU.getGameStatusWithValidMoves(
      this.state.gameStatus,
      this.state.currentTeam
    );
    return (
      <div className="App" style={{ backgroundColor: this.state.currentTeam }}>
        <Board>
          {statusesWithValid.map((row_statuses, row) =>
            row_statuses.map((square, column) => (
              <Square
                key={`${row}_${column}`}
                location={{ row, column }}
                onClick={this.attemptMove}
                status={square}
              />
            ))
          )}
        </Board>
      </div>
    );
  }
}

export default App;
