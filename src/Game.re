type state = {
  squareValues: list(string),
  xIsNext: bool,
};

/* Action declaration */
type action =
  | NextMove(int);


let nextMove = (state, squareIndex) => {
  Js.log("squareIndex " ++ string_of_int(squareIndex));
  state;
};

[@react.component]
let make = (~message) => {

  let (state, dispatch) =
    React.useReducer(
      (state, action) =>
        switch (action) {
        | NextMove(squareIndex) => nextMove(state, squareIndex)
        },
      {squareValues: Belt.List.make(9, ""), xIsNext: true}
    );

  let handleClick = (_event, squareIndex) => dispatch(NextMove(squareIndex));

  <div>
    <Board onClick={handleClick}/>
  </div>
}
