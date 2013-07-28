---
  title: "Jsonify"
  library: "noflo-strings"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
_ = require 'underscore'
_s = require 'underscore.string'

class Jsonify extends noflo.Component

  description: _s.clean "JSONify all incoming, unless a raw flag is set to
  exclude data packets that are pure strings"

  constructor: ->
    @raw = false

    @inPorts =
      in: new noflo.Port()
      raw: new noflo.Port()
    @outPorts =
      out: new noflo.Port()

    @inPorts.raw.on 'data', (raw) =>
      @raw = raw is 'true'

    @inPorts.in.on 'begingroup', (group) =>
      @outPorts.out.beginGroup group

    @inPorts.in.on 'data', (data) =>
      if @raw and _.isString data
        @outPorts.out.send data
        return

      @outPorts.out.send JSON.stringify data

    @inPorts.in.on 'endgroup', (group) =>
      @outPorts.out.endGroup()

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()

exports.getComponent = -> new Jsonify

```