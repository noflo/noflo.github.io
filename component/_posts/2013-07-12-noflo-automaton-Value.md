---
  title: "Value"
  library: "noflo-automaton"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'

class Value extends noflo.Component
  constructor: ->
    @inPorts =
      in: new noflo.Port 'object'
    @outPorts =
      out: new noflo.Port 'object'

    @inPorts.in.on 'data', (context) =>
      { spooky, action } = context
```
Default values

```coffeescript
      action.value ?= ''

      if action.action is 'value'
        spooky.then [action, ->
          @sendKeys selector, value
        ]

      else if @outPorts.out.isAttached()
        @outPorts.out.send context

    @inPorts.in.on 'disconnect', =>
      if @outPorts.out.isAttached()
        @outPorts.out.disconnect()

exports.getComponent = -> new Value

```