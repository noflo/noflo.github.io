---
  title: "Subtract"
  library: "noflo-math"
  layout: "component"

---

    noflo = require 'noflo'
    
    class Subtract extends noflo.Component
      constructor: ->
        @minuend = null
        @subtrahend = null
        @inPorts =
          minuend: new noflo.Port
          subtrahend: new noflo.Port
        @outPorts =
          difference: new noflo.Port
    
        @inPorts.minuend.on 'data', (data) =>
          @minuend = data
          do @add unless @subtrahend is null
        @inPorts.subtrahend.on 'data', (data) =>
          @subtrahend = data
          do @add unless @minuend is null
    
      add: ->
        @outPorts.difference.send @minuend - @subtrahend
        @outPorts.difference.disconnect()
    
    exports.getComponent = -> new Subtract
    
