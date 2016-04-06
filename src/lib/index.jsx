"use strict"

import requests from "superagent"
import R from "ramda"

let defaults = {
  baseUrl: ""
  ,contentType: "application/json"
  ,query: {}
  ,headers: {}
  ,payload: {}

  ,list: {
    name: "List"
    ,reducer: defaultListReducer
    ,initState: {
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
    ,reducer: defaultItemReducer
    ,initState: {
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
    prefix: ""
    ,GET: {
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
}

const events = {
  onData(resp, dispatch) {
    console.warn("SUCCESS DATA")
    return resp
  }
  ,onResponse(resp, dispatch, action) {
    console.warn("SUCCESS Ok")
    dispatch(R.merge(action, { resp }))
  }
  ,onComplete(resp, dispatch) {
    console.warn("COMPLETE")
  }
  ,onBadRequest: requestError
  ,onUnauthorized: requestError
  ,onForbidden: requestError
  ,onServerError: requestError
  ,onError: requestError
}

const requestError = (err, dispatch, action) => {
  console.warn(`${err.status}: ${err.response}`)
  dispatch(R.merge(action, { status: err.status, err }))
}

export const resources = new Map()
export const addResource = (name, url, options) => {
  // If no url is supplied assume url is /name
  url = url || (/^\//.test(name) ? name : "/" + name)
  const baseUrl = /^https?/.test(url) ? "" : defaults.baseUrl

  let resource = R.merge({
    buildUrl: R.compose(R.concat(baseUrl), R.join("/"), R.prepend(url))
    ,reducerName: name
    ,url
  }, options)

  resources.set(name, resource)
}

export const removeResource = name => resources.delete(name)

/**
 * GET List
 * @param name
 * @param options
 * @returns {Function}
 */
export const getList = function(name, options={}) {
  name = checkResourceName(name)

  return function(dispatch) {
    options = R.merge({ resourceType: defaults.list.name }, options)
    dispatchRequest(getList, name, options, dispatch, generateActions(name[0], options))
  }
}

getList.method = defaults.methods.GET

/**
 * GET Item
 * @param name
 * @param options
 * @returns {Function}
 */
export const get = function(name, options={}) {
  name = checkResourceName(name)

  return function(dispatch) {
    options = R.merge( { resourceType: defaults.item.name }, options)
    return dispatchRequest(get, name, options, dispatch, generateActions(name, options))
  }
}
get.method = defaults.methods.GET

/**
 * POST Item
 * @param name
 * @param options
 * @returns {Function}
 */
export const post = function(name, options={}) {
  name = checkResourceName(name)

  return function(dispatch) {
    options = R.merge( { resourceType: defaults.item.name }, options)
    dispatchRequest(post, name, options, dispatch, generateActions(name, options))
  }
}
post.method = defaults.methods.POST

/**
 * PUT Item
 * @param name
 * @param options
 * @returns {Function}
 */
export const put = function(name, options={}) {
  name = checkResourceName(name)

  return function(dispatch) {
    options = R.merge( { resourceType: defaults.item.name }, options)
    dispatchRequest(put, name, options, dispatch, generateActions(name, options))
  }
}
put.method = defaults.methods.PUT

/**
 * DELETE Item
 * @param name
 * @param options
 * @returns {Function}
 */
export const del = function(name, options={}) {
  name = checkResourceName(name)

  return function(dispatch) {
    options = R.merge( { resourceType: defaults.item.name }, options)
    dispatchRequest(request, name, options, dispatch, generateActions(name, options))
  }
}
del.method = defaults.methods.DEL

const generateActions = (name, options={}) => {
  let { resourceType=defaults.item.name } = options

  const buildAction = R.compose(
    R.objOf("type"),
    R.join("_"),
    R.map(e => e.toUpperCase()),
    R.concat([name, resourceType])
  )
  return (stage, updates={}) => R.merge(buildAction([stage]), updates)
}

const checkResourceName = name => {
  if (R.type(name) === "String") name = [name]
  if (R.type(name) !== "Array") throw new TypeError("Resource name must be either a either string or an array of strings")
  if (!resources.has(name[0])) throw new ReferenceError(`No resource found named: ${name[0]}`)
  return R.map(e => e.toString(), name)
}

const generateEvents = (options, resource, request) => event => {
  const onEvent = `on${event}`
  return options[onEvent] || (resource[request.name] && resource[request.name][onEvent]) || resource[onEvent] || request[onEvent] || events[onEvent]
}

const dispatchRequest = (request, name, options, dispatch, actions) => {
  const { method } = request
  const {
    headers=defaults.headers,
    query={},
    payload={},
    contentType=defaults.contentType,
  }=options

  dispatch(actions(method.INIT))
  requests(method.name, resources.get(name.shift()).buildUrl([name]))
    .set(headers)
    .query(query)
    .send(payload)
    .type(contentType)
    .end((err, resp) => {
      const on = generateEvents(options, resource, request)

      if (err === null) {
        resp = on("Data")(resp)
        on("Response")(resp, dispatch, actions(method.OK))
        return on("Complete")(resp, dispatch)
      }

      if (err.status >= 500) return on("ServerError")(err, dispatch, actions(method.ERR))
      if (err.status === 400) return on("BadRequest")(err, dispatch, actions(method.ERR))
      if (err.status === 401) return on("Unauthorized")(err, dispatch, actions(method.ERR))
      if (err.status === 403) return on("Forbidden")(err, dispatch, actions(method.ERR))
      return on("Error")(err)
    })
}

/**
 * Generates reducers to add to store
 * @returns {{}}
 */
export const getReducers = () => {
  let reducers = {}
  for (let [name, resource] of resources) {
    if(resource.reducer && resource.reducer === false) continue
    reducers[resource.reducerName + defaults.list.name] = defaults.list.reducer(name, defaults.list.initState)
    reducers[resource.reducerName + defaults.item.name] = defaults.item.reducer(name, defaults.item.initState)
  }
  return reducers
}

/**
 * Default list reducer
 * @param name
 * @param initState
 * @returns {function()}
 */
const defaultListReducer = (name, initState) => {
  const LIST = generateActions(name, { resourceType: defaults.list.name })
  const { GET } = defaults.methods

  return (state=initState, action) => {
    const { status } = action
    switch (action.type) {
      case LIST(GET.INIT).type:
        return R.merge( state, { fetching: true, status: null } )

      case LIST(GET.OK).type:
        return R.merge( state, { fetching: false, resp: action.resp.body, status } )

      case LIST(GET.ERR).type:
        return R.merge(state, { fetching: false, err: action.err, status})

      default:
        return state
    }
  }
}

/**
 * Default item reducer
 * @param name
 * @param initState
 * @returns {function()}
 */
const defaultItemReducer = (name, initState) => {
  const ITEM = generateActions(name, { resourceType: defaults.item.name })
  const { GET, PUT, POST, DEL } = defaults.methods

  return (state=initState, action) => {
    const { status } = action
    switch (action.type) {
      case ITEM(GET.INIT).type:
        return R.merge( state, { fetching: true, status:  null } )

      case ITEM(GET.OK).type:
        return R.merge( state, { fetching: false, resp: action.resp.body, status } )

      case ITEM(GET.ERR).type:
        return R.merge(state, { fetching: false, err: action.err, status} )

      case ITEM(POST.INIT).type:
        return R.merge( state, { posting: true, status: null } )

      case ITEM(POST.OK).type:
        return R.merge( state, { posting: false, resp: action.resp.body, status } )

      case ITEM(POST.ERR).type:
        return R.merge(state, { posting: false, err: action.err, status} )

      case ITEM(PUT.INIT).type:
        return R.merge( state, { updating: true, status: null } )

      case ITEM(PUT.OK).type:
        return R.merge( state, { updating: false, resp: action.resp.body, status } )

      case ITEM(PUT.ERR).type:
        return R.merge(state, { updating: false, err: action.err, status} )

      case ITEM(DEL.INIT).type:
        return R.merge( state, { deleting: true, status: null } )

      case ITEM(DEL.OK).type:
        return R.merge( state, { deleting: false, resp: action.resp.body, status } )

      case ITEM(DEL.ERR).type:
        return R.merge(state, { deleting: false, err: action.err, status} )

      default:
        return state
    }
  }
}

function API(resource) {
  if(!resources.has(resource)) throw new ReferenceError(`No resource found named: ${resource}`)
  return {
    getList: options => getList(resource, options)
    ,get: options => get(resource, options)
    ,post: options => post(resource, options)
    ,put: options => put(resource, options)
    ,del: options => del(resource, options)
  }
}

export default Object.assign(API, {
  addResource
  ,removeResource
  ,getList
  ,get
  ,post
  ,put
  ,del

  ,setBaseUrl: url => defaults.baseUrl = url
  ,setDefaultHeaders: headers => defaults.headers = headers
  ,addDefaultHeader: header => defaults.headers = Object.assign(defaults.headers, header)
  ,setDefaultQuery: query => defaults.query = query
  ,setDefaultPayload: payload => defaults.payload = payload
  ,setContentType: contentType => defaults.contentType = contentType
  ,setDefaultListName: name => defaults.list.name = name
  ,setDefaultListReducer: reducer => defaults.list.reducer = reducer
  ,setDefaultListState: state => defaults.list.initState = state
  ,setDefaultItemName: name => defaults.item.name = name
  ,setDefaultItemReducer: reducer => defaults.item.reducer = reducer
  ,setDefaultItemState: state => defaults.item.initState = state
})