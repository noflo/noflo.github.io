---
  title: "PacketsToArray"
  library: "noflo-adapters"
  layout: "component"

---

```coffeescript
_ = require "underscore"
noflo = require "noflo"

class PacketsToArray extends noflo.Component

  description: "Merges incoming IPs into one array"

  constructor: ->
    @inPorts =
      in: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.in.on "connect", (group) =>
      @level = 0
      @data = [[]]

    @inPorts.in.on "begingroup", (group) =>
      @level++
      @data[@level] = []
      @outPorts.out.beginGroup group

    @inPorts.in.on "data", (data) =>
      @data[@level].push data

    @inPorts.in.on "endgroup", (group) =>
      @outPorts.out.send @data[@level] unless _.isEmpty @data[@level]
      @level--
      @outPorts.out.endGroup()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.send @data[0] unless _.isEmpty @data[0]
      @outPorts.out.disconnect()

exports.getComponent = -> new PacketsToArray

```