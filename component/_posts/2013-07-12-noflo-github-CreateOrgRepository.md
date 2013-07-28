---
  title: "CreateOrgRepository"
  library: "noflo-github"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
octo = require 'octo'

class CreateOrgRepository extends noflo.AsyncComponent
  constructor: ->
    @token = null
    @organization = null

    @inPorts =
      in: new noflo.Port
      org: new noflo.Port
      token: new noflo.Port
    @outPorts =
      out: new noflo.Port
      error: new noflo.Port

    @inPorts.org.on 'data', (data) =>
      @organization = data

    @inPorts.token.on 'data', (data) =>
      @token = data

    super()

  doAsync: (repo, callback) ->
    api = octo.api()

    unless @organization
      callback new Error 'organization name required'
      return

    unless @token
      callback new Error 'token required'
      return
    api.token @token

    request = api.post "/orgs/#{@organization}/repos",
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

exports.getComponent = -> new CreateOrgRepository

```