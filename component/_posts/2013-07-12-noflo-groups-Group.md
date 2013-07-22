---
  title: "Group"
  library: "noflo-groups"
  layout: "component"

---

    noflo = require "noflo"
    
    class Group extends noflo.Component
      constructor: ->
        @newGroups = []
    
        @inPorts =
          in: new noflo.Port
          group: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.in.on "connect", () =>
          @outPorts.out.beginGroup group for group in @newGroups
    
        @inPorts.in.on "begingroup", (group) =>
          @outPorts.out.beginGroup group
    
        @inPorts.in.on "data", (data) =>
          @outPorts.out.send data
    
        @inPorts.in.on "endgroup", (group) =>
          @outPorts.out.endGroup()
    
        @inPorts.in.on "disconnect", () =>
          @outPorts.out.endGroup() for group in @newGroups
          @outPorts.out.disconnect()
    
        @inPorts.group.on "connect", =>
          @newGroups = []
    
        @inPorts.group.on "data", (group) =>
          @newGroups.push(group)
    
    exports.getComponent = -> new Group
    
