---
  title: "CountedMerge"
  library: "noflo-flow"
  layout: "component"

---

```coffeescript
noflo = require "noflo"
_s = require "underscore.string"
{ CacheStorage } = require "../lib/cache_storage"

class CountedMerge extends noflo.Component

  description: _s.clean "Like the normal 'Merge', but merge up to a specified
  number of connections."

  constructor: ->
    @count = 0
    @threshold = 1
    @cache = new CacheStorage

    @inPorts =
      in: new noflo.ArrayPort
      threshold: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.threshold.on "data", (@threshold) =>

    @inPorts.in.on "connect", =>
      @count++
      @cache.connect @count

    @inPorts.in.on "begingroup", (group) =>
      @cache.beginGroup group, @count

    @inPorts.in.on "data", (data) =>
      @cache.send data, @count

    @inPorts.in.on "endgroup", (group) =>
      @cache.endGroup @count

    @inPorts.in.on "disconnect", =>
      @cache.disconnect @count if @count > 0

      if @count >= @threshold
        @cache.flushCache @outPorts.out, key for key in [1..@count]
        @outPorts.out.disconnect()
        @count = 0

exports.getComponent = -> new CountedMerge

```