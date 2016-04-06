"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReducers = exports.del = exports.put = exports.post = exports.get = exports.getList = exports.removeResource = exports.addResource = exports.resources = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

var _ramda = require("ramda");

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
  baseUrl: "",
  contentType: "application/json",
  query: {},
  headers: {},
  payload: {},

  list: {
    name: "List",
    reducer: defaultListReducer,
    initState: {
      fetching: false,
      updating: false,
      deleting: false,
      posting: false,
      status: null,
      pageNumber: 0,
      perPage: 100,
      resp: null,
      err: null
    }
  },

  item: {
    name: "Item",
    reducer: defaultItemReducer,
    initState: {
      fetching: false,
      updating: false,
      deleting: false,
      posting: false,
      status: null,
      resp: null,
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
    console.warn("SUCCESS DATA");
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

var requestError = function requestError(err, dispatch, action) {
  console.warn(err.status + ": " + err.response);
  dispatch(_ramda2.default.merge(action, { status: err.status, err: err }));
};

var resources = exports.resources = new Map();
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

var removeResource = exports.removeResource = function removeResource(name) {
  return resources.delete(name);
};

/**
 * GET List
 * @param name
 * @param options
 * @returns {Function}
 */
var _getList = function _getList(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  name = checkResourceName(name);

  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.list.name }, options);
    dispatchRequest(_getList, name, options, dispatch, generateActions(name[0], options));
  };
};

exports.getList = _getList;
_getList.method = defaults.methods.GET;

/**
 * GET Item
 * @param name
 * @param options
 * @returns {Function}
 */
var _get = function _get(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  name = checkResourceName(name);

  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.item.name }, options);
    return dispatchRequest(_get, name, options, dispatch, generateActions(name, options));
  };
};
exports.get = _get;
_get.method = defaults.methods.GET;

/**
 * POST Item
 * @param name
 * @param options
 * @returns {Function}
 */
var _post = function _post(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  name = checkResourceName(name);

  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.item.name }, options);
    dispatchRequest(_post, name, options, dispatch, generateActions(name, options));
  };
};
exports.post = _post;
_post.method = defaults.methods.POST;

/**
 * PUT Item
 * @param name
 * @param options
 * @returns {Function}
 */
var _put = function _put(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  name = checkResourceName(name);

  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.item.name }, options);
    dispatchRequest(_put, name, options, dispatch, generateActions(name, options));
  };
};
exports.put = _put;
_put.method = defaults.methods.PUT;

/**
 * DELETE Item
 * @param name
 * @param options
 * @returns {Function}
 */
var _del = function _del(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  name = checkResourceName(name);

  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.item.name }, options);
    dispatchRequest(request, name, options, dispatch, generateActions(name, options));
  };
};
exports.del = _del;
_del.method = defaults.methods.DEL;

var generateActions = function generateActions(name) {
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
};

var checkResourceName = function checkResourceName(name) {
  if (_ramda2.default.type(name) === "String") name = [name];
  if (_ramda2.default.type(name) !== "Array") throw new TypeError("Resource name must be either a either string or an array of strings");
  if (!resources.has(name[0])) throw new ReferenceError("No resource found named: " + name[0]);
  return _ramda2.default.map(function (e) {
    return e.toString();
  }, name);
};

var generateEvents = function generateEvents(options, resource, request) {
  return function (event) {
    var onEvent = "on" + event;
    return options[onEvent] || resource[request.name] && resource[request.name][onEvent] || resource[onEvent] || request[onEvent] || events[onEvent];
  };
};

var dispatchRequest = function dispatchRequest(request, name, options, dispatch, actions) {
  var method = request.method;
  var _options$headers = options.headers;
  var headers = _options$headers === undefined ? defaults.headers : _options$headers;
  var _options$query = options.query;
  var query = _options$query === undefined ? {} : _options$query;
  var _options$payload = options.payload;
  var payload = _options$payload === undefined ? {} : _options$payload;
  var _options$contentType = options.contentType;
  var contentType = _options$contentType === undefined ? defaults.contentType : _options$contentType;


  dispatch(actions(method.INIT));
  (0, _superagent2.default)(method.name, resources.get(name.shift()).buildUrl([name])).set(headers).query(query).send(payload).type(contentType).end(function (err, resp) {
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
};

/**
 * Generates reducers to add to store
 * @returns {{}}
 */
var getReducers = exports.getReducers = function getReducers() {
  var reducers = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = resources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var name = _step$value[0];
      var _resource = _step$value[1];

      if (_resource.reducer && _resource.reducer === false) continue;
      reducers[_resource.reducerName + defaults.list.name] = defaults.list.reducer(name, defaults.list.initState);
      reducers[_resource.reducerName + defaults.item.name] = defaults.item.reducer(name, defaults.item.initState);
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
};

/**
 * Default list reducer
 * @param name
 * @param initState
 * @returns {function()}
 */
var defaultListReducer = function defaultListReducer(name, initState) {
  var LIST = generateActions(name, { resourceType: defaults.list.name });
  var GET = defaults.methods.GET;


  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initState : arguments[0];
    var action = arguments[1];
    var status = action.status;

    switch (action.type) {
      case LIST(GET.INIT).type:
        return _ramda2.default.merge(state, { fetching: true, status: null });

      case LIST(GET.OK).type:
        return _ramda2.default.merge(state, { fetching: false, resp: action.resp.body, status: status });

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
var defaultItemReducer = function defaultItemReducer(name, initState) {
  var ITEM = generateActions(name, { resourceType: defaults.item.name });
  var _defaults$methods = defaults.methods;
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
        return _ramda2.default.merge(state, { fetching: true, status: null });

      case ITEM(GET.OK).type:
        return _ramda2.default.merge(state, { fetching: false, resp: action.resp.body, status: status });

      case ITEM(GET.ERR).type:
        return _ramda2.default.merge(state, { fetching: false, err: action.err, status: status });

      case ITEM(POST.INIT).type:
        return _ramda2.default.merge(state, { posting: true, status: null });

      case ITEM(POST.OK).type:
        return _ramda2.default.merge(state, { posting: false, resp: action.resp.body, status: status });

      case ITEM(POST.ERR).type:
        return _ramda2.default.merge(state, { posting: false, err: action.err, status: status });

      case ITEM(PUT.INIT).type:
        return _ramda2.default.merge(state, { updating: true, status: null });

      case ITEM(PUT.OK).type:
        return _ramda2.default.merge(state, { updating: false, resp: action.resp.body, status: status });

      case ITEM(PUT.ERR).type:
        return _ramda2.default.merge(state, { updating: false, err: action.err, status: status });

      case ITEM(DEL.INIT).type:
        return _ramda2.default.merge(state, { deleting: true, status: null });

      case ITEM(DEL.OK).type:
        return _ramda2.default.merge(state, { deleting: false, resp: action.resp.body, status: status });

      case ITEM(DEL.ERR).type:
        return _ramda2.default.merge(state, { deleting: false, err: action.err, status: status });

      default:
        return state;
    }
  };
};

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