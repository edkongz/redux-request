"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReducers = exports.del = exports.put = exports.post = exports.get = exports.getList = exports.removeResource = exports.addResource = exports.resources = undefined;

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

var _ramda = require("ramda");

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaults = {
  baseUrl: "",
  contentType: "application/json",
  query: {},
  headers: {},
  payload: {},

  list: {
    name: "List",
    reducer: {
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
    reducer: {
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
  },

  onResponseData: function onResponseData(resp, dispatch) {
    console.warn("SUCCESS DATA");
    return resp;
  },
  onResponseOk: function onResponseOk(resp, dispatch, action) {
    console.warn("SUCCESS Ok");
    dispatch(_ramda2.default.merge(action, resp));
  },
  onResponseComplete: function onResponseComplete(resp, dispatch) {
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
  return resources.set(name, _ramda2.default.merge({
    url: _ramda2.default.compose(_ramda2.default.join("/"), _ramda2.default.prepend(url))
  }, options));
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

  var request = getList;
  if (typeof name === "string") name = [name];

  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.list.name }, options);
    dispatchRequest(request, name, options, dispatch, generateActions(name[0], options));
  };
};
getList.method = defaults.methods.GET;
getList.onResponseData = defaults.onResponseData;
getList.onResponseOk = defaults.onResponseOk;
getList.onResponseComplete = defaults.onResponseComplete;
getList.onBadRequest = defaults.onBadRequest;
getList.onUnauthorized = defaults.onUnauthorized;
getList.onForbidden = defaults.onForbidden;
getList.onServerError = defaults.onServerError;

/**
 * GET Item
 * @param name
 * @param options
 * @returns {Function}
 */
var get = exports.get = function get(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var request = get;
  if (!Array.isArray(name)) throw new TypeError("name must be an array");

  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.item.name }, options);
    return dispatchRequest(request, name, options, dispatch, generateActions(name, options));
  };
};
get.method = defaults.methods.GET;
get.onResponseData = defaults.onResponseData;
get.onResponseOk = defaults.onResponseOk;
get.onResponseComplete = defaults.onResponseComplete;
get.onBadRequest = defaults.onBadRequest;
get.onUnauthorized = defaults.onUnauthorized;
get.onForbidden = defaults.onForbidden;
get.onServerError = defaults.onServerError;

/**
 * POST Item
 * @param name
 * @param options
 * @returns {Function}
 */
var post = exports.post = function post(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var request = post;
  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.item.name }, options);
    dispatchRequest(request, name, options, dispatch, generateActions(name, options));
  };
};
post.method = defaults.methods.POST;
post.onResponseData = defaults.onResponseData;
post.onResponseOk = defaults.onResponseOk;
post.onResponseComplete = defaults.onResponseComplete;
post.onBadRequest = defaults.onBadRequest;
post.onUnauthorized = defaults.onUnauthorized;
post.onForbidden = defaults.onForbidden;
post.onServerError = defaults.onServerError;

/**
 * PUT Item
 * @param name
 * @param options
 * @returns {Function}
 */
var put = exports.put = function put(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var request = put;
  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.item.name }, options);
    dispatchRequest(request, name, options, dispatch, generateActions(name, options));
  };
};
put.method = defaults.methods.PUT;
put.onResponseData = defaults.onResponseData;
put.onResponseOk = defaults.onResponseOk;
put.onResponseComplete = defaults.onResponseComplete;
put.onBadRequest = defaults.onBadRequest;
put.onUnauthorized = defaults.onUnauthorized;
put.onForbidden = defaults.onForbidden;
put.onServerError = defaults.onServerError;

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
del.onResponseData = defaults.onResponseData;
del.onResponseOk = defaults.onResponseOk;
del.onResponseComplete = defaults.onResponseComplete;
del.onBadRequest = defaults.onBadRequest;
del.onUnauthorized = defaults.onUnauthorized;
del.onForbidden = defaults.onForbidden;
del.onServerError = defaults.onServerError;

