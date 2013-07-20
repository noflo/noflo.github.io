---
  title: "Print"
  library: "noflo-handyman"
  layout: "component"

---

    noflo = require "noflo"
    _ = require "underscore"
    _s = require "underscore.string"
    
    class Print extends noflo.Component
    
      description: "Print data packets as well as groups"
    
      constructor: ->
        @inPorts =
          in: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.in.on "connect", =>
          console.log "CONNECT"
    
        @inPorts.in.on "begingroup", (group) =>
          console.log "BEGINGROUP: #{group}"
          @outPorts.out.beginGroup group
    
        @inPorts.in.on "data", (data) =>
          console.log "DATA: #{data}"
          @outPorts.out.send data
    
        @inPorts.in.on "endgroup", (group) =>
          console.log "ENDGROUP: #{group}"
          @outPorts.out.endGroup()
    
        @inPorts.in.on "disconnect", =>
          console.log "DISCONNECT"
          @outPorts.out.disconnect()
    
    exports.getComponent = -> new Print
    
