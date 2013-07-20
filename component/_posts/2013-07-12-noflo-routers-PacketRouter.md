---
  title: "PacketRouter"
  library: "noflo-routers"
  layout: "component"

---

    noflo = require("noflo")
    
    class PacketRouter extends noflo.Component
    
      description: "Routes IPs based on position in an incoming IP stream"
    
      constructor: ->
        @inPorts =
          in: new noflo.Port
        @outPorts =
          out: new noflo.ArrayPort
          missed: new noflo.Port
    
        @inPorts.in.on "connect", =>
          @count = 0
          @outPortCount = @outPorts.out.sockets.length
    
        @inPorts.in.on "data", (data) =>
          if @count < @outPortCount
            @outPorts.out.send data, @count++
            @outPorts.out.disconnect()
          else if @outPorts.missed.isAttached()
            @outPorts.missed.send data
    
        @inPorts.in.on "disconnect", =>

Send null packets to unmatched ports

          if @count < @outPortCount
            for i in [@count...@outPortCount]
              @outPorts.out.send null, i
              @outPorts.out.disconnect()
    
          @outPorts.missed.disconnect() if @outPorts.missed.isAttached()
    
    exports.getComponent = -> new PacketRouter
    
