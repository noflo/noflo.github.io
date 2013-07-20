---
  title: "Values"
  library: "noflo-objects"
  layout: "component"

---

    noflo = require("noflo")
    _ = require("underscore")
    
    class Values extends noflo.Component
    
      description: "gets only the values of an object and forward them as an array"
    
      constructor: ->
        @inPorts =
          in: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.in.on "begingroup", (group) =>
          @outPorts.out.beginGroup(group)
    
        @inPorts.in.on "data", (data) =>
          @outPorts.out.send value for value in _.values data
    
        @inPorts.in.on "endgroup", (group) =>
          @outPorts.out.endGroup()
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
    
    exports.getComponent = -> new Values
    
