---
  title: "FilterPackets"
  library: "noflo-packets"
  layout: "component"

---

    noflo = require("noflo")
    _ = require("underscore")
    
    class FilterPackets extends noflo.Component
    
      description: "Filter packets matching some RegExp strings"
    
      constructor: ->
        @regexps = []
    
        @inPorts =
          in: new noflo.Port
          regexp: new noflo.Port
        @outPorts =
          out: new noflo.Port
          missed: new noflo.Port
          passthru: new noflo.Port
    
        @inPorts.regexp.on "connect", =>
          @regexps = []
        @inPorts.regexp.on "data", (regexp) =>
          @regexps.push new RegExp regexp
    
        @inPorts.in.on "data", (data) =>
          if _.any @regexps, ((regexp) -> data.match regexp)
            @outPorts.out.send data
          else
            @outPorts.missed.send data
    
          @outPorts.passthru.send data if @outPorts.passthru.isAttached()
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
          @outPorts.missed.disconnect()
          @outPorts.passthru.disconnect() if @outPorts.passthru.isAttached()
    
    exports.getComponent = -> new FilterPackets
    
