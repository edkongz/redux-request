# Redux-Request

Redux-Request simplifies Restful API calls using redux. It follows the convention of "configuration" over "code" and is designed for applications that make a lot of API calls.

Example:

```javascript
import api from "redux-request";

api.addResource({ name: "users", url: "/users"})

dispatch(api.getList("users"))
```

