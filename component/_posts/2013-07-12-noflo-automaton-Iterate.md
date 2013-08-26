---
  title: "Iterate"
  library: "noflo-automaton"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'

class Iterate extends noflo.Component
  constructor: ->
    @inPorts =
      in: new noflo.ArrayPort 'object'
    @outPorts =
      out: new noflo.Port 'object'
      run: new noflo.Port 'object'

    @inPorts.in.on 'data', (data) =>
```
Increment offset if it exists; otherwise start at 0

```coffeescript
      if data.offset?
        data.offset++
      else
        data.offset = 0

```
Send to OUT if there are still rules left; to RUN otherwise

```coffeescript
      if data.rules[data.offset]?
        @outPorts.out.send data
      else
        data.offset = null
        @outPorts.run.send data

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()
      @outPorts.run.disconnect()

exports.getComponent = -> new Iterate

```