"use strict"

import { defaults, generateActions } from "./index.js"
import R from "ramda"

/**
 * Default list reducer
 * @param name
 * @param initState
 * @returns {function()}
 */
export const defaultListReducer = (name, initState) => {
  const LIST = generateActions(name, { resourceType: defaults.list.name })
  const { GET } = defaults.methods

  return (state=initState, action) => {
    const { status } = action
    switch (action.type) {
      case LIST(GET.INIT).type:
        return R.merge( state, { fetching: true, status: null } )

      case LIST(GET.OK).type:
        return R.merge( state, { fetching: false, data: action.resp.body, resp: action.resp, status } )

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
export const defaultItemReducer = (name, initState) => {
  const ITEM = generateActions(name, { resourceType: defaults.item.name })
  const { GET, PUT, POST, DEL } = defaults.methods

  return (state=initState, action) => {
    const { status } = action
    switch (action.type) {
      case ITEM(GET.INIT).type:
        return R.merge( state, { fetching: true, status:  null } )

      case ITEM(GET.OK).type:
        return R.merge( state, { fetching: false, resp: action.resp, data: action.resp.body,  status } )

      case ITEM(GET.ERR).type:
        return R.merge(state, { fetching: false, err: action.err, status} )

      case ITEM(POST.INIT).type:
        return R.merge( state, { posting: true, status: null } )

      case ITEM(POST.OK).type:
        return R.merge( state, { posting: false, resp: action.resp, data: action.resp.body, status } )

      case ITEM(POST.ERR).type:
        return R.merge(state, { posting: false, err: action.err, status} )

      case ITEM(PUT.INIT).type:
        return R.merge( state, { updating: true, status: null } )

      case ITEM(PUT.OK).type:
        return R.merge( state, { updating: false, resp: action.resp, data: action.resp.body, status } )

      case ITEM(PUT.ERR).type:
        return R.merge(state, { updating: false, err: action.err, status} )

      case ITEM(DEL.INIT).type:
        return R.merge( state, { deleting: true, status: null } )

      case ITEM(DEL.OK).type:
        return R.merge( state, { deleting: false, resp: action.resp, data: action.resp.body, status } )

      case ITEM(DEL.ERR).type:
        return R.merge(state, { deleting: false, err: action.err, status} )

      default:
        return state
    }
  }
}