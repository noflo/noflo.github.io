---
  title: "EscapeQuotes"
  library: "noflo-strings"
  layout: "component"

---

```coffeescript
noflo = require("noflo")
_ = require("underscore")

class EscapeQuotes extends noflo.Component

  description: "Escape all quotes in a string"

  constructor: ->
    @inPorts =
      in: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup(group)

    @inPorts.in.on "data", (data) =>
      @outPorts.out.send data.replace /\"/g, "\\\""

    @inPorts.in.on "endgroup", (group) =>
      @outPorts.out.endGroup()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()

exports.getComponent = -> new EscapeQuotes

```