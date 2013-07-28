---
  title: "PushDelta"
  library: "noflo-ducksboard"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
https = require 'https'

class PushDelta extends noflo.AsyncComponent
  constructor: ->
    @token = null
    @endpoint = null

    @inPorts =
      in: new noflo.Port
      endpoint: new noflo.Port
      token: new noflo.Port
    @outPorts =
      out: new noflo.Port
      error: new noflo.Port

    @inPorts.endpoint.on 'data', (data) =>
      @endpoint = data

    @inPorts.token.on 'data', (data) =>
      @token = data

    super()

  doAsync: (value, callback) ->
    unless @token
      callback new Error 'no API key provided'
      return
    unless @endpoint
      callback new Error 'no endpoint provided'
      return

    @push
      delta: parseInt value
      endpoint: @endpoint
    , @token, (err, res) =>
      return callback err if err
      @outPorts.out.beginGroup @endpoint
      @outPorts.out.send res
      @outPorts.out.endGroup()
      @outPorts.out.disconnect()
      callback()
 
  push: (data, apiKey, cb) ->
    body = JSON.stringify
      delta: data.delta
    options =
      host: 'push.ducksboard.com'
      port: 443
      path: "/v/" + data.endpoint
      method: "POST"
      auth: apiKey + ":x"
      headers:
        "Content-Type": "application/x-www-form-urlencoded"
        "Content-Length": body.length
    req = https.request options, (res) ->
      res.setEncoding "utf8"
      data = ''
      res.on "data", (chunk) ->
        data += chunk
      res.on "end", ->
        cb null, JSON.parse data
    req.on 'error', (e) ->
      cb e, null
    req.write body
    req.end()

exports.getComponent = -> new PushDelta

```