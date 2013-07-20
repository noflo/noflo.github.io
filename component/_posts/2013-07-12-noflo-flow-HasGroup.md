---
  title: "HasGroup"
  library: "noflo-flow"
  layout: "component"

---

    noflo = require("noflo")
    
    class HasGroup extends noflo.Component
    
      description: "send connection to 'yes' if its top-level group is one
      of the provided groups, otherwise 'no'"
    
      constructor: ->
        @matchGroups = []
        @regexps = []
    
        @inPorts =
          in: new noflo.Port
          regexp: new noflo.ArrayPort
          group: new noflo.ArrayPort
          reset: new noflo.ArrayPort
        @outPorts =
          yes: new noflo.Port
          no: new noflo.Port
    
        @inPorts.group.on "data", (data) =>
          @matchGroups.push(data)
    
        @inPorts.regexp.on "data", (data) =>
          @regexps.push(new RegExp(data))
    
        @inPorts.reset.on "data", (data) =>
          @groups = []
          @regexps = []
    
        @inPorts.in.on "connect", =>
          @port = null
    
        @inPorts.in.on "begingroup", (group) =>
          @match(group) unless @port?
          @port?.beginGroup(group)
    
        @inPorts.in.on "data", (data) =>
          @port?.send(data)
    
        @inPorts.in.on "endgroup", (group) =>
          @port?.endGroup(group)
    
        @inPorts.in.on "disconnect", =>
          @port?.disconnect()
    
      match: (group) ->

Full matches

        for matchGroup in @matchGroups
          if matchGroup is group
            return @port = @outPorts.yes
    

RegExp matches

        for regexp in @regexps
          if group.match(regexp)?
            return @port = @outPorts.yes
    

Otherwise, fail

        @port = @outPorts.no
    
    exports.getComponent = -> new HasGroup
    
