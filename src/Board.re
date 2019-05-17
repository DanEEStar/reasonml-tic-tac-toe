[@react.component]
let make = (~onClick) => {
  let renderSquare = (squareIndex) => {
    <Square onClick={(evt) => onClick(evt, squareIndex)} key={string_of_int(squareIndex)}/>
  };

  ReasonReact.array(
    Belt.Array.map([|0, 1, 2|], row =>
      <div className="board-row" key={string_of_int(row)}>
        {Belt.Array.map([|0, 1, 2|], col => renderSquare(3 * row + col)) |> ReasonReact.array}
      </div>
    ),
  )
};