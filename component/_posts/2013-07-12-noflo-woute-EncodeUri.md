---
  title: "EncodeUri"
  library: "noflo-woute"
  layout: "component"

---

    noflo = require("noflo")
    
    class EncodeUri extends noflo.Component
    
      description: "Run each data packet through `encodeURIComponent`"
    
      constructor: ->
        @inPorts =
          in: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.in.on "begingroup", (group) =>
          @outPorts.out.beginGroup group
    
        @inPorts.in.on "data", (data) =>
          @outPorts.out.send encodeURIComponent data
    
        @inPorts.in.on "endgroup", (group) =>
          @outPorts.out.endGroup()
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
    
    exports.getComponent = -> new EncodeUri
    
