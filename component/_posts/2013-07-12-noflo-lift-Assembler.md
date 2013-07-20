---
  title: "Assembler"
  library: "noflo-lift"
  layout: "component"

---

    noflo = require("noflo")
    _ = require("underscore")
    _s = require("underscore.string")
    { CacheStorage } = require("noflo-flow")
    
    class Assembler extends noflo.Component
    
      description: _s.clean "given a data structure, a pattern, and a
      sub-structure, replace a subset of the data structure as specified by
      the pattern with the sub-structure"
    
      constructor: ->
        @cache = new CacheStorage
        @patterns = []
    
        @inPorts =
          in: new noflo.Port
          pattern: new noflo.Port
          replacement: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.pattern.on "connect", =>
          @patterns = []
    
        @inPorts.pattern.on "data", (pattern) =>
          @patterns.push new RegExp pattern
    
        @inPorts.replacement.on "connect", =>
          @cache.connect()
    
        @inPorts.replacement.on "begingroup", (group) =>
          @cache.beginGroup(group)
    
        @inPorts.replacement.on "data", (data) =>
          @cache.send(data)
    
        @inPorts.replacement.on "endgroup", (group) =>
          @cache.endGroup(group)
    
        @inPorts.replacement.on "disconnect", =>
          @cache.disconnect()
    
        @inPorts.in.on "connect", =>

Whether the group pattern has matched before, regardless whether
it's matching now or not

          @hasMatched = false
          @groups = []
    
        @inPorts.in.on "begingroup", (group) =>
          @outPorts.out.beginGroup(group) unless @matchPattern()
    
          @groups.push(group)
    
          if @matchPattern() and not @hasMatched
            @hasMatched = true
            @cache.flushCache(@outPorts.out)
            @cache.reset()
    
        @inPorts.in.on "data", (data) =>
          @outPorts.out.send(data) unless @matchPattern()
    
        @inPorts.in.on "endgroup", (group) =>
          @groups.pop()
    
          @outPorts.out.endGroup() unless @matchPattern()
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
    
      matchPattern: ->
        groups = @groups.slice(0, @patterns.length)
    
        for p, i in @patterns
          return false unless groups[i]?.match(p)?
    
        return true
    
    exports.getComponent = -> new Assembler
    
