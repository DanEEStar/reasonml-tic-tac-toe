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

type state = {
  squareValues: Belt.Map.Int.t(squareValue),
  xIsNext: bool,
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

  let lines = [
    (0, 1, 2),
    (3, 4, 5),
    (6, 7, 8),
    (0, 3, 6),
    (1, 4, 7),
    (2, 5, 8),
    (0, 4, 8),
    (2, 4, 6),
  ];

  Belt.List.map(lines, checkLine)
  ->Belt.List.keep(v => v != SquareEmpty)
  ->Belt.List.head
  ->Belt.Option.getWithDefault(SquareEmpty);
};

let hasWinner = squareValues => {
  calculateWinner(squareValues) != SquareEmpty;
};

/* Action declaration */
type action =
  | NextMove(int);

let nextMove = (state, squareIndex) => {
  Js.log("squareIndex " ++ string_of_int(squareIndex));
  if (Belt.Map.Int.getWithDefault(
        state.squareValues,
        squareIndex,
        SquareEmpty,
      )
      != SquareEmpty
      || hasWinner(state.squareValues)) {
    state;
  } else if (state.xIsNext) {
    {
      xIsNext: false,
      squareValues:
        Belt.Map.Int.set(state.squareValues, squareIndex, SquareX),
    };
  } else {
    {
      xIsNext: true,
      squareValues:
        Belt.Map.Int.set(state.squareValues, squareIndex, SquareO),
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
        },
      {squareValues: initEmptySquareValues(), xIsNext: true},
    );

  let handleClick = (_event, squareIndex) =>
    dispatch(NextMove(squareIndex));

  let winner = calculateWinner(state.squareValues);

  let statusDisplay =
    if (winner != SquareEmpty) {
      "Winner: " ++ stringOfSquareValue(winner);
    } else {
      "Next player: "
      ++ (
        if (state.xIsNext) {
          "X";
        } else {
          "O";
        }
      );
    };

  <div className="game">
    <div className="game-board">
      <Board onClick=handleClick squareValues={state.squareValues} />
    </div>
    <div className="game-info">
      <div> {React.string(statusDisplay)} </div>
    </div>
  </div>;
};