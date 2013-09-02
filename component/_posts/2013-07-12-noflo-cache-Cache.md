---
  title: "Cache"
  library: "noflo-cache"
  layout: "component"

---

```coffeescript
noflo = require "noflo"
{ CacheStorage } = require "nohoarder"

class Cache extends noflo.Component

  description: "save incoming IPs and send the saved IPs to port 'out'
  upon any data IP from 'ready'"

  constructor: ->
    @keep = false
    @key = null
    @cache = new CacheStorage

    @inPorts =
      in: new noflo.ArrayPort
      ready: new noflo.Port
      flush: new noflo.Port
      key: new noflo.ArrayPort
      size: new noflo.Port
      keep: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.key.on "data", (@key) =>

    @inPorts.keep.on "data", (keep) =>
      @keep = keep is "true"

    @inPorts.size.on "data", (size) =>
      @cache.size = size

    @inPorts.flush.on "disconnect", =>
      @cache.flushAll @outPorts.out
      @outPorts.out.disconnect()
      @cache.reset() unless @keep
      @key = null

    @inPorts.ready.on "disconnect", =>
      @cache.flushCache @outPorts.out, @key
      @outPorts.out.disconnect()
      @cache.reset @key unless @keep
      @key = null

    @inPorts.in.on "connect", =>
      @cache.connect(@key)

    @inPorts.in.on "begingroup", (group) =>
      @cache.beginGroup(group, @key)

    @inPorts.in.on "data", (data) =>
      @cache.send(data, @key)

    @inPorts.in.on "endgroup", (group) =>
      @cache.endGroup(@key)

    @inPorts.in.on "disconnect", =>
      @cache.disconnect(@key)
      @key = null

exports.getComponent = -> new Cache

```