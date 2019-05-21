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
        value={List.nth(squareValues, squareIndex)}
        key={string_of_int(squareIndex)}
      />;
    };

    ReasonReact.array(
      Belt.Array.map([|0, 1, 2|], row =>
        <div className="board-row" key={string_of_int(row)}>
          {Belt.Array.map([|0, 1, 2|], col => renderSquare(3 * row + col))
           |> ReasonReact.array}
        </div>
      ),
    );
  };
};

let updateListElement = (li, index, newValue) => {
  let (head, tail) = Belt.List.splitAt(li, index) |> Belt.Option.getExn;
  head @ [newValue, ...List.tl(tail)];
};

type state = {
  squareValues: list(squareValue),
  xIsNext: bool,
};

/* Action declaration */
type action =
  | NextMove(int);

let nextMove = (state, squareIndex) => {
  Js.log("squareIndex " ++ string_of_int(squareIndex));
  if(state.xIsNext) {
    xIsNext: false,
    squareValues: updateListElement(state.squareValues, squareIndex, SquareX),
  }
  else {
    xIsNext: true,
    squareValues: updateListElement(state.squareValues, squareIndex, SquareO),
  };
};

[@react.component]
let make = (~message) => {
  let (state, dispatch) =
    React.useReducer(
      (state, action) =>
        switch (action) {
        | NextMove(squareIndex) => nextMove(state, squareIndex)
        },
      {squareValues: Belt.List.make(9, SquareEmpty), xIsNext: true},
    );

  let handleClick = (_event, squareIndex) =>
    dispatch(NextMove(squareIndex));

  <div> <Board onClick=handleClick squareValues={state.squareValues} /> </div>;
};