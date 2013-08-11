---
  title: "ToPorts"
  library: "noflo-woute"
  layout: "component"

---

```coffeescript
querystring = require 'querystring'
noflo = require 'noflo'

class ToPorts extends noflo.Component
  constructor: ->
    @inPorts =
      in: new noflo.Port 'object'
    @outPorts =
      url: new noflo.Port 'object'
      headers: new noflo.Port 'object'
      query: new noflo.Port 'object'
      body: new noflo.Port 'object'
      request: new noflo.Port 'object'

    @inPorts.in.on 'begingroup', (group) =>
      @sendToAll 'beginGroup', group
    @inPorts.in.on 'endgroup', (group) =>
      @sendToAll 'endGroup', group
    @inPorts.in.on 'disconnect', =>
      @sendToAll 'disconnect'

    @inPorts.in.on 'data', (data) =>
      url = data.req.url.replace /\?.+$/, ''

      if data.req.url.match /\?/
        query = data.req.url.replace /^.+\?/, ''
        query = querystring.parse query
      else
        query = {}

      headers = data.req.headers
      body = data.req.body

      @outPorts.url.send url if @outPorts.url.isAttached()
      @outPorts.headers.send headers if @outPorts.headers.isAttached()
      @outPorts.query.send query if @outPorts.query.isAttached()
      @outPorts.body.send body if @outPorts.body.isAttached()
      @outPorts.request.send data if @outPorts.request.isAttached()

  sendToAll: (operation, packet) ->
    for name, port of @outPorts
      if port.isAttached()
        port[operation] packet

exports.getComponent = -> new ToPorts

```