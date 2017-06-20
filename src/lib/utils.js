"use strict"

import R from "ramda"

export const parseRequestArgs = R.pipe(
  R.ifElse(
    R.pipe(R.last, R.is(Object)),
    R.identity,
    R.append({})
  ),
  R.splitAt(-1),
  R.adjust(R.join("/"), 0),
  R.flatten,
  R.zipObj(["_path", "_options"])
)


//export const buildRequestObject = R.pipe(
//
//)
//
//
export const dispatchRequest = (name, url, options) => dispatch =>  {
  dispatch(actions(name, "init")) 
}
export const completeRequest = options => (err, resp) => {

}
//export const processResults = (err, resp) => {
//
//}
//
export const actions = (name, state) => `${name}_HTTP_${state}`.toUpperCase()

export const generateReducer = (name, initialState={}) => {
  return (state=initialState, action) => {
    switch(action.type) {
      case actions(name, "init"):
        return Object.assign({}, state, { status }=action, {
          resp: null,
          data: null
        })

      case actions(name, "ok"):
        return Object.assign({}, state, { status, resp }=action, {
          data: null
        })

      case buildAction(name, "err"):
        return Object.assign({}, state, { status, resp }=action, {
          data: null
        })
      
      default:
        return state
    }
  }
}