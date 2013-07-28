---
  title: "CopyTree"
  library: "noflo-filesystem"
  layout: "component"

---

```coffeescript
fs = require 'fs.extra'
noflo = require 'noflo'

class CopyTree extends noflo.Component
  constructor: ->
    @from = null
    @to = null

    @inPorts =
      from: new noflo.Port
      to: new noflo.Port
    @outPorts =
      out: new noflo.Port
      error: new noflo.Port

    @inPorts.from.on 'data', (data) =>
      @from = data
      do @copy if @to

    @inPorts.to.on 'data', (data) =>
      @to = data
      do @copy if @from

  copy: ->
    fs.copyRecursive @from, @to, (err) =>
      if err
        @outPorts.error.send err
        @outPorts.error.disconnect()
        return
      @outPorts.out.send @to
      @outPorts.out.disconnect()

exports.getComponent = -> new CopyTree

```