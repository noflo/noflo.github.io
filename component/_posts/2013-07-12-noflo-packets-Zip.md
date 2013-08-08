---
  title: "Zip"
  library: "noflo-packets"
  layout: "component"

---

```coffeescript
noflo = require("noflo")
_ = require("underscore")

class Zip extends noflo.Component

  description: "zip through multiple IPs and output a series of zipped
  IPs just like how _.zip() works in Underscore.js"

  constructor: ->
    @inPorts =
      in: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.in.on "connect", (group) =>
      @packets = []

    @inPorts.in.on "data", (data) =>
      @packets.push(data) if _.isArray(data)

    @inPorts.in.on "disconnect", =>
      if _.isEmpty(@packets)
        @outPorts.out.send []
      else
        @outPorts.out.send _.zip.apply _, @packets

      @outPorts.out.disconnect()

exports.getComponent = -> new Zip

```