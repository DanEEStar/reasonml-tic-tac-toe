// Generated by BUCKLESCRIPT VERSION 5.0.4, PLEASE EDIT WITH CARE
'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Belt_List = require("bs-platform/lib/js/belt_List.js");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Caml_int32 = require("bs-platform/lib/js/caml_int32.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Belt_MapInt = require("bs-platform/lib/js/belt_MapInt.js");
var Belt_Option = require("bs-platform/lib/js/belt_Option.js");

function stringOfSquareValue(value) {
  switch (value) {
    case 0 : 
        return "";
    case 1 : 
        return "X";
    case 2 : 
        return "O";
    
  }
}

function Game$Square(Props) {
  var onClick = Props.onClick;
  var value = Props.value;
  return React.createElement("button", {
              className: "square",
              onClick: onClick
            }, stringOfSquareValue(value));
}

var Square = /* module */[/* make */Game$Square];

function Game$Board(Props) {
  var onClick = Props.onClick;
  var squareValues = Props.squareValues;
  return Belt_Array.map(/* array */[
              0,
              1,
              2
            ], (function (row) {
                return React.createElement("div", {
                            key: String(row),
                            className: "board-row"
                          }, Belt_Array.map(/* array */[
                                0,
                                1,
                                2
                              ], (function (col) {
                                  var squareIndex = Caml_int32.imul(3, row) + col | 0;
                                  return React.createElement(Game$Square, {
                                              onClick: (function (evt) {
                                                  return Curry._2(onClick, evt, squareIndex);
                                                }),
                                              value: Belt_MapInt.getWithDefault(squareValues, squareIndex, /* SquareEmpty */0),
                                              key: String(squareIndex)
                                            });
                                })));
              }));
}

var Board = /* module */[/* make */Game$Board];

function calculateWinner(squareValues) {
  var checkLine = function (param) {
    var v1 = Belt_MapInt.getWithDefault(squareValues, param[0], /* SquareEmpty */0);
    var v2 = Belt_MapInt.getWithDefault(squareValues, param[1], /* SquareEmpty */0);
    var v3 = Belt_MapInt.getWithDefault(squareValues, param[2], /* SquareEmpty */0);
    if (v1 === /* SquareX */1 && v2 === v1 && v3 === v1) {
      return /* SquareX */1;
    } else if (v1 === /* SquareO */2 && v2 === v1 && v3 === v1) {
      return /* SquareO */2;
    } else {
      return /* SquareEmpty */0;
    }
  };
  var lines = /* array */[
    /* tuple */[
      0,
      1,
      2
    ],
    /* tuple */[
      3,
      4,
      5
    ],
    /* tuple */[
      6,
      7,
      8
    ],
    /* tuple */[
      0,
      3,
      6
    ],
    /* tuple */[
      1,
      4,
      7
    ],
    /* tuple */[
      2,
      5,
      8
    ],
    /* tuple */[
      0,
      4,
      8
    ],
    /* tuple */[
      2,
      4,
      6
    ]
  ];
  return Belt_Option.getWithDefault(Belt_Array.get(Belt_Array.keep(Belt_Array.map(lines, checkLine), (function (v) {
                        return v !== /* SquareEmpty */0;
                      })), 0), /* SquareEmpty */0);
}

function hasWinner(squareValues) {
  return calculateWinner(squareValues) !== /* SquareEmpty */0;
}

function nextPlayer(historySize) {
  if (historySize % 2 === 0) {
    return /* SquareX */1;
  } else {
    return /* SquareO */2;
  }
}

function nextMove(state, squareIndex) {
  var match = Belt_List.getExn(state[/* history */0], state[/* currentHistoryIndex */1]);
  var currentSquares = match[0];
  if (Belt_MapInt.getWithDefault(currentSquares, squareIndex, /* SquareEmpty */0) !== /* SquareEmpty */0 || calculateWinner(currentSquares) !== /* SquareEmpty */0) {
    return state;
  } else {
    var headSquares = Belt_List.keepWithIndex(state[/* history */0], (function (_value, index) {
            return index <= state[/* currentHistoryIndex */1];
          }));
    return /* record */[
            /* history */Pervasives.$at(headSquares, /* :: */[
                  /* tuple */[
                    Belt_MapInt.set(currentSquares, squareIndex, nextPlayer(Belt_List.size(headSquares) + 1 | 0)),
                    squareIndex
                  ],
                  /* [] */0
                ]),
            /* currentHistoryIndex */state[/* currentHistoryIndex */1] + 1 | 0
          ];
  }
}

function initEmptySquareValues(param) {
  var __x = Belt_Array.make(9, /* SquareEmpty */0);
  return Belt_MapInt.fromArray(Belt_Array.mapWithIndex(__x, (function (index, value) {
                    return /* tuple */[
                            index,
                            value
                          ];
                  })));
}

function Game(Props) {
  Props.message;
  var match = React.useReducer((function (state, action) {
          if (action.tag) {
            return /* record */[
                    /* history */state[/* history */0],
                    /* currentHistoryIndex */action[0]
                  ];
          } else {
            return nextMove(state, action[0]);
          }
        }), /* record */[
        /* history : :: */[
          /* tuple */[
            initEmptySquareValues(/* () */0),
            -1
          ],
          /* [] */0
        ],
        /* currentHistoryIndex */0
      ]);
  var dispatch = match[1];
  var state = match[0];
  var handleClick = function (_event, squareIndex) {
    return Curry._1(dispatch, /* NextMove */Block.__(0, [squareIndex]));
  };
  var match$1 = Belt_List.getExn(state[/* history */0], state[/* currentHistoryIndex */1]);
  var currentSquares = match$1[0];
  var winner = calculateWinner(currentSquares);
  var statusDisplay = winner !== /* SquareEmpty */0 ? "Winner: " + stringOfSquareValue(winner) : "Next player: " + stringOfSquareValue(nextPlayer(state[/* currentHistoryIndex */1]));
  var moves = Belt_List.toArray(Belt_List.mapWithIndex(state[/* history */0], (function (index, param) {
              var move = param[1];
              var row = move / 3 | 0;
              var col = move % 3;
              var moveString = "(" + (String(row) + (", " + (String(col) + ")")));
              var moveDisplay = index === 0 ? "Go to game start" : "Go to move #" + (String(index) + (" " + moveString));
              return React.createElement("li", {
                          key: String(index)
                        }, React.createElement("button", {
                              onClick: (function (_event) {
                                  return Curry._1(dispatch, /* JumpToHistory */Block.__(1, [index]));
                                })
                            }, index === state[/* currentHistoryIndex */1] ? React.createElement("b", undefined, moveDisplay) : moveDisplay));
            })));
  return React.createElement("div", {
              className: "game"
            }, React.createElement("div", {
                  className: "game-board"
                }, React.createElement(Game$Board, {
                      onClick: handleClick,
                      squareValues: currentSquares
                    })), React.createElement("div", {
                  className: "game-info"
                }, React.createElement("div", undefined, statusDisplay), React.createElement("div", undefined, moves)));
}

var make = Game;

exports.stringOfSquareValue = stringOfSquareValue;
exports.Square = Square;
exports.Board = Board;
exports.calculateWinner = calculateWinner;
exports.hasWinner = hasWinner;
exports.nextPlayer = nextPlayer;
exports.nextMove = nextMove;
exports.initEmptySquareValues = initEmptySquareValues;
exports.make = make;
/* react Not a pure module */
