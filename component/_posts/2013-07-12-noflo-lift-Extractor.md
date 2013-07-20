---
  title: "Extractor"
  library: "noflo-lift"
  layout: "component"

---

    noflo = require("noflo")
    _ = require("underscore")
    _s = require("underscore.string")
    
    class Extractor extends noflo.Component
    
      description: _s.clean "given a data structure and a pattern, extract a
      subset from the data structure"
    
      constructor: ->
        @patterns = []
    
        @inPorts =
          in: new noflo.Port
          pattern: new noflo.Port
          reset: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.reset.on "disconnect", =>
          @patterns = []
    
        @inPorts.pattern.on "data", (pattern) =>
          @patterns.push _.map pattern, (p) -> new RegExp(p) if _.isArray(pattern)
    
        @inPorts.in.on "connect", =>
          @groups = []
    
        @inPorts.in.on "begingroup", (group) =>
          @groups.push(group)
          @outPorts.out.beginGroup(group) if @matchPattern()
    
        @inPorts.in.on "data", (data) =>
          @outPorts.out.send(data) if @matchPattern()
    
        @inPorts.in.on "endgroup", (group) =>
          @outPorts.out.endGroup() if @matchPattern()
          @groups.pop()
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
    
      matchPattern: ->

We only need one pattern to match

        _.any _.map @patterns, (pattern) =>

Get all the groups so far

          groups = @groups.slice(0, pattern.length)

Try to match every group in a hierarchy

          matches = _.map pattern, (p, i) =>
            groups[i]?.match(p)?

Invalidate pattern as long as there's a single mismatch

          _.all matches, _.identity
    
    exports.getComponent = -> new Extractor
    
