---
  title: "Capture"
  library: "noflo-automaton"
  layout: "component"

---

```coffeescript
_ = require 'underscore'
noflo = require 'noflo'

class Capture extends noflo.Component
  constructor: ->
    @inPorts =
      in: new noflo.Port 'object'
    @outPorts =
      out: new noflo.Port 'object'

    @inPorts.in.on 'data', (context) =>
      { spooky, action } = context

      if action.action is 'capture'
        _action = _.clone action
        _action.path ?= 'screenshot.png'

        spooky.then [_action, ->
          @capture path
        ]

      else if @outPorts.out.isAttached()
        @outPorts.out.send context

    @inPorts.in.on 'disconnect', =>
      if @outPorts.out.isAttached()
        @outPorts.out.disconnect()

exports.getComponent = -> new Capture

```