---
  title: "ResolvePath"
  library: "noflo-woute"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
path = require 'path'

class ResolvePath extends noflo.Component

  description: 'Resolve a path relative to this file'

  constructor: ->
    @inPorts =
      in: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.in.on 'begingroup', (group) =>
      @outPorts.out.beginGroup group

    @inPorts.in.on 'data', (data) =>
      @outPorts.out.send path.resolve __dirname, data

    @inPorts.in.on 'endgroup', (group) =>
      @outPorts.out.endGroup()

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()

exports.getComponent = -> new ResolvePath

```