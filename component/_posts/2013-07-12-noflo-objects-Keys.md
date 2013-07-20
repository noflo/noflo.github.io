---
  title: "Keys"
  library: "noflo-objects"
  layout: "component"

---

    noflo = require("noflo")
    _ = require("underscore")
    
    class Keys extends noflo.Component
    
      description: "gets only the keys of an object and forward them as an array"
    
      constructor: ->
        @inPorts =
          in: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.in.on "begingroup", (group) =>
          @outPorts.out.beginGroup(group)
    
        @inPorts.in.on "data", (data) =>
          @outPorts.out.send key for key in _.keys data
    
        @inPorts.in.on "endgroup", (group) =>
          @outPorts.out.endGroup()
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
    
    exports.getComponent = -> new Keys
    
