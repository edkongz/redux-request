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

Redux-request is aimed at being highly configurable. Every stage and resource can be fine tuned.

Example

```javascript
// For every request set the default response handler
api.defaults.onResponseData = (resp) => {
  // Do stuff
  return resp
}

// For every getList request set the response handler
api.getList.onReponseData = (resp) => {
  // Do stuff
  return resp
}

// For this resource set the response handler
api.addResource("users", {
  onResponseData(resp) {
    // Do stuff
  	return resp
  }
})

// For every getList for this resource set the response handler
api.addResource("user", {
  getList: {
  	onResponseData(resp) {
  	  // Do stuff
      return resp
    }
  }
})

// For this individual request set the response handler
api.getList("users", {
  onResponseData(resp) {
    // Do stuff
    return resp
  }
})
```

 