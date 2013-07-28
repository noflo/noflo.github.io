---
  title: "ReverseSplit"
  library: "noflo-flow"
  layout: "component"

---

```coffeescript
noflo = require "noflo"
_ = require "underscore"
_s = require "underscore.string"

class ReverseSplit extends noflo.Component

  description: "Like Split, expect the last port gets forwarded packets first"

  constructor: ->
    @inPorts =
      in: new noflo.Port
    @outPorts =
      out: new noflo.ArrayPort

    @inPorts.in.on "connect", =>
      @portCount = @outPorts.out.sockets.length
      @forward "connect"

    @inPorts.in.on "begingroup", (group) =>
      @forward "beginGroup", group

    @inPorts.in.on "data", (data) =>
      @forward "send", data

    @inPorts.in.on "endgroup", (group) =>
      @forward "endGroup"

    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()

  forward: (operation, packet) ->
    for i in [@portCount-1..0]
      if operation is "beginGroup" or operation is "send"
        @outPorts.out[operation] packet, i
      else
        @outPorts.out[operation] i

exports.getComponent = -> new ReverseSplit

```