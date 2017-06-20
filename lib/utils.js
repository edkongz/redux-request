"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateReducer = exports.actions = exports.completeRequest = exports.dispatchRequest = exports.parseRequestArgs = undefined;

var _ramda = require("ramda");

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseRequestArgs = exports.parseRequestArgs = _ramda2.default.pipe(_ramda2.default.ifElse(_ramda2.default.pipe(_ramda2.default.last, _ramda2.default.is(Object)), _ramda2.default.identity, _ramda2.default.append({})), _ramda2.default.splitAt(-1), _ramda2.default.adjust(_ramda2.default.join("/"), 0), _ramda2.default.flatten, _ramda2.default.zipObj(["_path", "_options"]));

//export const buildRequestObject = R.pipe(
//
//)
//
//
var dispatchRequest = exports.dispatchRequest = function dispatchRequest(name, url, options) {
  return function (dispatch) {
    dispatch(actions(name, "init"));
  };
};
var completeRequest = exports.completeRequest = function completeRequest(options) {
  return function (err, resp) {};
};
//export const processResults = (err, resp) => {
//
//}
//
var actions = exports.actions = function actions(name, state) {
  return (name + "_HTTP_" + state).toUpperCase();
};

var generateReducer = exports.generateReducer = function generateReducer(name) {
  var initialState = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return function () {
    var _action, _action2, _action3;

    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments[1];

    switch (action.type) {
      case actions(name, "init"):
        return Object.assign({}, state, (_action = action, status = _action.status, _action), {
          resp: null,
          data: null
        });

      case actions(name, "ok"):
        return Object.assign({}, state, (_action2 = action, status = _action2.status, resp = _action2.resp, _action2), {
          data: null
        });

      case buildAction(name, "err"):
        return Object.assign({}, state, (_action3 = action, status = _action3.status, resp = _action3.resp, _action3), {
          data: null
        });

      default:
        return state;
    }
  };
};