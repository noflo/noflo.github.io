---
  title: "Match"
  library: "noflo-woute"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'

class Match extends noflo.Component
  constructor: ->
    @matches = null
    @methods = null
    @groups = null

    @inPorts =
      in: new noflo.Port 'object'
      match: new noflo.Port 'string'
      method: new noflo.Port 'string'
    @outPorts =
      out: new noflo.Port 'object'
      fail: new noflo.Port 'object'

    @inPorts.match.on 'data', (match) =>
      @matches ?= []
      @matches.push new RegExp match

    @inPorts.method.on 'data', (method) =>
      @methods ?= []
      @methods.push method.toLowerCase()

    @inPorts.in.on 'connect', =>
      @groups = []
    @inPorts.in.on 'begingroup', (group) =>
      @groups.push group
    @inPorts.in.on 'endgroup', (group) =>
      @groups.pop()
    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect() if @outPorts.out.isAttached()
      @outPorts.fail.disconnect() if @outPorts.fail.isAttached()

    @inPorts.in.on 'data', (data) =>
      success = true

```
Match HTTP methods

```coffeescript
      if @methods?
        method = data.req.method.toLowerCase()
        success = false unless @methods.indexOf(method) > -1

```
Match URL

```coffeescript
      if @matches
        url = data.req.url.replace (new RegExp('\\?.+$')), ''
        matched = false
        for match in @matches
          matched = true if url.match(match)?
        success = false unless matched

```
If all pass, forward to OUT; FAIL otherwise

```coffeescript
      if success
        @output 'out', data
      else
        @output 'fail', data

  output: (portName, data) ->
    port = @outPorts[portName]

    port.beginGroup group for group in @groups
    port.send data
    port.endGroup() for group in @groups

exports.getComponent = -> new Match

```