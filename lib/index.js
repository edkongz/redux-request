"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addResource = exports.getReducers = exports.getList = exports.resources = undefined;

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var configuration = {
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
  DEL: {
    INIT: "DELETING",
    OK: "DELETE_OK",
    ERR: "DELETE_ERR"
  },

  baseUrl: "",
  list: { name: "List" },
  item: { name: "Item" },

  onResponseData: function onResponseData(resp) {
    console.warn("SUCCESS DATA");
    return resp;
  },
  onResponseOk: function onResponseOk() {
    console.warn("SUCCESS Ok");
  },
  onResponseComplete: function onResponseComplete() {
    console.warn("COMPLETE");
  },
  onBadRequest: function onBadRequest(err) {
    console.warn("400 Bad Request");
  },
  onUnauthorized: function onUnauthorized(err) {
    console.warn("401 Unauthorized");
  },
  onForbidden: function onForbidden(err) {
    console.warn("403 Forbidden");
  },
  onServerError: function onServerError(err) {
    console.warn("500 Server error");
  },
  onError: function onError(err) {
    console.warn(err.status + ": " + err.response);
  }
};

var defaults = {
  contentType: "application/json",
  query: {},
  params: {},
  headers: {},
  payload: {},

  reducer: {
    fetching: false,
    updating: false,
    deleting: false,
    posting: false,
    status: null,
    data: null
  }
};

var resources = exports.resources = {
  school: { url: "/school" },
  scanner: { url: "/scanner" }
};

var getList = exports.getList = function getList(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  return function (dispatch) {
    var GET = configuration.GET;

    var actions = generateActions(name, options);
    dispatch(actions(GET.INIT));
    dispatchRequest("GET", name, options, function (err, resp) {
      return processRequest(err, resp, options, dispatch, actions);
    });
  };
};
// export const get = (name, options) => dispatch => {
//   const actions = generateActions(name, options)
//
//   dispatch(actions("init"))
//   dispatchRequest("GET", resources[name].url, (err, resp) => {
//     dispatch(actions())
//   })
// }
//
// export const put = (name, options) => dispatch => {
//   const actions = generateActions(name, options)
//
//   dispatch(actions("init"))
//   dispatchRequest("GET", resources[name].url, (err, resp) => {
//     dispatch(actions())
//   })
// }
//
// export const post = (name, options) => dispatch => {
//   const actions = generateActions(name, options)
//
//   dispatch(actions("init"))
//   dispatchRequest("GET", resources[name].url, (err, resp) => {
//     dispatch(actions())
//   })
// }
//
// export const del = (name, options) => dispatch => {
//   const actions = generateActions(name, options)
//
//   dispatch(actions("init"))
//   dispatchRequest("GET", resources[name].url, (err, resp) => {
//     dispatch(actions())
//   })
// }

var getReducers = exports.getReducers = function getReducers() {
  var reducers = {};

  var _loop = function _loop(resource) {
    var actions = generateActions(resource);
    var GET = configuration.GET;
    var PUT = configuration.PUT;
    var POST = configuration.POST;
    var DEL = configuration.DEL;
    // Generate LIST reducer

    reducers[resource + configuration.list.name] = function () {
      var state = arguments.length <= 0 || arguments[0] === undefined ? defaults.reducer : arguments[0];
      var action = arguments[1];

      switch (action.type) {
        case actions(GET.INIT).type:
          return Object.assign({}, state, { fetching: true, status: null });

        case actions(GET.OK).type:
          var _action$response = action.response;
          var status = _action$response.status;
          var body = _action$response.body;

          return Object.assign({}, state, { fetching: false, data: body, status: status });

        default:
          return state;
      }
    };

    // Generate ITEM reducer
    reducers[resource + configuration.item.name] = function () {
      var state = arguments.length <= 0 || arguments[0] === undefined ? defaults.reducer : arguments[0];
      var action = arguments[1];

      switch (action.type) {
        case actions(GET.INIT).type:
          return Object.assign({}, state, { fetching: true, status: null });

        case actions(GET.OK).type:
          var _action$response2 = action.response;
          var status = _action$response2.status;
          var body = _action$response2.body;

          return Object.assign({}, state, { fetching: false, data: body, status: status });

        default:
          return state;
      }
    };
  };

  for (var resource in resources) {
    _loop(resource);
  }
  return reducers;
};

var addResource = exports.addResource = function addResource(name, url, options) {
  return resources[name] = Object.assign({ url: url }, options);
};

