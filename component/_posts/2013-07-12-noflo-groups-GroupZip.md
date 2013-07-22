---
  title: "GroupZip"
  library: "noflo-groups"
  layout: "component"

---

    noflo = require "noflo"
    
    class GroupZip extends noflo.Component
      constructor: ->
        @newGroups = []
    
        @inPorts =
          in: new noflo.Port
          group: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.in.on "connect", () =>
          @count = 0
    
        @inPorts.in.on "data", (data) =>
          @outPorts.out.beginGroup @newGroups[@count++]
          @outPorts.out.send data
          @outPorts.out.endGroup()
    
        @inPorts.in.on "disconnect", () =>
          @outPorts.out.disconnect()
    
        @inPorts.group.on "connect", =>
          @newGroups = []
    
        @inPorts.group.on "data", (group) =>
          @newGroups.push group
    
    exports.getComponent = -> new GroupZip
    
