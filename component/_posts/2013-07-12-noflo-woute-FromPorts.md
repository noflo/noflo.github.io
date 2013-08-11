---
  title: "FromPorts"
  library: "noflo-woute"
  layout: "component"

---

```coffeescript
querystring = require 'querystring'
_ = require 'underscore'
noflo = require 'noflo'

class FromPorts extends noflo.Component
  constructor: ->
    @setup()

    @inPorts =
      status: new noflo.Port 'string'
      headers: new noflo.Port 'object'
      body: new noflo.Port 'string'
      request: new noflo.Port 'object'
    @outPorts =
      out: new noflo.Port 'object'

    @inPorts.request.on 'begingroup', (group) =>
      @groups.push group

    @inPorts.status.on 'data', (@status) =>
    @inPorts.headers.on 'data', (headers) =>
      _.extend @headers, headers
    @inPorts.body.on 'data', (body) =>
      @body += body
    @inPorts.request.on 'data', (@request) =>

    @inPorts.status.on 'disconnect', => @flush()
    @inPorts.headers.on 'disconnect', => @flush()
    @inPorts.body.on 'disconnect', => @flush()
    @inPorts.request.on 'disconnect', => @flush()

  flush: ->
    return unless @request

    @request.res.writeHead @status, @headers
    @request.res.write @body

    @outPorts.out.beginGroup group for group in @groups
    @outPorts.out.send @request
    @outPorts.out.endGroup() for group in @groups
    @outPorts.out.disconnect()

    @setup()

  setup: ->
    @groups = []
    @status = 200
    @headers = {}
    @body = ''
    @request = null

exports.getComponent = -> new FromPorts

```