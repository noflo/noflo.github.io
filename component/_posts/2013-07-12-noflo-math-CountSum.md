---
  title: "CountSum"
  library: "noflo-math"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'

class CountSum extends noflo.Component
  constructor: ->
    @portCounts = {}

    @inPorts =
      in: new noflo.ArrayPort 'number'
    @outPorts =
      out: new noflo.ArrayPort 'number'

    @inPorts.in.on 'data', (data, portId) =>
      @count portId, data

    @inPorts.in.on 'disconnect', (socket, portId) =>
```
@portCounts[portId] = null

```coffeescript
      for socket in @inPorts.in.sockets
        return if socket.isConnected()
      @outPorts.out.disconnect()

  count: (port, data) ->
    sum = 0
    @portCounts[port] = data

    for socket, id in @inPorts.in.sockets
      if typeof @portCounts[id] is 'undefined'
```
Never connected

```coffeescript
        @portCounts[id] = 0

      sum += @portCounts[id]

    @outPorts.out.send sum

exports.getComponent = -> new CountSum

```