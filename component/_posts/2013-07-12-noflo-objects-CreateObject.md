---
  title: "CreateObject"
  library: "noflo-objects"
  layout: "component"

---

    noflo = require 'noflo'
    
    class CreateObject extends noflo.Component
      constructor: ->
        @inPorts =
          start: new noflo.Port()
        @outPorts =
          out: new noflo.Port()
    
        @inPorts.start.on 'begingroup', (group) =>
          @outPorts.out.beginGroup group
        @inPorts.start.on "data", =>
          @outPorts.out.send {}
          @outPorts.out.disconnect()
        @inPorts.start.on 'endgroup', =>
          @outPorts.out.endGroup()
    
    exports.getComponent = -> new CreateObject
    
