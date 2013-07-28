---
  title: "Range"
  library: "noflo-packets"
  layout: "component"

---

```coffeescript
noflo = require("noflo")
_ = require("underscore")
_s = require("underscore.string")

class Range extends noflo.Component

  description: _s.clean "only forward a specified number of packets in a
  connection"

  constructor: ->
    @start = -Infinity
    @end = +Infinity
    @length = +Infinity

    @inPorts =
      in: new noflo.Port
      start: new noflo.Port
      end: new noflo.Port
      length: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.start.on "data", (@start) =>
    @inPorts.end.on "data", (@end) =>
    @inPorts.length.on "data", (@length) =>

    @inPorts.in.on "connect", =>
      @totalCount = 0
      @sentCount = 0

    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup(group)

    @inPorts.in.on "data", (data) =>
      @totalCount++

      if @totalCount > @start and
         @totalCount < @end and
         @sentCount < @length
        @sentCount++
        @outPorts.out.send(data)

    @inPorts.in.on "endgroup", (group) =>
      @outPorts.out.endGroup()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()

exports.getComponent = -> new Range

```