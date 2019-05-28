type squareValue =
  | SquareEmpty
  | SquareX
  | SquareO;

let stringOfSquareValue = value => {
  switch (value) {
  | SquareEmpty => ""
  | SquareX => "X"
  | SquareO => "O"
  };
};

type action =
  | NextMove(int)
  | JumpToHistory(int);

type state = {
  history: list((Belt.Map.Int.t(squareValue), int)),
  currentHistoryIndex: int,
};

module Square = {
  [@react.component]
  let make = (~onClick, ~value) => {
    <button className="square" onClick>
      {React.string(stringOfSquareValue(value))}
    </button>;
  };
};

module Board = {
  [@react.component]
  let make = (~onClick, ~squareValues) => {
    let renderSquare = squareIndex => {
      <Square
        onClick={evt => onClick(evt, squareIndex)}
        value={Belt.Map.Int.getWithDefault(
          squareValues,
          squareIndex,
          SquareEmpty,
        )}
        key={string_of_int(squareIndex)}
      />;
    };

    ReasonReact.array(
      Belt.Array.map([|0, 1, 2|], row =>
        <div className="board-row" key={string_of_int(row)}>
          {Belt.Array.map([|0, 1, 2|], col => renderSquare(3 * row + col))
           ->ReasonReact.array}
        </div>
      ),
    );
  };
};

let calculateWinner = squareValues => {
  let checkLine = ((i1, i2, i3)) => {
    open Belt.Map.Int;
    let (v1, v2, v3) = (
      getWithDefault(squareValues, i1, SquareEmpty),
      getWithDefault(squareValues, i2, SquareEmpty),
      getWithDefault(squareValues, i3, SquareEmpty),
    );

    if (v1 == SquareX && v2 == v1 && v3 == v1) {
      SquareX;
    } else if (v1 == SquareO && v2 == v1 && v3 == v1) {
      SquareO;
    } else {
      SquareEmpty;
    };
  };

  let lines = [|
    (0, 1, 2),
    (3, 4, 5),
    (6, 7, 8),
    (0, 3, 6),
    (1, 4, 7),
    (2, 5, 8),
    (0, 4, 8),
    (2, 4, 6),
  |];

  Belt.Array.map(lines, checkLine)
  ->Belt.Array.keep(v => v != SquareEmpty)
  ->Belt.Array.get(0)
  ->Belt.Option.getWithDefault(SquareEmpty);
};

let hasWinner = squareValues => {
  calculateWinner(squareValues) != SquareEmpty;
};

let nextPlayer = historySize =>
  if (historySize mod 2 == 0) {
    SquareX;
  } else {
    SquareO;
  };

let nextMove = (state, squareIndex) => {
  let (currentSquares, _move) =
    Belt.List.getExn(state.history, state.currentHistoryIndex);

  if (Belt.Map.Int.getWithDefault(currentSquares, squareIndex, SquareEmpty)
      != SquareEmpty
      || hasWinner(currentSquares)) {
    state;
  } else {
    let headSquares =
      Belt.List.keepWithIndex(state.history, (_value, index) =>
        index <= state.currentHistoryIndex
      );
    {
      currentHistoryIndex: state.currentHistoryIndex + 1,
      history:
        headSquares
        @ [
          (
            Belt.Map.Int.set(
              currentSquares,
              squareIndex,
              nextPlayer(Belt.List.size(headSquares) + 1),
            ),
            squareIndex,
          ),
        ],
    };
  };
};

let initEmptySquareValues = () => {
  Belt.Array.make(9, SquareEmpty)
  ->Belt.Array.mapWithIndex(_, (index, value) => (index, value))
  ->Belt.Map.Int.fromArray;
};

[@react.component]
let make = (~message) => {
  let (state, dispatch) =
    React.useReducer(
      (state, action) =>
        switch (action) {
        | NextMove(squareIndex) => nextMove(state, squareIndex)
        | JumpToHistory(historyIndex) => {
            ...state,
            currentHistoryIndex: historyIndex,
          }
        },
      {history: [(initEmptySquareValues(), (-1))], currentHistoryIndex: 0},
    );

  let handleClick = (_event, squareIndex) =>
    dispatch(NextMove(squareIndex));

  let (currentSquares, _currentMove) =
    Belt.List.getExn(state.history, state.currentHistoryIndex);

  let winner = calculateWinner(currentSquares);

  let statusDisplay =
    if (winner != SquareEmpty) {
      "Winner: " ++ stringOfSquareValue(winner);
    } else {
      "Next player: "
      ++ stringOfSquareValue(nextPlayer(state.currentHistoryIndex));
    };

  let moves =
    Belt.List.mapWithIndex(
      state.history,
      (index, (_squareValues, move)) => {
        let row = move / 3;
        let col = move mod 3;
        let moveString =
          "(" ++ string_of_int(row) ++ ", " ++ string_of_int(col) ++ ")";

        let moveDisplay =
          if (index == 0) {
            React.string("Go to game start");
          } else {
            React.string(
              "Go to move #" ++ string_of_int(index) ++ " " ++ moveString,
            );
          };

        <li key={string_of_int(index)}>
          <button onClick={_event => dispatch(JumpToHistory(index))}>
            {if (index == state.currentHistoryIndex) {
               <b> moveDisplay </b>;
             } else {
               moveDisplay;
             }}
          </button>
        </li>;
      },
    )
    ->Belt.List.toArray;

  <div className="game">
    <div className="game-board">
      <Board onClick=handleClick squareValues=currentSquares />
    </div>
    <div className="game-info">
      <div> {React.string(statusDisplay)} </div>
      <div> {React.array(moves)} </div>
    </div>
  </div>;
};