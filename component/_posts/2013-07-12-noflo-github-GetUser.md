---
  title: "GetUser"
  library: "noflo-github"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
octo = require 'octo'

class GetUser extends noflo.AsyncComponent
  constructor: ->
    @token = null

    @inPorts =
      user: new noflo.Port
      token: new noflo.Port
    @outPorts =
      out: new noflo.Port
      error: new noflo.Port

    @inPorts.token.on 'data', (data) =>
      @token = data

    super 'user'

  doAsync: (user, callback) ->
    api = octo.api()
    api.token @token if @token

    request = api.get "/users/#{user}"
    request.on 'success', (res) =>
      @outPorts.out.beginGroup user
      @outPorts.out.send res.body
      @outPorts.out.endGroup()
      @outPorts.out.disconnect()
      callback()
    request.on 'error', (err) =>
      @outPorts.out.disconnect()
      callback err.body
    @outPorts.out.connect()
    do request

exports.getComponent = -> new GetUser

```