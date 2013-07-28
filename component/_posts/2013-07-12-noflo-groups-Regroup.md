---
  title: "Regroup"
  library: "noflo-groups"
  layout: "component"

---

```coffeescript
noflo = require("noflo")
_s = require("underscore.string")

class Regroup extends noflo.Component

  description: _s.clean "Forward all the data IPs, strip all groups, and
    replace them with groups from another connection"

  constructor: ->
    @groups = []

    @inPorts =
      in: new noflo.Port
      group: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.group.on "connect", =>
      @groups = []

    @inPorts.group.on "data", (group) =>
      @groups.push(group)

    @inPorts.in.on "connect", =>
      for group in @groups
        @outPorts.out.beginGroup(group)

    @inPorts.in.on "data", (data) =>
      @outPorts.out.send(data)

    @inPorts.in.on "disconnect", =>
      for group in @groups
        @outPorts.out.endGroup()

      @outPorts.out.disconnect()

exports.getComponent = -> new Regroup

```