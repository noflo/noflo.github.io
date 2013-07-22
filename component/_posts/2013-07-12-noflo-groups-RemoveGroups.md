---
  title: "RemoveGroups"
  library: "noflo-groups"
  layout: "component"

---

    noflo = require("noflo")
    
    class Remove extends noflo.Component
    
      description: "Remove a group given a string or a regex string"
    
      constructor: ->
        @regexp = null
    
        @inPorts =
          in: new noflo.Port
          regexp: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.regexp.on "data", (regexp) =>
          @regexp = new RegExp(regexp)
    
        @inPorts.in.on "begingroup", (group) =>
          if @regexp? and not group.match(@regexp)?
            @outPorts.out.beginGroup(group)
    
        @inPorts.in.on "data", (data) =>
          @outPorts.out.send(data)
    
        @inPorts.in.on "endgroup", (group) =>
          if @regexp? and not group.match(@regexp)?
            @outPorts.out.endGroup()
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
    
    exports.getComponent = -> new Remove
    
