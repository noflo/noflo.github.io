---
  title: "MatchReplace"
  library: "noflo-strings"
  layout: "component"

---

    noflo = require "noflo"
    _ = require "underscore"
    
    class MatchReplace extends noflo.Component
      constructor: ->
        @matches = {}
        @matchKeys = []
    
        @inPorts =
          in: new noflo.Port()
          match: new noflo.Port()
        @outPorts =
          out: new noflo.Port()
    
        @inPorts.match.on "connect", =>
          @matches = {}
          @matchKeys = []
    
        @inPorts.match.on "data", (match) =>
          return unless _.isObject match
          for from, to of match
            @matches[from.toString()] = to.toString()
          @matchKeys = _.keys @matches
    
        @inPorts.in.on "begingroup", (group) =>
          @outPorts.out.beginGroup group
    
        @inPorts.in.on "data", (string) =>
          matchKeyIndex = @matchKeys.indexOf string.toString()
    
          if matchKeyIndex > -1
            string = @matches[@matchKeys[matchKeyIndex]]
    
          @outPorts.out.send string
    
        @inPorts.in.on "endgroup", =>
          @outPorts.out.endGroup()
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
    
    exports.getComponent = -> new MatchReplace
    
