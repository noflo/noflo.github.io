---
  title: "StringTemplate"
  library: "noflo-strings"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
_ = require 'underscore'

class StringTemplate extends noflo.Component
  constructor: ->
    @template = null
    @inPorts =
      template: new noflo.Port 'string'
      in: new noflo.Port 'object'
    @outPorts =
      out: new noflo.Port 'string'

    @inPorts.template.on 'data', (data) =>
      @template = _.template data

    @inPorts.in.on 'data', (data) =>
      @outPorts.out.send @template data
    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()

exports.getComponent = -> new StringTemplate

```