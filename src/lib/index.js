"use strict"

import request from "superagent"

let verbs = {
  get: {
    init: "FETCHING"
    ,success: "FETCH_OK"
    ,fail: "FETCH_ERROR"
  }
}

const get = (url, options, callback) => dispatch => {
  dispatch({ type: `USER_${ verbs.get.init }` })
  request
    .get(url)
    .set({})
    .end((err, resp) => {
      let {status, body } = resp
      dispatch({ type: `USER_${ verbs.get.success }`, status, body })
    })
}

const post = (url, payload, callback) => dispatch => {
  dispatch({ type: "POSTING_USERS" })
  request
    .post(url)
    .set({})
    .send(payload)
    .end((err, resp) => {

    })
}

const put = (url, payload, callback) => dispatch => {
  dispatch({ type: "UPDATING_USERS" })
  request
    .put(url)
    .set({})
    .send(payload)
    .end((err, resp) => {

    })
}

const del = (url) => dispatch => {

}

get("/users")

