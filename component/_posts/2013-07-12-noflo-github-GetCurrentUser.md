---
  title: "GetCurrentUser"
  library: "noflo-github"
  layout: "component"

---

    noflo = require 'noflo'
    octo = require 'octo'
    
    class GetCurrentUser extends noflo.AsyncComponent
      constructor: ->
        @token = null
    
        @inPorts =
          token: new noflo.Port
        @outPorts =
          out: new noflo.Port
          error: new noflo.Port
    
        super 'token'
    
      doAsync: (token, callback) ->
        api = octo.api()
        api.token token
        request = api.get "/user"
        request.on 'success', (res) =>
          @outPorts.out.send res.body
          @outPorts.out.disconnect()
          callback()
        request.on 'error', (err) =>
          @outPorts.out.disconnect()
          callback err.body
        @outPorts.out.connect()
        do request
    
    exports.getComponent = -> new GetCurrentUser
    
