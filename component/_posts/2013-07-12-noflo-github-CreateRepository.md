---
  title: "CreateRepository"
  library: "noflo-github"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
octo = require 'octo'

class CreateRepository extends noflo.AsyncComponent
  constructor: ->
    @token = null

    @inPorts =
      in: new noflo.Port
      token: new noflo.Port
    @outPorts =
      out: new noflo.Port
      error: new noflo.Port

    @inPorts.token.on 'data', (data) =>
      @token = data

    super()

  doAsync: (repo, callback) ->
    api = octo.api()

    unless @token
      callback new Error 'token required'
      return
    api.token @token

    request = api.post '/user/repos',
      name: repo

    request.on 'success', (res) =>
      @outPorts.out.beginGroup repo
      @outPorts.out.send res.body
      @outPorts.out.endGroup()
      @outPorts.out.disconnect()
      callback()
    request.on 'error', (err) =>
      @outPorts.out.disconnect()
      callback err.body

    @outPorts.out.connect()
    do request

exports.getComponent = -> new CreateRepository

```