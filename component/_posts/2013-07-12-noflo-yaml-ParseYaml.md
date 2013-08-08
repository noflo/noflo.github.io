---
  title: "ParseYaml"
  library: "noflo-yaml"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
parser = require 'js-yaml'

class ParseYaml extends noflo.Component
  constructor: ->
    @inPorts =
      in: new noflo.Port 'string'
    @outPorts =
      out: new noflo.Port 'object'
      error: new noflo.Port 'object'

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

```