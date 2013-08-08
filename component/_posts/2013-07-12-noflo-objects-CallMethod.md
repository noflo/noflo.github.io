---
  title: "CallMethod"
  library: "noflo-objects"
  layout: "component"

---

```coffeescript
noflo = require("noflo")

class CallMethod extends noflo.Component

  description: "call a method on an object"

  constructor: ->
    @method = null

    @inPorts =
      in: new noflo.Port 'object'
      method: new noflo.Port 'string'
    @outPorts =
      out: new noflo.Port 'all'
      error: new noflo.Port 'string'

    @inPorts.in.on "data", (data) =>
      return unless @method
      unless data[@method]
        msg = "Method '#{@method}' not available"
        if @outPorts.error.isAttached()
          @outPorts.error.send msg
          @outPorts.error.disconnect()
          return
        throw new Error msg

      @outPorts.out.send data[@method].call(data)

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()

    @inPorts.method.on "data", (data) =>
      @method = data

exports.getComponent = -> new CallMethod

```