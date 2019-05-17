import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

function Board(props) {
  function renderSquare(i) {
    return (
    <Square
      key={i}
      value={props.squares[i]}
      onClick={() => props.onClick(i)}
      />
    )
  }

  return [...Array(3).keys()].map(row => {
    return (
      <div className="board-row" key={row}>
        {[...Array(3).keys()].map(col => {
          return renderSquare(3 * row + col);
        })}
      </div>
    );
  });
}

const initialState = {
  history: [{
    squares: Array(9).fill(null),
  }],
  locations: [],
  stepNumber: 0,
  xIsNext: true,
};

function nextMove(state, squareIndex) {
  const history = state.history.slice(0, state.stepNumber + 1);
  const current = history[history.length - 1];
  const squares = current.squares.slice();

  if(calculateWinner(squares) || squares[squareIndex]) {
    return;
  }

  squares[squareIndex] = state.xIsNext ? 'X' : 'O';
  return {
    history: history.concat([{
      squares: squares,
    }]),
    locations: [...state.locations.slice(0, state.stepNumber), squareIndex],
    stepNumber: history.length,
    xIsNext: !state.xIsNext,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'nextMove':
      return nextMove(state, action.squareIndex);
    case 'jumpToHistory':
      return {
        ...state,
        stepNumber: action.step,
        xIsNext: (action.step % 2) === 0,
      }
    default:
      throw new Error();
  }
}

function Game() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function render() {
    const history = state.history;
    const current = history[state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const location = state.locations[move-1];
      const row = Math.floor(location / 3);
      const col = location % 3;
      const desc = move ?
        `Go to move #${move} (${row}, ${col})` :
        'Go to game start';
      return (
        <li key={move}>
          {state.stepNumber === move ? (
            <button onClick={() => dispatch({type: 'jumpToHistory', step: move})}><b>{desc}</b></button>
          ) : (
            <button onClick={() => dispatch({type: 'jumpToHistory', step: move})}>{desc}</button>
          )}
        </li>
      );
    });

    let status;
    if(winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => dispatch({type: 'nextMove', squareIndex: i})}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  return render();
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}