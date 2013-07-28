---
  title: "SendWith"
  library: "noflo-packets"
  layout: "component"

---

```coffeescript
noflo = require("noflo")
_ = require("underscore")
_s = require("underscore.string")

class SendWith extends noflo.Component

  description: "Always send the specified packets with incoming packets."

  constructor: ->
    @with = []

    @inPorts =
      in: new noflo.Port
      with: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.with.on "connect", =>
      @with = []
    @inPorts.with.on "data", (data) =>
      @with.push data

    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup group
    @inPorts.in.on "data", (data) =>
      @outPorts.out.send data
    @inPorts.in.on "endgroup", (group) =>
      @outPorts.out.endGroup()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.send packet for packet in @with
      @outPorts.out.disconnect()

exports.getComponent = -> new SendWith

```