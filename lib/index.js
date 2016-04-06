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

  var resource = _ramda2.default.merge({
    buildUrl: _ramda2.default.compose(_ramda2.default.concat(defaults.baseUrl), _ramda2.default.join("/"), _ramda2.default.prepend(url)),
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
var getList = exports.getList = function getList(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (typeof name === "string") name = [name];

  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.list.name }, options);
    dispatchRequest(getList, name, options, dispatch, generateActions(name[0], options));
  };
};

getList.method = defaults.methods.GET;
// getList.onResponseData = defaults.onResponseData
// getList.onResponseOk = defaults.onResponseOk
// getList.onResponseComplete = defaults.onResponseComplete
// getList.onBadRequest = defaults.onBadRequest
// getList.onUnauthorized = defaults.onUnauthorized
// getList.onForbidden = defaults.onForbidden
// getList.onServerError = defaults.onServerError
// getList.onError = defaults.onError

/**
 * GET Item
 * @param name
 * @param options
 * @returns {Function}
 */
var get = exports.get = function get(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.item.name }, options);
    return dispatchRequest(get, name, options, dispatch, generateActions(name, options));
  };
};
get.method = defaults.methods.GET;
// get.onResponseData = defaults.onResponseData
// get.onResponseOk = defaults.onResponseOk
// get.onResponseComplete = defaults.onResponseComplete
// get.onBadRequest = defaults.onBadRequest
// get.onUnauthorized = defaults.onUnauthorized
// get.onForbidden = defaults.onForbidden
// get.onServerError = defaults.onServerError
// get.onError = defaults.onError

/**
 * POST Item
 * @param name
 * @param options
 * @returns {Function}
 */
var post = exports.post = function post(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.item.name }, options);
    dispatchRequest(post, name, options, dispatch, generateActions(name, options));
  };
};
post.method = defaults.methods.POST;
// post.onResponseData = defaults.onResponseData
// post.onResponseOk = defaults.onResponseOk
// post.onResponseComplete = defaults.onResponseComplete
// post.onBadRequest = defaults.onBadRequest
// post.onUnauthorized = defaults.onUnauthorized
// post.onForbidden = defaults.onForbidden
// post.onServerError = defaults.onServerError
// post.onError = defaults.onError

/**
 * PUT Item
 * @param name
 * @param options
 * @returns {Function}
 */
var put = exports.put = function put(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.item.name }, options);
    dispatchRequest(put, name, options, dispatch, generateActions(name, options));
  };
};
put.method = defaults.methods.PUT;
// put.onResponseData = defaults.onResponseData
// put.onResponseOk = defaults.onResponseOk
// put.onResponseComplete = defaults.onResponseComplete
// put.onBadRequest = defaults.onBadRequest
// put.onUnauthorized = defaults.onUnauthorized
// put.onForbidden = defaults.onForbidden
// put.onServerError = defaults.onServerError
// put.onError = defaults.onError

/**
 * DELETE Item
 * @param name
 * @param options
 * @returns {Function}
 */
var del = exports.del = function del(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var request = del;
  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.item.name }, options);
    dispatchRequest(request, name, options, dispatch, generateActions(name, options));
  };
};
del.method = defaults.methods.DEL;
// del.onResponseData = defaults.onResponseData
// del.onResponseOk = defaults.onResponseOk
// del.onResponseComplete = defaults.onResponseComplete
// del.onBadRequest = defaults.onBadRequest
// del.onUnauthorized = defaults.onUnauthorized
// del.onForbidden = defaults.onForbidden
// del.onServerError = defaults.onServerError
// del.onError = defaults.onError

// Convert to Rambda
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

  (0, _superagent2.default)(method.name, resources.get(name.shift()).url([name])).set(headers).query(query).send(payload).type(contentType).end(function (err, resp) {
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

exports.default = {
  resources: resources,
  addResource: addResource,
  removeResource: removeResource,
  defaults: defaults,
  getReducers: getReducers,
  getList: getList
};