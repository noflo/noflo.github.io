---
  title: "Gate"
  library: "noflo-flow"
  layout: "component"

---

    noflo = require 'noflo'
    
    class Gate extends noflo.Component
      description: 'This component forwards received packets when the gate is open'
    
      constructor: ->
        @open = false
    
        @inPorts =
          in: new noflo.Port 'all'
          open: new noflo.Port 'bang'
          close: new noflo.Port 'bang'
        @outPorts =
          out: new noflo.Port 'all'
    
        @inPorts.in.on 'connect', =>
          return unless @open
          @outPorts.out.connect()
        @inPorts.in.on 'begingroup', (group) =>
          return unless @open
          @outPorts.out.beginGroup group
        @inPorts.in.on 'data', (data) =>
          return unless @open
          @outPorts.out.send data
        @inPorts.in.on 'endgroup', =>
          return unless @open
          @outPorts.out.endGroup()
        @inPorts.in.on 'disconnect', =>
          return unless @open
          @outPorts.out.disconnect()
    
        @inPorts.open.on 'data', =>
          @open = true
        @inPorts.close.on 'data', =>
          @open = false
    
    exports.getComponent = -> new Gate
    
