"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addResource = exports.defaults = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.generateActions = generateActions;
exports.getReducers = getReducers;

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

var _ramda = require("ramda");

var _ramda2 = _interopRequireDefault(_ramda);

var _reducers = require("./reducers.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = exports.defaults = {
  baseUrl: "",
  contentType: "application/json",
  query: {},
  headers: {},
  payload: {},

  list: {
    name: "List",
    reducer: _reducers.defaultListReducer,
    initState: {
      fetching: false,
      updating: false,
      deleting: false,
      posting: false,
      status: null,
      pageNumber: 0,
      perPage: 100,
      resp: null,
      data: null,
      err: null
    }
  },
  item: {
    name: "Item",
    reducer: _reducers.defaultItemReducer,
    initState: {
      fetching: false,
      updating: false,
      deleting: false,
      posting: false,
      status: null,
      resp: null,
      data: null,
      err: null
    }
  },

  methods: {
    prefix: "",
    GET: {
      name: "GET",
      INIT: "FETCHING",
      OK: "FETCH_OK",
      ERR: "FETCH_ERR"
    },
    POST: {
      name: "POST",
      INIT: "POSTING",
      OK: "POST_OK",
      ERR: "POST_ERR"
    },
    PUT: {
      name: "PUT",
      INIT: "UPDATING",
      OK: "UPDATE_OK",
      ERR: "UPDATE_ERR"
    },
    DEL: {
      name: "DELETE",
      INIT: "DELETING",
      OK: "DELETE_OK",
      ERR: "DELETE_ERR"
    }
  }
};

var events = {
  onData: function onData(resp, dispatch) {
    console.info("SUCCESS DATA");
    return resp;
  },
  onResponse: function onResponse(resp, dispatch, action) {
    console.warn("SUCCESS Ok");
    dispatch(_ramda2.default.merge(action, { resp: resp }));
  },
  onComplete: function onComplete(resp, dispatch) {
    console.warn("COMPLETE");
  },
  onBadRequest: requestError,
  onUnauthorized: requestError,
  onForbidden: requestError,
  onServerError: requestError,
  onError: requestError
};

function requestError(err, dispatch, action) {
  console.warn(err.status + ": " + JSON.stringify(err.response.body, null, 2));
  dispatch(_ramda2.default.merge(action, { status: err.status, err: err }));
}

var resources = new Map();
var addResource = exports.addResource = function addResource(name, url, options) {
  // If no url is supplied assume url is /name
  url = url || (/^\//.test(name) ? name : "/" + name);
  var baseUrl = /^https?/.test(url) ? "" : defaults.baseUrl;

  var resource = _ramda2.default.merge({
    buildUrl: _ramda2.default.compose(_ramda2.default.concat(baseUrl), _ramda2.default.join("/"), _ramda2.default.prepend(url)),
    reducerName: name,
    url: url
  }, options);

  resources.set(name, resource);
};
var removeResource = function removeResource(name) {
  return resources.delete(name);
};

/**
 * GET List
 * @param name
 * @param options
 * @returns {Function}
 */
function _getList(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  name = checkResourceName(name);

  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.list.name }, options);
    dispatchRequest(_getList, name, options, dispatch, generateActions(name[0], options));
  };
}

_getList.method = defaults.methods.GET;

/**
 * GET Item
 * @param name
 * @param options
 * @returns {Function}
 */
function _get(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  name = checkResourceName(name);

  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.item.name }, options);
    return dispatchRequest(_get, name, options, dispatch, generateActions(name, options));
  };
}
_get.method = defaults.methods.GET;

/**
 * POST Item
 * @param name
 * @param options
 * @returns {Function}
 */
function _post(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  name = checkResourceName(name);

  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.item.name }, options);
    dispatchRequest(_post, name, options, dispatch, generateActions(name, options));
  };
}
_post.method = defaults.methods.POST;

/**
 * PUT Item
 * @param name
 * @param options
 * @returns {Function}
 */
function _put(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  name = checkResourceName(name);

  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.item.name }, options);
    dispatchRequest(_put, name, options, dispatch, generateActions(name, options));
  };
}
_put.method = defaults.methods.PUT;

/**
 * DELETE Item
 * @param name
 * @param options
 * @returns {Function}
 */
function _del(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  name = checkResourceName(name);

  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.item.name }, options);
    dispatchRequest(request, name, options, dispatch, generateActions(name, options));
  };
}
_del.method = defaults.methods.DEL;

function checkResourceName(name) {
  if (_ramda2.default.type(name) === "String") name = [name];
  if (_ramda2.default.type(name) !== "Array") throw new TypeError("Resource name must be either a either string or an array of strings");
  if (!resources.has(name[0])) throw new ReferenceError("No resource found named: " + name[0]);
  return _ramda2.default.map(function (e) {
    return e.toString();
  }, name);
}

