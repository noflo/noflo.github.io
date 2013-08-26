---
  title: "Click"
  library: "noflo-automaton"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'

class Click extends noflo.Component
  constructor: ->
    @inPorts =
      in: new noflo.Port 'object'
    @outPorts =
      out: new noflo.Port 'object'

    @inPorts.in.on 'data', (context) =>
      { spooky, action } = context

      if action.action is 'click'
        spooky.thenClick action.selector
      else if @outPorts.out.isAttached()
        @outPorts.out.send context

    @inPorts.in.on 'disconnect', =>
      if @outPorts.out.isAttached()
        @outPorts.out.disconnect()

exports.getComponent = -> new Click

```