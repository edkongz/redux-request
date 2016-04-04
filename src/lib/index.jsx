"use strict"

import requests from "superagent"
import R from "ramda"

let stages = {
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
}

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

let defaults = {
  baseUrl: ""
  ,contentType: "application/json"
  ,query: {}
  ,params: {}
  ,headers: {}
  ,payload: {}

  ,list: {
    name: "List"
    ,reducer: {
      fetching: false
      ,updating: false
      ,deleting: false
      ,posting: false
      ,status: null
      ,pageNumber: 0
      ,perPage: 100
      ,resp: null
      ,err: null
    }
  }

  ,item: {
    name: "Item"
    ,reducer: {
      fetching: false
      ,updating: false
      ,deleting: false
      ,posting: false
      ,status: null
      ,resp: null
      ,err: null
    }
  }

  ,methods: {
    GET: {
      name: "GET"
      ,INIT: "FETCHING"
      ,OK: "FETCH_OK"
      ,ERR: "FETCH_ERR"
    }
    ,POST: {
      name: "POST"
      ,INIT: "POSTING"
      ,OK: "POST_OK"
      ,ERR: "POST_ERR"
    }
    ,PUT: {
      name: "PUT"
      ,INIT: "UPDATING"
      ,OK: "UPDATE_OK"
      ,ERR: "UPDATE_ERR"
    }
    ,DEL: {
      name: "DELETE"
      ,INIT: "DELETING"
      ,OK: "DELETE_OK"
      ,ERR: "DELETE_ERR"
    }
  }

  ,onResponseData(resp, dispatch) {
    console.warn("SUCCESS DATA")
    return resp
  }
  ,onResponseOk(resp, dispatch, action) {
    console.warn("SUCCESS Ok")
    dispatch(R.merge(action, resp))
  }
  ,onResponseComplete(resp, dispatch) {
    console.warn("COMPLETE")
  }
  ,onBadRequest(err, dispatch, action) {
    console.warn(`${err.status}: ${err.response}`)
    dispatch(R.merge(action, { err }))
  }
  ,onUnauthorized(err, dispatch, action) {
    console.warn(`${err.status}: ${err.response}`)
    dispatch(R.merge(action, { err }))
  }
  ,onForbidden(err, dispatch, action) {
    console.warn(`${err.status}: ${err.response}`)
    dispatch(R.merge(action, { err }))
  }
  ,onServerError(err, dispatch, action) {
    console.warn(`${err.status}: ${err.response}`)
    dispatch(R.merge(action, { err }))
  }
  ,onError(err, dispatch, action) {
    console.warn(`${err.status}: ${err.response}`)
    dispatch(R.merge(action, { err }))
  }
}


export const resources = new Map()
export const addResource = (name, url, options) => resources.set(name, R.merge({ url }, options))
export const removeResource = name => resources.delete(name)

/**
 * GET List
 * @param name
 * @param options
 * @returns {Function}
 */
export const getList = function(name, options={}) {
  const request = getList
  return function(dispatch) {
    options = R.merge({ resourceType: defaults.list.name }, options)
    const actions = generateActions(name, options)
    dispatchRequest(request, name, options, dispatch, actions)
  }
}
getList.method = defaults.methods.GET
getList.onResponseData = defaults.onResponseData
getList.onResponseOk = defaults.onResponseOk
getList.onResponseComplete = defaults.onResponseComplete
getList.onBadRequest = defaults.onBadRequest
getList.onUnauthorized = defaults.onUnauthorized
getList.onForbidden = defaults.onForbidden
getList.onServerError = defaults.onServerError

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