var getReducers = exports.getReducers = function getReducers() {
  var reducers = {};

  var _loop = function _loop(resource) {
    if (resource.reducer && resource.reducer === false) return "continue";

    var _defaults$methods = defaults.methods;
    var GET = _defaults$methods.GET;
    var PUT = _defaults$methods.PUT;
    var POST = _defaults$methods.POST;
    var DEL = _defaults$methods.DEL;

    // Generate LIST reducer

    var LIST = generateActions(resource, { resourceType: defaults.list.name });
    reducers[resource + defaults.list.name] = function () {
      var state = arguments.length <= 0 || arguments[0] === undefined ? defaults.item.reducer : arguments[0];
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

    // Generate ITEM reducer
    var ITEM = generateActions(resource, { resourceType: defaults.item.name });
    reducers[resource + defaults.item.name] = function () {
      var state = arguments.length <= 0 || arguments[0] === undefined ? defaults.list.reducer : arguments[0];
      var action = arguments[1];
      var status = action.status;


      switch (action.type) {
        case ITEM(GET.INIT).type:
          return _ramda2.default.merge(state, { fetching: true, status: null });

        case ITEM(GET.OK).type:
          return _ramda2.default.merge(state, { fetching: false, resp: action.body, status: status });

        case ITEM(GET.ERR).type:
          return _ramda2.default.merge(state, { fetching: false, err: action.err, status: status });

        case ITEM(POST.INIT).type:
          return _ramda2.default.merge(state, { posting: true, status: null });

        case ITEM(POST.OK).type:
          return _ramda2.default.merge(state, { posting: false, resp: action.body, status: status });

        case ITEM(POST.ERR).type:
          return _ramda2.default.merge(state, { posting: false, err: action.err, status: status });

        case ITEM(PUT.INIT).type:
          return _ramda2.default.merge(state, { updating: true, status: null });

        case ITEM(PUT.OK).type:
          return _ramda2.default.merge(state, { updating: false, resp: action.body, status: status });

        case ITEM(PUT.ERR).type:
          return _ramda2.default.merge(state, { updating: false, err: action.err, status: status });

        case ITEM(DEL.INIT).type:
          return _ramda2.default.merge(state, { deleting: true, status: null });

        case ITEM(DEL.OK).type:
          return _ramda2.default.merge(state, { deleting: false, resp: action.body, status: status });

        case ITEM(DEL.ERR).type:
          return _ramda2.default.merge(state, { deleting: false, err: action.err, status: status });

        default:
          return state;
      }
    };
  };

  for (var resource in resources) {
    var _ret = _loop(resource);

    if (_ret === "continue") continue;
  }
  return reducers;
};

var generateActions = function generateActions(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var _options$resourceType = options.resourceType;
  var resourceType = _options$resourceType === undefined ? defaults.item.name : _options$resourceType;

  var action = [name.toUpperCase(), resourceType.toUpperCase()];
  return function (stage) {
    var updates = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    return _ramda2.default.merge({ type: _ramda2.default.join("_", [].concat(action, [stage])) }, updates);
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
  var contentType = _options$contentType === undefined ? options.contentType : _options$contentType;


  dispatch(actions(method.INIT));
  // const generateUrl = R.join("/", R.prepend(, ))

  (0, _superagent2.default)(method.name, _ramda2.default.join("/", [resources.get(name.shift()).url].concat(_toConsumableArray(name)))).set(headers).query(query).send(payload).type(contentType).end(function (err, resp) {
    var _options$onResponseDa = options.onResponseData;
    var onResponseData = _options$onResponseDa === undefined ? request.onResponseData : _options$onResponseDa;
    var _options$onResponseOk = options.onResponseOk;
    var onResponseOk = _options$onResponseOk === undefined ? request.onResponseOk : _options$onResponseOk;
    var _options$onResponseCo = options.onResponseComplete;
    var onResponseComplete = _options$onResponseCo === undefined ? request.onResponseComplete : _options$onResponseCo;
    var _options$onServerErro = options.onServerError;
    var onServerError = _options$onServerErro === undefined ? request.onServerError : _options$onServerErro;
    var _options$onBadRequest = options.onBadRequest;
    var onBadRequest = _options$onBadRequest === undefined ? request.onBadRequest : _options$onBadRequest;
    var _options$onUnauthoriz = options.onUnauthorized;
    var onUnauthorized = _options$onUnauthoriz === undefined ? request.onUnauthorized : _options$onUnauthoriz;
    var _options$onForbidden = options.onForbidden;
    var onForbidden = _options$onForbidden === undefined ? request.onUnauthorized : _options$onForbidden;


    if (err === null) {
      resp = onResponseData(resp);
      onResponseOk(resp, dispatch, actions(method.OK));
      return onResponseComplete(resp, dispatch);
    }

    if (err.status >= 500) return onServerError(err, dispatch, actions(method.ERR));
    if (err.status === 400) return onBadRequest(err, dispatch, actions(method.ERR));
    if (err.status === 401) return onUnauthorized(err, dispatch, actions(method.ERR));
    if (err.status === 403) return onForbidden(err, dispatch, actions(method.ERR));
    return onError(err);
  });
};

exports.default = {
  resources: resources,
  addResource: addResource,
  removeResource: removeResource,
  defaults: defaults,
  getReducers: getReducers,
  getList: getList
};