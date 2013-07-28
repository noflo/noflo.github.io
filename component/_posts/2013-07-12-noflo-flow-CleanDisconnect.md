---
  title: "CleanDisconnect"
  library: "noflo-flow"
  layout: "component"

---

```coffeescript
noflo = require "noflo"
_ = require "underscore"
_s = require "underscore.string"
{ CacheStorage } = require "../lib/cache_storage"

class CleanDisconnect extends noflo.Component

  description: _s.clean "when several streams are nested through the array
  in-port (i.e. a connect through one of the ports before there is a
  disconnect), separate the streams into distinct streams with no overlapping"

  constructor: ->
    @cache = new CacheStorage
    @count = 0

    @inPorts =
      in: new noflo.ArrayPort
    @outPorts =
      out: new noflo.ArrayPort

    @inPorts.in.on "connect", (port, index) =>
      @cache.connect index
      @count++

    @inPorts.in.on "begingroup", (group, index) =>
      @cache.beginGroup group, index

    @inPorts.in.on "data", (data, index) =>
      @cache.send data, index

    @inPorts.in.on "endgroup", (group, index) =>
      @cache.endGroup index

    @inPorts.in.on "disconnect", (port, index) =>
      @cache.disconnect index
      @count--
      @flush() if @count is 0

  flush: ->
    for index in [0...@outPorts.out.sockets.length]
      @outPorts.out.connect index
      @cache.flushCache @outPorts.out, index, index
      @outPorts.out.disconnect index
    @cache.reset()

exports.getComponent = -> new CleanDisconnect

```