function generateActions(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var _options$resourceType = options.resourceType;
  var resourceType = _options$resourceType === undefined ? defaults.item.name : _options$resourceType;


  var buildAction = _ramda2.default.compose(_ramda2.default.objOf("type"), _ramda2.default.join("_"), _ramda2.default.map(function (e) {
    return e.toUpperCase();
  }), _ramda2.default.concat([name, resourceType]));
  return function (stage) {
    var updates = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    return _ramda2.default.merge(buildAction([stage]), updates);
  };
}

function generateEvents(options, resource, request) {
  return function (event) {
    var onEvent = "on" + event;
    var name = request.name.substr(1);
    return options[onEvent] || resource[name] && resource[name][onEvent] || resource[onEvent] || request[onEvent] || events[onEvent];
  };
}

function generateQuery(query) {
  var encode = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  return _ramda2.default.compose(_ramda2.default.join("&"), _ramda2.default.map(_ramda2.default.join("=")), _ramda2.default.toPairs)(query);
}

function dispatchRequest(request, name, options, dispatch, actions) {
  var method = request.method;

  var resource = resources.get(name.shift());
  var _options$headers = options.headers;
  var headers = _options$headers === undefined ? defaults.headers : _options$headers;
  var _options$query = options.query;
  var query = _options$query === undefined ? {} : _options$query;
  var _options$payload = options.payload;
  var payload = _options$payload === undefined ? {} : _options$payload;
  var _options$contentType = options.contentType;
  var contentType = _options$contentType === undefined ? defaults.contentType : _options$contentType;


  dispatch(actions(method.INIT));
  (0, _superagent2.default)(method.name, resource.buildUrl([name])).set(headers).query(query).send(payload).type(contentType).end(function (err, resp) {
    var on = generateEvents(options, resource, request);
    if (err === null) {
      resp = on("Data")(resp);
      on("Response")(resp, dispatch, actions(method.OK));
      return on("Complete")(resp, dispatch);
    }

    if (err.status >= 500) return on("ServerError")(err, dispatch, actions(method.ERR));
    if (err.status === 400) return on("BadRequest")(err, dispatch, actions(method.ERR));
    if (err.status === 401) return on("Unauthorized")(err, dispatch, actions(method.ERR));
    if (err.status === 403) return on("Forbidden")(err, dispatch, actions(method.ERR));
    return on("Error")(err);
  });
}

/**
 * Generates reducers to add to store
 * @returns {{}}
 */
function getReducers() {
  var reducers = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = resources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var name = _step$value[0];
      var resource = _step$value[1];

      if (resource.reducer && resource.reducer === false) continue;
      reducers[resource.reducerName + defaults.list.name] = defaults.list.reducer(name, defaults.list.initState);
      reducers[resource.reducerName + defaults.item.name] = defaults.item.reducer(name, defaults.item.initState);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return reducers;
}

function API(resource) {
  if (!resources.has(resource)) throw new ReferenceError("No resource found named: " + resource);
  return {
    getList: function getList(options) {
      return _getList(resource, options);
    },
    get: function get(options) {
      return _get(resource, options);
    },
    post: function post(options) {
      return _post(resource, options);
    },
    put: function put(options) {
      return _put(resource, options);
    },
    del: function del(options) {
      return _del(resource, options);
    }
  };
}

exports.default = Object.assign(API, {
  addResource: addResource,
  removeResource: removeResource,
  getReducers: getReducers,
  getList: _getList,
  get: _get,
  post: _post,
  put: _put,
  del: _del,

  setBaseUrl: function setBaseUrl(url) {
    return defaults.baseUrl = url;
  },
  setDefaultHeaders: function setDefaultHeaders(headers) {
    return defaults.headers = headers;
  },
  addDefaultHeader: function addDefaultHeader(header) {
    return defaults.headers = Object.assign(defaults.headers, header);
  },
  setDefaultQuery: function setDefaultQuery(query) {
    return defaults.query = query;
  },
  setDefaultPayload: function setDefaultPayload(payload) {
    return defaults.payload = payload;
  },
  setContentType: function setContentType(contentType) {
    return defaults.contentType = contentType;
  },
  setDefaultListName: function setDefaultListName(name) {
    return defaults.list.name = name;
  },
  setDefaultListReducer: function setDefaultListReducer(reducer) {
    return defaults.list.reducer = reducer;
  },
  setDefaultListState: function setDefaultListState(state) {
    return defaults.list.initState = state;
  },
  setDefaultItemName: function setDefaultItemName(name) {
    return defaults.item.name = name;
  },
  setDefaultItemReducer: function setDefaultItemReducer(reducer) {
    return defaults.item.reducer = reducer;
  },
  setDefaultItemState: function setDefaultItemState(state) {
    return defaults.item.initState = state;
  }
});