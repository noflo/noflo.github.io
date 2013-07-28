---
  title: "Query"
  library: "noflo-webserver"
  layout: "component"

---

```coffeescript
noflo = require "noflo"
connect = require "connect"

class Query extends noflo.Component

  description: "This applies connect.query middleware"

  constructor: ->
    @inPorts =
      in: new noflo.Port()
    @outPorts =
      out: new noflo.Port()

    @inPorts.in.on "data", (request) =>
      @request = request

    @inPorts.in.on "disconnect", =>
      { req, res } = @request

      connect.query() req, res, (e) =>
        throw e if e?
        @outPorts.out.send @request
        @outPorts.out.disconnect()
        @request = null

exports.getComponent = -> new Query

```