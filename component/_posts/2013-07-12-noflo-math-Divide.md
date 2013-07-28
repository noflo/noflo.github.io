---
  title: "Divide"
  library: "noflo-math"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'

class Divide extends noflo.Component
  constructor: ->
    @dividend = null
    @divisor = null
    @inPorts =
      dividend: new noflo.Port
      divisor: new noflo.Port
    @outPorts =
      quotient: new noflo.Port

    @inPorts.dividend.on 'data', (data) =>
      @dividend = data
      do @add unless @divisor is null
    @inPorts.divisor.on 'data', (data) =>
      @divisor = data
      do @add unless @dividend is null

  add: ->
    @outPorts.quotient.send @dividend / @divisor
    @outPorts.quotient.disconnect()

exports.getComponent = -> new Divide

```