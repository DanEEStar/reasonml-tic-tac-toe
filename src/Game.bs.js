// Generated by BUCKLESCRIPT VERSION 5.0.4, PLEASE EDIT WITH CARE
'use strict';

var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Belt_List = require("bs-platform/lib/js/belt_List.js");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Caml_int32 = require("bs-platform/lib/js/caml_int32.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
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
                                              value: List.nth(squareValues, squareIndex),
                                              key: String(squareIndex)
                                            });
                                })));
              }));
}

var Board = /* module */[/* make */Game$Board];

function updateListElement(li, index, newValue) {
  var match = Belt_Option.getExn(Belt_List.splitAt(li, index));
  return Pervasives.$at(match[0], /* :: */[
              newValue,
              List.tl(match[1])
            ]);
}

function nextMove(state, squareIndex) {
  console.log("squareIndex " + String(squareIndex));
  if (state[/* xIsNext */1]) {
    return /* record */[
            /* squareValues */updateListElement(state[/* squareValues */0], squareIndex, /* SquareX */1),
            /* xIsNext */false
          ];
  } else {
    return /* record */[
            /* squareValues */updateListElement(state[/* squareValues */0], squareIndex, /* SquareO */2),
            /* xIsNext */true
          ];
  }
}

function Game(Props) {
  Props.message;
  var match = React.useReducer((function (state, action) {
          return nextMove(state, action[0]);
        }), /* record */[
        /* squareValues */Belt_List.make(9, /* SquareEmpty */0),
        /* xIsNext */true
      ]);
  var dispatch = match[1];
  var handleClick = function (_event, squareIndex) {
    return Curry._1(dispatch, /* NextMove */[squareIndex]);
  };
  return React.createElement("div", undefined, React.createElement(Game$Board, {
                  onClick: handleClick,
                  squareValues: match[0][/* squareValues */0]
                }));
}

var make = Game;

exports.stringOfSquareValue = stringOfSquareValue;
exports.Square = Square;
exports.Board = Board;
exports.updateListElement = updateListElement;
exports.nextMove = nextMove;
exports.make = make;
/* react Not a pure module */
