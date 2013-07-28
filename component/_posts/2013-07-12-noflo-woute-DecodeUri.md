---
  title: "DecodeUri"
  library: "noflo-woute"
  layout: "component"

---

```coffeescript
noflo = require("noflo")

class DecodeUri extends noflo.Component

  description: "Run each data packet through `decodeURIComponent`"

  constructor: ->
    @inPorts =
      in: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup group

    @inPorts.in.on "data", (data) =>
      @outPorts.out.send decodeURIComponent data

    @inPorts.in.on "endgroup", (group) =>
      @outPorts.out.endGroup()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()

exports.getComponent = -> new DecodeUri

```