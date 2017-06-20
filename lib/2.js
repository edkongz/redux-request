"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ramda = require("ramda");

var _ramda2 = _interopRequireDefault(_ramda);

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resources = new Map();

var defaults = {
  baseUrl: "",
  contentType: "application/json",
  query: {},
  headers: {},
  payload: {}
};

var states = {
  GET: {
    INIT: "FETCHING",
    OK: "FETCH_OK",
    ERR: "FETCH_ERR"
  },
  POST: {
    INIT: "POSTING",
    OK: "POST_OK",
    ERR: "POST_ERR"
  },
  PUT: {
    INIT: "UPDATING",
    OK: "UPDATE_OK",
    ERR: "UPDATE_ERR"
  },
  DELETE: {
    INIT: "DELETING",
    OK: "DELETE_OK",
    ERR: "DELETE_ERR"
  }
};

var buildRequest = function buildRequest(method) {
  return function (name) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (!resources.has(name)) throw new ReferenceError("No resource found named: " + name);

    var _parseRequestArgs = parseRequestArgs(args);

    var _parseRequestArgs2 = _slicedToArray(_parseRequestArgs, 2);

    var path = _parseRequestArgs2[0];
    var options = _parseRequestArgs2[1];

    return function (dispatch) {
      dispatchRequest(name, method, path, options, dispatch);
    };
  };
};

var parseRequestArgs = _ramda2.default.pipe(_ramda2.default.ifElse(_ramda2.default.pipe(_ramda2.default.last, _ramda2.default.is(Object)), _ramda2.default.identity, _ramda2.default.append({})), function (e) {
  return [_ramda2.default.join("/", _ramda2.default.init(e)), _ramda2.default.last(e)];
});

var dispatchRequest = function dispatchRequest(name, method, path, options, dispatch) {
  var resource = resources.get(name);
  var url = _ramda2.default.join("/", [resource.baseUrl, path]);

  var _options$headers = options.headers;
  var headers = _options$headers === undefined ? defaults.headers : _options$headers;
  var _options$query = options.query;
  var query = _options$query === undefined ? {} : _options$query;
  var _options$payload = options.payload;
  var payload = _options$payload === undefined ? {} : _options$payload;
  var _options$contentType = options.contentType;
  var contentType = _options$contentType === undefined ? defaults.contentType : _options$contentType;


  return (0, _superagent2.default)(method, url).set(headers).query(query).send(payload).type(contentType).end(function (err, resp) {});
};

var addResource = function addResource(name, options) {
  resources.set(name, {
    baseUrl: _ramda2.default.join("/", [defaults.baseUrl, name]),
    reducerName: _ramda2.default.propOr(name, "reducerName", options)
  });
};

var buildAction = function buildAction(method, state, data) {};

var getReducers = function getReducers() {};

get("projects", "12345");