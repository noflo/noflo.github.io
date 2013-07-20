---
  title: "SplitPacket"
  library: "noflo-packets"
  layout: "component"

---

    noflo = require("noflo")
    _ = require("underscore")
    
    class SplitPacket extends noflo.Component
    
      description: "splits each incoming packet into its own connection"
    
      constructor: ->
        @inPorts =
          in: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.in.on "connect", =>
          @groups = []
    
        @inPorts.in.on "begingroup", (group) =>
          @groups.push(group)
    
        @inPorts.in.on "data", (data) =>
          @outPorts.out.connect()
          @outPorts.out.beginGroup(group) for group in @groups
          @outPorts.out.send(data)
          @outPorts.out.endGroup() for group in @groups
          @outPorts.out.disconnect()
    
        @inPorts.in.on "endgroup", (group) =>
          @groups.pop()
    
    exports.getComponent = -> new SplitPacket
    
