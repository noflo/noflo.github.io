---
  title: "Underscore"
  library: "noflo-swiss"
  layout: "component"

---

```coffeescript
noflo = require("noflo")
_ = require("underscore")
_s = require("underscore.string")

class Underscore extends noflo.Component

  description: _s.clean "Invoke an Underscore.js function by providing the
  function name"

  constructor: ->
    @stream = true

    @inPorts =
      in: new noflo.Port
      stream: new noflo.Port
      name: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.stream.on "data", (stream) =>
      @stream = stream is "true"

    @inPorts.name.on "data", (@name) =>

    @inPorts.in.on "connect", =>
      @packets = []

    @inPorts.in.on "data", (data) =>
      if @stream
        if @name?
          @outPorts.out.send _[@name] data
        else
          @outPorts.out.send data
      else
        @packets.push(data)

    @inPorts.in.on "disconnect", =>
      unless @stream
        @outPorts.out.send _[@name].apply _, @packets

      @outPorts.out.disconnect()

exports.getComponent = -> new Underscore

```