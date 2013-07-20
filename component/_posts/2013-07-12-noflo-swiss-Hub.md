---
  title: "Hub"
  library: "noflo-swiss"
  layout: "component"

---

    noflo = require("noflo")
    _ = require("underscore")
    
    class Hub extends noflo.Component
    
      description: "Like 'Repeat' but ArrayPort on both ends"
    
      constructor: ->
        @inPorts =
          in: new noflo.ArrayPort
        @outPorts =
          out: new noflo.ArrayPort
    
        @inPorts.in.on "begingroup", (group) =>
          @outPorts.out.beginGroup(group)
    
        @inPorts.in.on "data", (data) =>
          @outPorts.out.send(data)
    
        @inPorts.in.on "endgroup", =>
          @outPorts.out.endGroup()
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
    
    exports.getComponent = -> new Hub
    
