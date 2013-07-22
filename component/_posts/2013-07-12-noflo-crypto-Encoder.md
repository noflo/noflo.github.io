---
  title: "Encoder"
  library: "noflo-crypto"
  layout: "component"

---

    noflo = require "noflo"
    crypto = require "crypto-js"
    
    class Encoder extends noflo.Component
      constructor: ->
        @inPorts =
          in: new noflo.Port

Either 'parse' or 'stringify'

          command: new noflo.Port

'Hex', 'Latin1', or 'Utf8'

          encoding: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.encoding.on "data", (@encoding) =>
        @inPorts.command.on "data", (@command) =>
    
        @inPorts.in.on "begingroup", (group) =>
          @outPorts.out.beginGroup group
        @inPorts.in.on "endgroup", =>
          @outPorts.out.endGroup()
    
        @inPorts.in.on "data", (data) =>
          @outPorts.out.send crypto.enc[@encoding][@command] data
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
    
    exports.getComponent = -> new Encoder
    
