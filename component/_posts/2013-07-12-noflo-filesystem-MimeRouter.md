---
  title: "MimeRouter"
  library: "noflo-filesystem"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
mimetype = require 'mimetype'

```
Extra MIME types config

```coffeescript
mimetype.set '.markdown', 'text/x-markdown'
mimetype.set '.md', 'text/x-markdown'
mimetype.set '.xml', 'text/xml'

class MimeRouter extends noflo.Component
  constructor: ->
    @routes = []

    @inPorts =
      types: new noflo.Port 'all'
      routes: new noflo.Port 'all'
      in: new noflo.ArrayPort 'string'
    @outPorts =
      out: new noflo.ArrayPort 'string'
      missed: new noflo.Port 'string'

    @inPorts.routes.on 'data', (data) =>
      if typeof data is 'string'
        data = data.split ','
      @routes = data

    @inPorts.in.on 'data', (data) =>
      mime = mimetype.lookup data
      return @missed data unless mime

      selected = null
      for matcher, id in @routes
        selected = id unless mime.indexOf(matcher) is -1
      return @missed data if selected is null

      @outPorts.out.send data, selected

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()
      @outPorts.missed.disconnect() if @outPorts.missed.isAttached()

  missed: (data) ->
    return unless @outPorts.missed.isAttached()
    @outPorts.missed.send data

exports.getComponent = -> new MimeRouter

```