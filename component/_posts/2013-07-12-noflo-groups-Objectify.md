---
  title: "Objectify"
  library: "noflo-groups"
  layout: "component"

---

    noflo = require("noflo")
    _ = require("underscore")
    _s = require("underscore.string")
    
    class Objectify extends noflo.Component
    
      description: _s.clean "specify a regexp string, use the first match as
      the key of an object containing the data"
    
      constructor: ->
        @regexp = null
        @match = null
    
        @inPorts =
          in: new noflo.Port
          regexp: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.regexp.on "data", (regexp) =>
          @regexp = new RegExp(regexp)
    
        @inPorts.in.on "begingroup", (group) =>
          if @regexp? and group.match(@regexp)?
            @match = _.first group.match @regexp
    
          @outPorts.out.beginGroup(group)
    
        @inPorts.in.on "data", (data) =>

If there is a match, make an object out of it

          if @match?
            d = data
            data = {}
            data[@match] = d
    
          @outPorts.out.send(data)
    
        @inPorts.in.on "endgroup", (group) =>
          @outPorts.out.endGroup()
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
    
    exports.getComponent = -> new Objectify
    
