/*
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
  */
[@react.component]
let make = (~onClick) =>
  <button className="square" onClick={onClick}>
  </button>