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
          in: new noflo.Port 'string'
          pattern: new noflo.Port 'string'
        @outPorts =
          out: new noflo.Port 'string'
          missed: new noflo.Port 'string'
    
        @inPorts.pattern.on "data", (data) =>
          @regex = new RegExp(data)
    
        @inPorts.in.on "begingroup", (group) =>
          @outPorts.out.beginGroup(group)
    
        @inPorts.in.on "data", (data) =>
          unless typeof data is 'string'
            data = (data).toString()
          if @regex? and data?.match?(@regex)?
            @outPorts.out.send data
            return
          @outPorts.missed.send data if @outPorts.missed.isAttached()
    
        @inPorts.in.on "endgroup", (group) =>
          @outPorts.out.endGroup()
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
          @outPorts.missed.disconnect() if @outPorts.missed.isAttached()
    
    exports.getComponent = -> new Filter
    
