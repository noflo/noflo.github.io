---
  title: "ParseYaml"
  library: "noflo-yaml"
  layout: "component"

---

    noflo = require 'noflo'
    parser = require 'js-yaml'
    
    class ParseYaml extends noflo.Component
      constructor: ->
        @inPorts =
          in: new noflo.Port()
        @outPorts =
          out: new noflo.Port()
    
        @inPorts.in.on "data", (data) =>
          try
            result = parser.load data
          catch e
            if @outPorts.error.isAttached()
              @outPorts.error.send e
              @outPorts.error.disconnect()
            return
          if result is null
            @outPorts.out.send {}
            return
          @outPorts.out.send result
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
    
    exports.getComponent = -> new ParseYaml
    
