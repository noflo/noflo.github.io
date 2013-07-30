---
  title: "GetStargazers"
  library: "noflo-github"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
octo = require 'octo'

class GetStargazers extends noflo.AsyncComponent
  constructor: ->
    @token = null

    @inPorts =
      repository: new noflo.Port
      token: new noflo.Port
    @outPorts =
      out: new noflo.Port
      error: new noflo.Port

    @inPorts.token.on 'data', (data) =>
      @token = data

    super 'repository'

  doAsync: (repository, callback) ->
    api = octo.api()
    api.token @token if @token
    request = api.get "/repos/#{repository}/stargazers"
    request.on 'success', (res) =>
      @outPorts.out.beginGroup repository
      @outPorts.out.send user for user in res.body
      @outPorts.out.endGroup()
      return request.next() if request.hasnext()
      @outPorts.out.disconnect()
      callback()
    request.on 'error', (err) =>
      callback err.body
    @outPorts.out.connect()
    do request

exports.getComponent = -> new GetStargazers

```