---
  title: "Filter"
  library: "noflo-strings"
  layout: "component"

---

    noflo = require("noflo")
    
    class Filter extends noflo.Component
    
      description: "filters an IP which is a string using a regex"
    
      constructor: ->
        @regex = null
    
        @inPorts =
          in: new noflo.Port
          pattern: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.pattern.on "data", (data) =>
          @regex = new RegExp(data)
    
        @inPorts.in.on "begingroup", (group) =>
          @outPorts.out.beginGroup(group)
    
        @inPorts.in.on "data", (data) =>
          if @regex? and data?.match?(@regex)?
            @outPorts.out.send(data)
    
        @inPorts.in.on "endgroup", (group) =>
          @outPorts.out.endGroup()
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
    
    exports.getComponent = -> new Filter
    
