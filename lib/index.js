"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReducers = exports.getList = exports.removeResource = exports.addResource = exports.resources = undefined;

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

var _ramda = require("ramda");

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stages = {
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
  }
};

// let configuration = {
//   baseUrl: ""
//   ,list: { name: "List" }
//   ,item: { name: "Item" }
//
//   // ,onResponseData(resp) {
//   //   console.warn("SUCCESS DATA")
//   //   return resp
//   // }
//   // ,onResponseOk() {
//   //   console.warn("SUCCESS Ok")
//   // }
//   // ,onResponseComplete() {
//   //   console.warn("COMPLETE")
//   // }
//   // ,onBadRequest(err, dispatch, action) {
//   //   console.warn(`${err.status}: ${err.response}`)
//   // }
//   // ,onUnauthorized(err, dispatch, action) {
//   //   console.warn(`${err.status}: ${err.response}`)
//   // }
//   // ,onForbidden(err, dispatch, action) {
//   //   console.warn(`${err.status}: ${err.response}`)
//   // }
//   // ,onServerError(err, dispatch, action) {
//   //   console.warn(`${err.status}: ${err.response}`)
//   // }
//   // ,onError(err, dispatch, action) {
//   //   dispatch({ type: action, err })
//   //   console.warn(`${err.status}: ${err.response}`)
//   // }
// }

var defaults = {
  baseUrl: "",
  contentType: "application/json",
  query: {},
  params: {},
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
  onBadRequest: function onBadRequest(err, dispatch, action) {
    console.warn(err.status + ": " + err.response);
    dispatch(_ramda2.default.merge(action, { err: err }));
  },
  onUnauthorized: function onUnauthorized(err, dispatch, action) {
    console.warn(err.status + ": " + err.response);
    dispatch(_ramda2.default.merge(action, { err: err }));
  },
  onForbidden: function onForbidden(err, dispatch, action) {
    console.warn(err.status + ": " + err.response);
    dispatch(_ramda2.default.merge(action, { err: err }));
  },
  onServerError: function onServerError(err, dispatch, action) {
    console.warn(err.status + ": " + err.response);
    dispatch(_ramda2.default.merge(action, { err: err }));
  },
  onError: function onError(err, dispatch, action) {
    console.warn(err.status + ": " + err.response);
    dispatch(_ramda2.default.merge(action, { err: err }));
  }
};

var resources = exports.resources = new Map();
var addResource = exports.addResource = function addResource(name, url, options) {
  return resources.set(name, _ramda2.default.merge({ url: url }, options));
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
  return function (dispatch) {
    options = _ramda2.default.merge({ resourceType: defaults.list.name }, options);
    var actions = generateActions(name, options);
    dispatchRequest(request, name, options, dispatch, actions);
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
// export const get = function(name, options={}) {
//   const request = get
//   return function(dispatch) {
//     const { GET } = configuration
//     options = Object.assign(options, { _method: GET })
//     const actions = generateActions(name, options)
//     // dispatchRequest(request, name, options, (err, resp) => processRequest(err, resp, request, options, dispatch, actions))
//     console.log(actions)
//     dispatchRequest(request, name, options, dispatch, actions)
//   }
// }
// get.method = "GET"
// get.onResponseData = configuration.onResponseData
// get.onResponseOk = configuration.onResponseOk
// get.onResponseComplete = configuration.onResponseComplete
// get.onBadRequest = configuration.onBadRequest
// get.onUnauthorized = configuration.onUnauthorized
// get.onForbidden = configuration.onForbidden
// get.onServerError = configuration.onServerError

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
    if (resource.reducer && resource.reducer === false) return "continue";

    var GET = stages.GET;
    var PUT = stages.PUT;
    var POST = stages.POST;
    var DEL = stages.DEL;

    // Generate LIST reducer

    var LIST = generateActions(resource, { resourceType: defaults.list.name });
    reducers[resource + defaults.list.name] = function () {
      var state = arguments.length <= 0 || arguments[0] === undefined ? defaults.item.reducer : arguments[0];
      var action = arguments[1];

      switch (action.type) {
        case LIST(GET.INIT).type:
          return Object.assign({}, state, { fetching: true, status: null });

        case LIST(GET.OK).type:
          var _action$resp = action.resp;
          var status = _action$resp.status;
          var body = _action$resp.body;

          return Object.assign({}, state, { fetching: false, resp: body, status: status });

        case LIST(GET.ERR).type:
          return Object.assign({}, state, {
            status: action.err.status,
            resp: null,
            err: action.err
          });

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

  var base = name.toUpperCase() + "_" + resourceType.toUpperCase() + "_";
  return function (stage) {
    var updates = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    return Object.assign({ type: base + stage }, updates);
  };
};

var dispatchRequest = function dispatchRequest(request, name, options, dispatch, actions) {
  var method = request.method;
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


  dispatch(actions(method.INIT));

  (0, _superagent2.default)(method.name, defaults.baseUrl + resources.get(name).url).set(headers).query(query).send(payload).type(contentType).end(function (err, resp) {
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

var requestError = function requestError(err, dispatch, action) {
  console.warn(err.status + ": " + err.response);
  dispatch(_ramda2.default.merge(action, { err: err }));
};

// const processRequest = (err, resp, request, options, dispatch, actions) => {
//   const {
//     onResponseData=request.onResponseData
//     ,onResponseOk=request.onResponseOk
//     ,onResponseComplete=request.onResponseComplete
//     ,onServerError=request.onServerError
//     ,onBadRequest=request.onBadRequest
//     ,onUnauthorized=request.onUnauthorized
//     ,onForbidden=request.onUnauthorized
//     ,_method
//   } = options
//
//   if (err === null) {
//     resp = onResponseData(resp)
//     onResponseOk(resp, dispatch, actions(_method.OK))
//     return onResponseComplete(resp, dispatch)
//   }
//
//   if (err.status >= 500) return onServerError(err, dispatch, actions(_method.ERR).type)
//   if (err.status === 400) return onBadRequest(err, dispatch, actions(_method.ERR).type)
//   if (err.status === 401) return onUnauthorized(err, dispatch, actions(_method.ERR).type)
//   if (err.status === 403) return onForbidden(err, dispatch, actions(_method.ERR).type)
//   return onError(err)
// }

exports.default = {
  resources: resources,
  addResource: addResource,
  removeResource: removeResource,
  defaults: defaults,
  stages: stages,
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