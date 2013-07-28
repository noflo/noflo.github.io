---
  title: "ReadEnv"
  library: "noflo-core"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'

class ReadEnv extends noflo.Component
  constructor: ->
    @inPorts =
      key: new noflo.Port 'string'
    @outPorts =
      out: new noflo.ArrayPort 'string'
      error: new noflo.Port 'string'

    @inPorts.key.on 'data', (data) =>
      if process.env[data] isnt undefined
        @outPorts.out.send process.env[data]
        @outPorts.out.disconnect()
        return
      if @outPorts.error.isAttached()
        @outPorts.error.send "No environment variable #{data} set"
        @outPorts.error.disconnect()

exports.getComponent = -> new ReadEnv

```