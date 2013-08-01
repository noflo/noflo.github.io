---
  title: "Fork"
  library: "noflo-flow"
  layout: "component"

---

```coffeescript
noflo = require "noflo"
_ = require "underscore"
_s = require "underscore.string"
{ CacheStorage } = require "nohoarder"

class Fork extends noflo.Component

  description: _s.clean "Connect some ports to 'OUT', send some IPs to 'IN',
    and send the desired port to 'PORT' to selectively forward to a particular
    port"

  constructor: ->
    @portIndex = null
    @cache = new CacheStorage

    @inPorts =
      in: new noflo.Port
      port: new noflo.Port
    @outPorts =
      out: new noflo.ArrayPort

    @inPorts.port.on "data", (portIndex) =>
      portIndex = parseInt portIndex
      @portIndex = portIndex if _.isNumber(portIndex) and not isNaN(portIndex)

    @inPorts.port.on "disconnect", =>
      @cache.flushCache @outPorts.out, null, @portIndex
      @outPorts.out.disconnect()
      @portIndex = null

    @inPorts.in.on "connect", =>
      @cache.connect()

    @inPorts.in.on "begingroup", (group) =>
      @cache.beginGroup(group)

    @inPorts.in.on "data", (data) =>
      @cache.send(data)

    @inPorts.in.on "endgroup", (group) =>
      @cache.endGroup()

    @inPorts.in.on "disconnect", =>
      @cache.disconnect()

exports.getComponent = -> new Fork

```