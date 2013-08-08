---
  title: "ToYaml"
  library: "noflo-yaml"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
parser = require 'json2yaml'

class ToYaml extends noflo.Component
  constructor: ->
    @inPorts =
      in: new noflo.Port 'object'
    @outPorts =
      out: new noflo.Port 'string'

    @inPorts.in.on "data", (data) =>
      @outPorts.out.send parser.stringify data
    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()

exports.getComponent = -> new ToYaml

```