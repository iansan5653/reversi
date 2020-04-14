import React from "react";
import "./App.css";
import * as R from "./reversiUtils";

const Piece = ({ team }: { team: R.Team }) => (
  <div className="Piece" style={{ backgroundColor: team }} />
);

const Square = ({
  status,
  location,
  onClick,
}: {
  status: R.StatusOrValid;
  location: R.Coordinates;
  onClick: (location: R.Coordinates) => void;
}) =>
  status === "valid" ? (
    <button onClick={() => onClick(location)} className={`Square valid`} />
  ) : (
    <div className={`Square`}>
      {(status === R.b || status === R.w) && <Piece team={status} />}
    </div>
  );

const Board = ({ children }: { children: React.ReactNode }) => (
  <div className="Board">{children}</div>
);

interface AppState {
  gameStatus: R.GameStatus;
  currentTeam: R.Team;
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    gameStatus: R.copyGame(R.gameSetup),
    currentTeam: R.b,
  };

  private attemptMove = (location: R.Coordinates) => {
    const cellStatus = R.getStatusAt(this.state.gameStatus, location);
    if (cellStatus === R.x) {
      const wouldBeFlipped = R.collectFlippedByMove(
        this.state.gameStatus,
        location,
        this.state.currentTeam
      );

      if (wouldBeFlipped.length > 0) {
        const grid = R.copyGame(this.state.gameStatus);

        [location, ...wouldBeFlipped].forEach(
          (cell) => (grid[cell.row][cell.column] = this.state.currentTeam)
        );

        this.setState({
          gameStatus: grid,
          currentTeam: R.getOtherTeam(this.state.currentTeam),
        });
      }
    }
  };

  public render(): React.ReactNode {
    const statusesWithValid = R.getGameStatusWithValidMoves(
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
