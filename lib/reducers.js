"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultItemReducer = exports.defaultListReducer = undefined;

var _index = require("./index.js");

var _ramda = require("ramda");

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Default list reducer
 * @param name
 * @param initState
 * @returns {function()}
 */
var defaultListReducer = exports.defaultListReducer = function defaultListReducer(name, initState) {
  var LIST = (0, _index.generateActions)(name, { resourceType: _index.defaults.list.name });
  var GET = _index.defaults.methods.GET;


  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initState : arguments[0];
    var action = arguments[1];
    var status = action.status;

    switch (action.type) {
      case LIST(GET.INIT).type:
        return _ramda2.default.merge(state, { fetching: true, status: null });

      case LIST(GET.OK).type:
        return _ramda2.default.merge(state, {
          fetching: false,
          data: action.resp.body,
          resp: action.resp, status: status,
          pageNumber: _ramda2.default.propOr(null, "pageNumber", action),
          perPage: _ramda2.default.propOr(null, "perPage", action)
        });

      case LIST(GET.ERR).type:
        return _ramda2.default.merge(state, { fetching: false, err: action.err, status: status });

      default:
        return state;
    }
  };
};

/**
 * Default item reducer
 * @param name
 * @param initState
 * @returns {function()}
 */
var defaultItemReducer = exports.defaultItemReducer = function defaultItemReducer(name, initState) {
  var ITEM = (0, _index.generateActions)(name, { resourceType: _index.defaults.item.name });
  var _defaults$methods = _index.defaults.methods;
  var GET = _defaults$methods.GET;
  var PUT = _defaults$methods.PUT;
  var POST = _defaults$methods.POST;
  var DEL = _defaults$methods.DEL;


  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initState : arguments[0];
    var action = arguments[1];
    var status = action.status;

    switch (action.type) {
      case ITEM(GET.INIT).type:
        return _ramda2.default.merge(state, { fetching: true, status: null, data: null });

      case ITEM(GET.OK).type:
        return _ramda2.default.merge(state, { fetching: false, resp: action.resp, data: action.resp.body, status: status });

      case ITEM(GET.ERR).type:
        return _ramda2.default.merge(state, { fetching: false, err: action.err, status: status });

      case ITEM(POST.INIT).type:
        return _ramda2.default.merge(state, { posting: true, status: null });

      case ITEM(POST.OK).type:
        return _ramda2.default.merge(state, { posting: false, resp: action.resp, data: action.resp.body, status: status });

      case ITEM(POST.ERR).type:
        return _ramda2.default.merge(state, { posting: false, err: action.err, status: status });

      case ITEM(PUT.INIT).type:
        return _ramda2.default.merge(state, { updating: true, status: null });

      case ITEM(PUT.OK).type:
        return _ramda2.default.merge(state, { updating: false, resp: action.resp, data: action.resp.body, status: status });

      case ITEM(PUT.ERR).type:
        return _ramda2.default.merge(state, { updating: false, err: action.err, status: status });

      case ITEM(DEL.INIT).type:
        return _ramda2.default.merge(state, { deleting: true, status: null });

      case ITEM(DEL.OK).type:
        return _ramda2.default.merge(state, { deleting: false, resp: action.resp, data: action.resp.body, status: status });

      case ITEM(DEL.ERR).type:
        return _ramda2.default.merge(state, { deleting: false, err: action.err, status: status });

      default:
        return state;
    }
  };
};