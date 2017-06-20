"use strict"

import R from "ramda"
import http from "superagent"

const resources = new Map()

const defaults = {
  baseUrl: ""
  ,contentType: "application/json"
  ,query: {}
  ,headers: {}
  ,payload: {}
}

const states = {
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
}

const buildRequest = (method) => (name, ...args) => {
  if(!resources.has(name)) throw new ReferenceError(`No resource found named: ${name}`)

  const [path, options] = parseRequestArgs(args)
  return function(dispatch) {
    dispatchRequest(name, method, path, options, dispatch)
  }
}

const parseRequestArgs = R.pipe(
  R.ifElse(
    R.pipe(R.last, R.is(Object)),
    R.identity,
    R.append({})
  ),
  e => [R.join("/", R.init(e)), R.last(e)]
)

const dispatchRequest = (name, method, path, options, dispatch) => {
  const resource = resources.get(name)
  const url = R.join("/", [resource.baseUrl, path])

  const {
    headers=defaults.headers,
    query={},
    payload={},
    contentType=defaults.contentType,
  }=options

  return http(method, url)
    .set(headers)
    .query(query)
    .send(payload)
    .type(contentType)
    .end((err, resp) => {

    })
}

const addResource = (name, options) => {
  resources.set(name, {
    baseUrl: R.join("/", [defaults.baseUrl, name]),
    reducerName: R.propOr(name, "reducerName", options)
  })
}

const buildAction = (method, state, data) => {

}

const getReducers = () => {

}

get("projects", "12345")