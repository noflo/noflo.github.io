---
  title: "Stop"
  library: "noflo-flow"
  layout: "component"

---

    noflo = require "noflo"
    _s = require "underscore.string"
    { CacheStorage } = require "../lib/cache_storage"
    
    class Stop extends noflo.Component
    
      description: _s.clean "Stop everything that's received and send out
      once we're told that we're ready to send."
    
      constructor: ->
        @count = 0
        @cache = new CacheStorage
    
        @inPorts =
          in: new noflo.ArrayPort
          ready: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.ready.on "disconnect", =>
          @cache.flushCache @outPorts.out, key for key in [0...@count]
          @outPorts.out.disconnect()
          @count = 0
    
        @inPorts.in.on "connect", =>
          @cache.connect @count
    
        @inPorts.in.on "begingroup", (group) =>
          @cache.beginGroup group, @count
    
        @inPorts.in.on "data", (data) =>
          @cache.send data, @count
    
        @inPorts.in.on "endgroup", (group) =>
          @cache.endGroup @count
    
        @inPorts.in.on "disconnect", =>
          @cache.disconnect @count
          @count++
    
    exports.getComponent = -> new Stop
    
