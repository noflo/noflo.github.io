---
  title: "RunInterval"
  library: "noflo-core"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'

class RunInterval extends noflo.Component
  description: 'Send a packet at the given interval'
  constructor: ->
    @interval = null
    @inPorts =
      interval: new noflo.Port 'number'
      stop: new noflo.Port 'bang'
    @outPorts =
      out: new noflo.Port 'bang'

    @inPorts.interval.on 'data', (interval) =>
      clearInterval @interval if @interval
      @outPorts.out.connect()
      @interval = setInterval =>
        @outPorts.out.send true
      , interval

    @inPorts.stop.on 'data', =>
      return unless @interval
      clearInterval @interval
      @outPorts.out.disconnect()

exports.getComponent = -> new RunInterval

```