var generateActions = function generateActions(name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var _options$resourceType = options.resourceType;
  var resourceType = _options$resourceType === undefined ? configuration.list.name : _options$resourceType;

  var base = name.toUpperCase() + "_" + resourceType.toUpperCase() + "_";
  return function (stage) {
    var updates = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    return Object.assign({ type: base + stage }, updates);
  };
};

var dispatchRequest = function dispatchRequest(method, name, options, response) {
  var _options$headers = options.headers;
  var headers = _options$headers === undefined ? defaults.headers : _options$headers;
  var _options$query = options.query;
  var query = _options$query === undefined ? {} : _options$query;
  var _options$params = options.params;
  var params = _options$params === undefined ? {} : _options$params;
  var _options$payload = options.payload;
  var payload = _options$payload === undefined ? {} : _options$payload;
  var _options$contentType = options.contentType;
  var contentType = _options$contentType === undefined ? options.contentType : _options$contentType;


  (0, _superagent2.default)(method, configuration.baseUrl + resources[name].url).set(headers).query(query).send(payload).type(contentType).end(response);
};

var processRequest = function processRequest(err, resp, options, dispatch, actions) {
  var _options$onResponseDa = options.onResponseData;
  var onResponseData = _options$onResponseDa === undefined ? configuration.onResponseData : _options$onResponseDa;
  var _options$onResponseOk = options.onResponseOk;
  var onResponseOk = _options$onResponseOk === undefined ? configuration.onResponseOk : _options$onResponseOk;
  var _options$onResponseCo = options.onResponseComplete;
  var onResponseComplete = _options$onResponseCo === undefined ? configuration.onResponseComplete : _options$onResponseCo;
  var _options$onServerErro = options.onServerError;
  var onServerError = _options$onServerErro === undefined ? configuration.onServerError : _options$onServerErro;
  var _options$onBadRequest = options.onBadRequest;
  var onBadRequest = _options$onBadRequest === undefined ? configuration.onBadRequest : _options$onBadRequest;
  var _options$onUnauthoriz = options.onUnauthorized;
  var onUnauthorized = _options$onUnauthoriz === undefined ? configuration.onUnauthorized : _options$onUnauthoriz;
  var _options$onForbidden = options.onForbidden;
  var onForbidden = _options$onForbidden === undefined ? configuration.onUnauthorized : _options$onForbidden;


  if (err === null) {
    resp = onResponseData(resp);
    onResponseOk(resp, dispatch, actions(GET.OK));
    return onResponseComplete(resp, dispatch);
  }

  if (err.status >= 500) return onServerError(err, dispatch, actions(GET.ERR).type);
  if (err.status === 400) return onBadRequest(err, dispatch, actions(GET.ERR).type);
  if (err.status === 401) return onUnauthorized(err, dispatch, actions(GET.ERR).type);
  if (err.status === 403) return onForbidden(err, dispatch, actions(GET.ERR).type);
  return onError(err);
};

exports.default = {
  resources: resources,
  defaults: defaults,
  configuration: configuration,
  getReducers: getReducers,
  getList: getList
};

// class ReduxRequest {
//   constructor(url, options) {
//     this.name = name
//     this.url = url
//     this.dispatch = store.dispatch
//   }
//   get() {
//     const { name, url, dispatch } = this
//     return new Promise(resolve => {
//       dispatch({ type:  })
//       request.get(url)
//         .set()
//         .end((err, resp) => {
//           dispatch({ type: [name, "LIST", get.verbs.ok].join("_")})
//           resolve(resp)
//         })
//     })
//   }
//
//   post() {
//
//   }
//   put() {
//
//   }
//   del() {
//
//   }
//   buildType(resourceType, state) {
//     return [nname, resourceType, get.verbs.init].join("_")
//   }
// }

//
// const get = (url, options, callback) => dispatch => {
//   dispatch({ type: `USER_${ verbs.get.init }` })
//   request
//     .get(url)
//     .set({})
//     .end((err, resp) => {
//       let {status, body } = resp
//       dispatch({ type: `USER_${ verbs.get.success }`, status, body })
//     })
// }
//
// const post = (url, payload, callback) => dispatch => {
//   dispatch({ type: "POSTING_USERS" })
//   request
//     .post(url)
//     .set({})
//     .send(payload)
//     .end((err, resp) => {
//
//     })
// }
//
// const put = (url, payload, callback) => dispatch => {
//   dispatch({ type: "UPDATING_USERS" })
//   request
//     .put(url)
//     .set({})
//     .send(payload)
//     .end((err, resp) => {
//
//     })
// }
//
// const del = (url) => dispatch => {
//
// }
//
// get("/users")
//