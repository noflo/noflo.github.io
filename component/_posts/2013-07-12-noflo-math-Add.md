---
  title: "Add"
  library: "noflo-math"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'

class Add extends noflo.Component
  constructor: ->
    @augend = null
    @addend = null
    @inPorts =
      augend: new noflo.Port
      addend: new noflo.Port
    @outPorts =
      sum: new noflo.Port

    @inPorts.augend.on 'data', (data) =>
      @augend = data
      do @add unless @addend is null
    @inPorts.addend.on 'data', (data) =>
      @addend = data
      do @add unless @augend is null

  add: ->
    @outPorts.sum.send @augend + @addend
    @outPorts.sum.disconnect()

exports.getComponent = -> new Add

```