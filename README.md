# Redux-Request

Redux-Request simplifies Restful API calls using redux. It follows the convention of "configuration" over "code" and is designed for applications that make a lot of API calls.

Example:

```javascript
import api from "redux-request";

api.defaults.baseUrl = "http://localhost:3000"
api.addResource("users")

// GET http://localhost:3000/users
dispatch(api.getList("users"))
```

Redux-request is aimed at being highly configurable at every stage of  the request lifecycle and at every level.

To set the handler when data is received but *before* the action is dispatched

```javascript
api.defaults.onData = (resp) => {
  // Do stuff
  return modified
}
```

To override and dispatch your own action

```javascript
api.defaults.onResponse = (resp, action) => {
  dispatch(customAction())
}
```

To run something after the response is complete

```javascript
api.defaults.onComplete = (resp) => {
  // do stuff	
}
```

You can change the global default for each event

```javascript
api.defaults.onData = (resp) => { // Do Stuff }
```

You can change the events for each type of request

```javascript
api.getList.onData = (resp) => { // Do Stuff }
```

You can change the events for a particular resource

```javascript
api.addResource("resource", { 
	getList: { 
		onData = (resp) => { // Do Stuff }
	}
})
```

You can change the event for a single request

```javascript
api.getList("resource", { 
	onData: resp => "DO stuff"
})
```

It can generate all the reducers you need
```javascript
api.addResource("users")
api.getReducers()
```
