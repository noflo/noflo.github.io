---
  title: "Wait"
  library: "noflo-automaton"
  layout: "component"

---

```coffeescript
_ = require 'underscore'
noflo = require 'noflo'

class Wait extends noflo.Component
  constructor: ->
    @inPorts =
      in: new noflo.Port 'object'
    @outPorts =
      out: new noflo.Port 'object'

    @inPorts.in.on 'data', (context) =>
      { spooky, action } = context

      if action.action is 'wait'
        _action = _.clone action
        _action.timeout ?= 3000

        spooky.then [_action, ->
          @wait timeout
        ]

      else if @outPorts.out.isAttached()
        @outPorts.out.send context

    @inPorts.in.on 'disconnect', =>
      if @outPorts.out.isAttached()
        @outPorts.out.disconnect()

exports.getComponent = -> new Wait

```