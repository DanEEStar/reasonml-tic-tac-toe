// Generated by BUCKLESCRIPT VERSION 5.0.4, PLEASE EDIT WITH CARE
'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Belt_List = require("bs-platform/lib/js/belt_List.js");
var Board$ReactHooksTemplate = require("./Board.bs.js");

function nextMove(state, squareIndex) {
  console.log("squareIndex " + String(squareIndex));
  return state;
}

function Game(Props) {
  Props.message;
  var match = React.useReducer((function (state, action) {
          return nextMove(state, action[0]);
        }), /* record */[
        /* squareValues */Belt_List.make(9, ""),
        /* xIsNext */true
      ]);
  var dispatch = match[1];
  var handleClick = function (_event, squareIndex) {
    return Curry._1(dispatch, /* NextMove */[squareIndex]);
  };
  return React.createElement("div", undefined, React.createElement(Board$ReactHooksTemplate.make, {
                  onClick: handleClick
                }));
}

var make = Game;

exports.nextMove = nextMove;
exports.make = make;
/* react Not a pure module */
