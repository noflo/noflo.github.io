---
  title: "Multiply"
  library: "noflo-math"
  layout: "component"

---

    noflo = require 'noflo'
    
    class Multiply extends noflo.Component
      constructor: ->
        @multiplicand = null
        @multiplier = null
        @inPorts =
          multiplicand: new noflo.Port
          multiplier: new noflo.Port
        @outPorts =
          product: new noflo.Port
    
        @inPorts.multiplicand.on 'data', (data) =>
          @multiplicand = data
          do @add unless @multiplier is null
        @inPorts.multiplier.on 'data', (data) =>
          @multiplier = data
          do @add unless @multiplicand is null
    
      add: ->
        @outPorts.product.send @multiplicand * @multiplier
        @outPorts.product.disconnect()
    
    exports.getComponent = -> new Multiply
    
