# Redux-Request

Redux-Request simplifies Restful API calls using redux. It follows the convention of "configuration" over "code" and is designed for applications that make a lot of API calls.

Example:

```javascript
import api from "redux-request";

api.setBaseUrl("http://localhost:3000")
api.addResource("users")

// GET http://localhost:3000/users
dispatch(api.getList("users"))
```

Redux-request is aimed at being highly configurable at every stage of  the request lifecycle and at every level.

## Quick start

Requirements:

+ Redux-thunk

```javascript
import api from "redux-request"

// set the base url for all requests
api.setBaseUrl("http://localhost:3000")

// Configure a new resource
api.addResource("users")

// Configure a new resource with a different url
api.addResource("users", "http://github.com/api")

// Generate reducers and add them to your store (optional)
const apiReducers = api.getReducers()

// Start dispatching requests
// GET http://localhost:3000/users
store.dispatch(api.getList("users"))

// GET http://localhost:3000/users/1
store.dispatch(api.get("users", 1))

// PUT http://localhost:3000/users/12
store.dispatch(api.put("users", 12, {payload: { key: "value" }}))
```

## Configuration

Redux-request is designed to be highly configurable at every step of each request and at every level of each resource.

After a request has been dispatched the following callbacks are run:

1. `onData(resp, dispatch)`  *Request has succeeded and has a response but no action has been dispatched*.
2. `onResponse(resp, dispatch, action)` *Request has succeeded and the default action will be dispatched, override if you do not want to dispatch the default action*
3. `onComplete(resp, dispatch)` *Request has completed and the action has been dispatched*

If there was an error the following callbacks are run:

+ `onBadRequest (resp, dispatch, action)`  *– HTTP 400*
+ `onUnauthorized (resp, dispatch, action)` *– HTTP 401*
+ `onForbidden (resp, dispatch, action)` *– HTTP 403*
+ `onServerError (resp, dispatch, action)`  *– 500+*
+ `onError (resp, dispatch, action)` 

Every request callback can be configured at different levels

```javascript
// Global default onData callback
api.events.onData = resp => resp

// Every GET request onData callback
api.get.onData = resp => resp

// For a resource set onData callback
api.addResource("myResource", { onData: resp => resp })

// For every GET request for a resource set onData callback
api.addResource("myResource", { get: { onData: resp => resp }})

// For just this request set the onData callback
api.get("myResource", { onData: resp => resp })
```
