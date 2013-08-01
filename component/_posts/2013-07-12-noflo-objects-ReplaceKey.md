---
  title: "ReplaceKey"
  library: "noflo-objects"
  layout: "component"

---

```coffeescript
noflo = require("noflo")

class ReplaceKey extends noflo.Component

  description: "given a regexp matching any key of an incoming
  object as a data IP, replace the key with the provided string"

  constructor: ->
    @patterns = {}

    @inPorts =
      in: new noflo.Port
      pattern: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.pattern.on "data", (@patterns) =>

    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup(group)

    @inPorts.in.on "data", (data) =>
      newKey = null

      for key, value of data
        for pattern, replace of @patterns
          pattern = new RegExp(pattern)

          if key.match(pattern)?
            newKey = key.replace(pattern, replace)
            data[newKey] = value
            delete data[key]

      @outPorts.out.send(data)

    @inPorts.in.on "endgroup", (group) =>
      @outPorts.out.endGroup()

    @inPorts.in.on "disconnect", =>
      @pattern = null

      @outPorts.out.disconnect()

exports.getComponent = -> new ReplaceKey

```