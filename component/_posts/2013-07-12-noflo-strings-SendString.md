---
  title: "SendString"
  library: "noflo-strings"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'

class SendString extends noflo.Component
  constructor: ->
    @string = ''
    @inPorts =
      string: new noflo.Port 'string'
      in: new noflo.Port 'bang'
    @outPorts =
      out: new noflo.Port 'string'

    @inPorts.string.on 'data', (data) =>
      @string = data

    @inPorts.in.on 'data', (data) =>
      @outPorts.out.send @string

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()

exports.getComponent = -> new SendString

```