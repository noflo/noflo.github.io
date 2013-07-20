---
  title: "ParseMarkdown"
  library: "noflo-markdown"
  layout: "component"

---

    noflo = require 'noflo'
    marked = require 'marked'
    
    class ParseMarkdown extends noflo.Component
      constructor: ->
        @inPorts =
          in: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.in.on 'data', (data) =>
          @outPorts.out.send marked data
    
        @inPorts.in.on 'disconnect', =>
          @outPorts.out.disconnect()
    
    exports.getComponent = -> new ParseMarkdown
    
