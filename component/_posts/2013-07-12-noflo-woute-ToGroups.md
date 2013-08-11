---
  title: "ToGroups"
  library: "noflo-woute"
  layout: "component"

---

```coffeescript
querystring = require 'querystring'
noflo = require 'noflo'

class ToGroups extends noflo.Component
  constructor: ->
    @inPorts =
      in: new noflo.Port 'object'
    @outPorts =
      out: new noflo.Port 'object'

    @inPorts.in.on 'begingroup', (group) =>
      @outPorts.out.beginGroup group
    @inPorts.in.on 'endgroup', (group) =>
      @outPorts.out.endGroup group
    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()

    @inPorts.in.on 'data', (data) =>
      url = data.req.url.replace /\?.+$/, ''

      if data.req.url.match /\?/
        query = data.req.url.replace /^.+\?/, ''
        query = querystring.parse query
      else
        query = {}

      headers = data.req.headers
      body = data.req.body

```
Group these distinct parts

```coffeescript
      @outPorts.out.beginGroup 'url'
      @outPorts.out.send url
      @outPorts.out.endGroup()

      @outPorts.out.beginGroup 'headers'
      @outPorts.out.send headers
      @outPorts.out.endGroup()

      @outPorts.out.beginGroup 'query'
      @outPorts.out.send query
      @outPorts.out.endGroup()

      @outPorts.out.beginGroup 'body'
      @outPorts.out.send body
      @outPorts.out.endGroup()

      @outPorts.out.beginGroup 'request'
      @outPorts.out.send data
      @outPorts.out.endGroup()

exports.getComponent = -> new ToGroups

```