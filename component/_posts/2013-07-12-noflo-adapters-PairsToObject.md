---
  title: "PairsToObject"
  library: "noflo-adapters"
  layout: "component"

---

    _ = require "underscore"
    _s = require "underscore.string"
    noflo = require "noflo"
    
    class PairsToObject extends noflo.Component
    
      description: _s.clean "Assume packets at odd numbers to be keys and those at
      even numbers to be values"
    
      constructor: ->
        @inPorts =
          in: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.in.on "connect", =>
          @count = 0
          @object = {}
          @key = null
    
        @inPorts.in.on "data", (data) =>
          @count++
    

Even numbers

          if @count % 2 is 0

There's a key that is a string

            if @key?
              @object[@key] = data
              @key = null
    

Odd numbers and a string

          else if _.isString data
            @key = data
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.send @object
          @outPorts.out.disconnect()
    
    exports.getComponent = -> new PairsToObject
    
