---
  title: "Client"
  library: "noflo-semanticsthree"
  layout: "component"

---

    noflo = require "noflo"
    semantics3 = require "semantics3-node"
    
    class Client extends noflo.Component
      constructor: ->
        @inPorts =
          key: new noflo.Port
          secret: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.key.on "data", (@key) =>
          @createClient()
        @inPorts.secret.on "data", (@secret) =>
          @createClient()
    
      createClient: ->
        return unless @key? and @secret?
    
        client = semantics3 @key, @secret
        @outPorts.out.send client
        @outPorts.out.disconnect()
    
        delete @key
        delete @secret
    
    exports.getComponent = -> new Client
    