export const getReducers = () => {
  let reducers = {}
  for (let resource in resources) {
    if(resource.reducer && resource.reducer === false) continue

    const { GET, PUT, POST, DEL } = stages

    // Generate LIST reducer
    const LIST = generateActions(resource, { resourceType: defaults.list.name })
    reducers[resource + defaults.list.name] = (state = defaults.item.reducer, action) => {
      switch (action.type) {
        case LIST(GET.INIT).type:
          return Object.assign({}, state, {fetching: true, status: null})

        case LIST(GET.OK).type:
          const { status, body } = action.resp
          return Object.assign({}, state, {fetching: false, resp: body, status })

        case LIST(GET.ERR).type:
          return Object.assign({}, state, {
            status: action.err.status
            ,resp: null
            ,err: action.err
          })

        default:
          return state
      }
    }

    // Generate ITEM reducer
    const ITEM = generateActions(resource, { resourceType: defaults.item.name })
    reducers[resource + defaults.item.name] = (state = defaults.list.reducer, action) => {
      const { status } = action

      switch (action.type) {
        case ITEM(GET.INIT).type:
          return R.merge( state, { fetching: true, status:  null } )

        case ITEM(GET.OK).type:
          return R.merge( state, { fetching: false, resp: action.body, status } )

        case ITEM(GET.ERR).type:
          return R.merge(state, { fetching: false, err: action.err, status} )

        case ITEM(POST.INIT).type:
          return R.merge( state, { posting: true, status: null } )

        case ITEM(POST.OK).type:
          return R.merge( state, { posting: false, resp: action.body, status } )

        case ITEM(POST.ERR).type:
          return R.merge(state, { posting: false, err: action.err, status} )

        case ITEM(PUT.INIT).type:
          return R.merge( state, { updating: true, status: null } )

        case ITEM(PUT.OK).type:
          return R.merge( state, { updating: false, resp: action.body, status } )

        case ITEM(PUT.ERR).type:
          return R.merge(state, { updating: false, err: action.err, status} )

        case ITEM(DEL.INIT).type:
          return R.merge( state, { deleting: true, status: null } )

        case ITEM(DEL.OK).type:
          return R.merge( state, { deleting: false, resp: action.body, status } )

        case ITEM(DEL.ERR).type:
          return R.merge(state, { deleting: false, err: action.err, status} )

        default:
          return state
      }
    }
  }
  return reducers
}

const generateActions = (name, options={}) => {
  let { resourceType=defaults.item.name } = options
  let base = name.toUpperCase() + "_" + resourceType.toUpperCase() + "_"
  return (stage, updates={}) => Object.assign({ type: base + stage }, updates)
}

const dispatchRequest = (request, name, options, dispatch, actions) => {
  const { method } = request
  const {
    headers=defaults.headers,
    query={},
    params={},
    payload={},
    contentType=options.contentType,
  } = options

  dispatch(actions(method.INIT))

  requests(method.name, defaults.baseUrl + resources.get(name).url)
    .set(headers)
    .query(query)
    .send(payload)
    .type(contentType)
    .end((err, resp) => {
      const {
        onResponseData=request.onResponseData
        ,onResponseOk=request.onResponseOk
        ,onResponseComplete=request.onResponseComplete
        ,onServerError=request.onServerError
        ,onBadRequest=request.onBadRequest
        ,onUnauthorized=request.onUnauthorized
        ,onForbidden=request.onUnauthorized
      } = options

      if (err === null) {
        resp = onResponseData(resp)
        onResponseOk(resp, dispatch, actions(method.OK))
        return onResponseComplete(resp, dispatch)
      }

      if (err.status >= 500) return onServerError(err, dispatch, actions(method.ERR))
      if (err.status === 400) return onBadRequest(err, dispatch, actions(method.ERR))
      if (err.status === 401) return onUnauthorized(err, dispatch, actions(method.ERR))
      if (err.status === 403) return onForbidden(err, dispatch, actions(method.ERR))
      return onError(err)
    })
}

const requestError = (err, dispatch, action) => {
  console.warn(`${err.status}: ${err.response}`)
  dispatch(R.merge(action, { err }))
}

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

export default {
  resources
  ,addResource
  ,removeResource
  ,defaults
  ,stages
  ,getReducers
  ,getList
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
