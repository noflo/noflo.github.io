---
  title: "DeepCopy"
  library: "noflo-swiss"
  layout: "component"

---

```coffeescript
noflo = require("noflo")
owl = require("owl-deepcopy")

class DeepCopy extends noflo.Component

  description: "deep (recursive) copy all values an object"

  constructor: ->
    @inPorts =
      in: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup(group)

    @inPorts.in.on "data", (data) =>
      @outPorts.out.send(owl.deepCopy(data))

    @inPorts.in.on "endgroup", =>
      @outPorts.out.endGroup()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()

exports.getComponent = -> new DeepCopy

```