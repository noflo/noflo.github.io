---
  title: "CountPackets"
  library: "noflo-packets"
  layout: "component"

---

    noflo = require("noflo")
    _ = require("underscore")
    
    class Counter extends noflo.Component
    
      description: "count number of data IPs"
    
      constructor: ->
        @inPorts =
          in: new noflo.Port
        @outPorts =
          out: new noflo.Port
          count: new noflo.Port
    
        @inPorts.in.on "connect", =>
          @counts = [0]
          count = _.last(@counts)
    
        @inPorts.in.on "begingroup", (group) =>
          @counts.push(0)
          @outPorts.out.beginGroup(group)
    
        @inPorts.in.on "data", (data) =>
          @counts[@counts.length - 1]++
          count = _.last(@counts)
          @outPorts.out.send(data)
    
        @inPorts.in.on "endgroup", (group) =>
          count = _.last(@counts)
          @outPorts.count.send(count)
          @counts.pop()
          @outPorts.out.endGroup(group)
    
        @inPorts.in.on "disconnect", =>
          count = _.last(@counts)
          @outPorts.count.send(count)
          @outPorts.count.disconnect()
          @outPorts.out.disconnect()
    
    exports.getComponent = -> new Counter
    
