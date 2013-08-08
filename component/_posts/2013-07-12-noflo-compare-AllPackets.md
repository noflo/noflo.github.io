---
  title: "AllPackets"
  library: "noflo-compare"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
_ = require 'underscore'

class AllPackets extends noflo.Component

  description: 'compare two connections and pass to out the connection with the
  most packets winning a comparison, numerically for numbers and
    lexicographically for strings'

  constructor: ->
    @connections = []

    @inPorts =
      in: new noflo.ArrayPort
    @outPorts =
      out: new noflo.Port

    @inPorts.in.on 'connect', =>
      @connection = []

    @inPorts.in.on 'data', (data) =>
      @connection.push data

    @inPorts.in.on 'disconnect', =>
      @connections.push @connection

      if @connections.length is 2
        winningConnection = @compare()
        @outPorts.out.send data for data in winningConnection
        @outPorts.out.disconnect()

        @connections = []

  compare: ->
    counts = _.map @connections, -> 0
    @packets = _.zip.apply _, @connections

    for packets in @packets
      winningItemIndex = packets.indexOf _.max packets
      counts[winningItemIndex]++

    winningSetIndex = counts.indexOf _.max counts
    @connections[winningSetIndex]

exports.getComponent = -> new AllPackets

```