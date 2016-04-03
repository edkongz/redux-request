"use strict"

import requests from "superagent"

let configuration = {
  GET: {
    INIT: "FETCHING"
    ,OK: "FETCH_OK"
    ,ERR: "FETCH_ERR"
  }
  ,POST: {
    INIT: "POSTING"
    ,OK: "POST_OK"
    ,ERR: "POST_ERR"
  }
  ,PUT: {
    INIT: "UPDATING"
    ,OK: "UPDATE_OK"
    ,ERR: "UPDATE_ERR"
  }
  ,DEL: {
    INIT: "DELETING"
    ,OK: "DELETE_OK"
    ,ERR: "DELETE_ERR"
  }

  ,baseUrl: ""
  ,list: { name: "List" }
  ,item: { name: "Item" }

  ,onResponseData(resp) {
    console.warn("SUCCESS DATA")
    return resp
  }
  ,onResponseOk() {
    console.log("HERE", this)
    console.warn("SUCCESS Ok")
  }
  ,onResponseComplete() {
    console.warn("COMPLETE")
  }
  ,onBadRequest(err) {
    console.warn(`${err.status}: ${err.response}`)
  }
  ,onUnauthorized(err) {
    console.warn(`${err.status}: ${err.response}`)
  }
  ,onForbidden(err) {
    console.warn(`${err.status}: ${err.response}`)
  }
  ,onServerError(err) {
    console.warn(`${err.status}: ${err.response}`)
  }
  ,onError(err) {
    console.warn(`${err.status}: ${err.response}`)
  }
}

let defaults = {
  contentType: "application/json"
  ,query: {}
  ,params: {}
  ,headers: {}
  ,payload: {}

  ,reducer: {
    fetching: false
    ,updating: false
    ,deleting: false
    ,posting: false
    ,status: null
    ,response: null
    ,error: null
  }
}

export let resources = {
  school: { url: "/school" }
  ,scanner: { url: "/scanner" }
}

/**
 * GET List
 * @param name
 * @param options
 * @returns {Function}
 */
export const getList = function(name, options={}) {
  const request = getList
  return function(dispatch) {
    const { GET } = configuration
    options = Object.assign(options, { _method: GET, resourceType: configuration.list.name })
    const actions = generateActions(name, options)
    dispatch(actions(GET.INIT))
    dispatchRequest(request, name, options, (err, resp) => processRequest(err, resp, request, options, dispatch, actions))
  }
}
getList.method = "GET"
getList.onResponseData = configuration.onResponseData
getList.onResponseOk = configuration.onResponseOk
getList.onResponseComplete = configuration.onResponseComplete
getList.onBadRequest = configuration.onBadRequest
getList.onUnauthorized = configuration.onUnauthorized
getList.onForbidden = configuration.onForbidden
getList.onServerError = configuration.onServerError

/**
 * GET Item
 * @param name
 * @param options
 * @returns {Function}
 */
export const get = function(name, options={}) {
  const request = get
  return function(dispatch) {
    const { GET } = configuration
    options = Object.assign(options, { _method: GET })
    const actions = generateActions(name, options)
    dispatch(actions(GET.INIT))
    dispatchRequest(request, name, options, (err, resp) => processRequest(err, resp, request, options, dispatch, actions))
  }
}
get.method = "GET"
get.method = "GET"
get.onResponseData = configuration.onResponseData
get.onResponseOk = configuration.onResponseOk
get.onResponseComplete = configuration.onResponseComplete
get.onBadRequest = configuration.onBadRequest
get.onUnauthorized = configuration.onUnauthorized
get.onForbidden = configuration.onForbidden
get.onServerError = configuration.onServerError
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

export const getReducers = () => {
  let reducers = {}
  for (let resource in resources) {
    const actions = generateActions(resource)
    const { GET, PUT, POST, DEL } = configuration
    // Generate LIST reducer
    reducers[resource + configuration.list.name] = (state = defaults.reducer, action) => {
      switch (action.type) {
        case actions(GET.INIT).type:
          return Object.assign({}, state, {fetching: true, status: null})

        case actions(GET.OK).type:
          const { status, body } = action.response
          return Object.assign({}, state, {fetching: false, response: body, status})

        default:
          return state
      }
    }

    // Generate ITEM reducer
    reducers[resource + configuration.item.name] = (state = defaults.reducer, action) => {
      switch (action.type) {
        case actions(GET.INIT).type:
          return Object.assign({}, state, {fetching: true, status: null})

        case actions(GET.OK).type:
          const {status, body} = action.response
          return Object.assign({}, state, {fetching: false, response: body, status})

        default:
          return state
      }
    }
  }
  return reducers
}

export const addResource = (name, url, options) => resources[name] = Object.assign({ url }, options)

const generateActions = (name, options={}) => {
  let { resourceType=configuration.item.name } = options
  let base = name.toUpperCase() + "_" + resourceType.toUpperCase() + "_"
  return (stage, updates={}) => Object.assign({ type: base + stage }, updates)
}

const dispatchRequest = (request, name, options, response) => {
  const { headers=defaults.headers, query={}, params={}, payload={}, contentType=options.contentType }=options

  requests(request.method, configuration.baseUrl + resources[name].url)
    .set(headers)
    .query(query)
    .send(payload)
    .type(contentType)
    .end(response)
}

const processRequest = (err, resp, request, options, dispatch, actions) => {
  const {
    onResponseData=request.onResponseData
    ,onResponseOk=request.onResponseOk
    ,onResponseComplete=request.onResponseComplete
    ,onServerError=request.onServerError
    ,onBadRequest=request.onBadRequest
    ,onUnauthorized=request.onUnauthorized
    ,onForbidden=request.onUnauthorized
    ,_method
  } = options

  if (err === null) {
    resp = onResponseData(resp)
    onResponseOk(resp, dispatch, actions(_method.OK))
    return onResponseComplete(resp, dispatch)
  }

  if (err.status >= 500) return onServerError(err, dispatch, actions(_method.ERR).type)
  if (err.status === 400) return onBadRequest(err, dispatch, actions(_method.ERR).type)
  if (err.status === 401) return onUnauthorized(err, dispatch, actions(_method.ERR).type)
  if (err.status === 403) return onForbidden(err, dispatch, actions(_method.ERR).type)
  return onError(err)
}

export default {
  resources
  ,defaults
  ,configuration
  ,getReducers
  ,getList
  ,get
}

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
