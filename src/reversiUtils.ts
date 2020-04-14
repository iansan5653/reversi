export const x = "empty";
export const b = "black";
export const w = "white";

export type Team = typeof b | typeof w;
export type Status = typeof x | Team;
export type GameStatus = Status[][];

export const valid = "valid";
export type StatusOrValid = Status | typeof valid;
export type GameStatusWithValid = (StatusOrValid)[][];

export const gameSetup: GameStatus = [
  [x, x, x, x, x, x, x, x],
  [x, x, x, x, x, x, x, x],
  [x, x, x, x, x, x, x, x],
  [x, x, x, b, w, x, x, x],
  [x, x, x, w, b, x, x, x],
  [x, x, x, x, x, x, x, x],
  [x, x, x, x, x, x, x, x],
  [x, x, x, x, x, x, x, x],
];

export interface Coordinates {
  row: number;
  column: number;
}

export function copyGame(game: GameStatus): GameStatus {
  return game.map((row) => [...row]);
}

export function getStatusAt(
  game: GameStatus,
  { row, column }: Coordinates
): Status {
  return game[row]?.[column];
}

export function getOtherTeam(team: Team): Team {
  return team === w ? b : w;
}

function collectFlippedByMoveInDirection(
  game: GameStatus,
  fromLocation: Coordinates,
  byTeam: Team,
  direction: { x: 1 | 0 | -1; y: 1 | 0 | -1 }
): Coordinates[] {
  const flipped: Coordinates[] = [];

  const next = (current: Coordinates): Coordinates => ({
    row: current.row + direction.x * 1,
    column: current.column + direction.y * 1,
  });

  const otherTeam: Team = getOtherTeam(byTeam);

  let currentLocation = next(fromLocation);
  let currentStatus = getStatusAt(game, currentLocation);
  while (currentStatus === otherTeam) {
    flipped.push(currentLocation);
    currentLocation = next(currentLocation);
    currentStatus = getStatusAt(game, currentLocation);
  }

  if (currentStatus === x || currentStatus === undefined) {
    return [];
  }

  return flipped;
}

export function collectFlippedByMove(
  game: GameStatus,
  location: Coordinates,
  byTeam: Team
): Coordinates[] {
  const flipped: Coordinates[] = [];
  const factors = [1, 0, -1] as const;

  if (getStatusAt(game, location) !== x) return [];

  factors.forEach((x) =>
    factors.forEach((y) =>
      flipped.push(
        ...collectFlippedByMoveInDirection(game, location, byTeam, {
          x,
          y,
        })
      )
    )
  );

  return flipped;
}

function isMoveValid(
  game: GameStatus,
  location: Coordinates,
  byTeam: Team
): boolean {
  const factors = [1, 0, -1] as const;

  if (getStatusAt(game, location) !== x) return false;

  for (const x of factors) {
    for (const y of factors) {
      if (
        collectFlippedByMoveInDirection(game, location, byTeam, { x, y }).length
      ) {
        return true;
      }
    }
  }

  return false;
}

export function getGameStatusWithValidMoves(
  game: GameStatus,
  byTeam: Team
): GameStatusWithValid {
  return game.map((row_statuses, row) =>
    row_statuses.map((status, column) =>
      isMoveValid(game, { row, column }, byTeam) ? valid : status
    )
  );
}

export function getScore(game: GameStatus): Record<Team, number> {
  const result = {[b]: 0, [w]: 0};
  game.forEach(row => row.forEach(cellStatus => {
    if(cellStatus === b) result[b]++;
    else if(cellStatus === w) result[w]++;
  }));
  return result;
}
