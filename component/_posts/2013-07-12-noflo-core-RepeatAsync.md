---
  title: "RepeatAsync"
  library: "noflo-core"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'

if typeof process is 'object' and process.title is 'node'
  util = require 'util'
else
  util =
    inspect: (data) -> data

class RepeatAsync extends noflo.Component

  description: "Like 'Repeat', except repeat on next tick"

  constructor: ->
    @groups = []

```
Ports

```coffeescript
    @inPorts =
      in: new noflo.Port()
    @outPorts =
      out: new noflo.Port()

```
Forward on next tick

```coffeescript
    @inPorts.in.on 'begingroup', (group) =>
      @groups.push(group)

    @inPorts.in.on 'data', (data) =>
      groups = @groups

      later = () =>
        for group in groups
          @outPorts.out.beginGroup(group)

        @outPorts.out.send(data)

        for group in groups
          @outPorts.out.endGroup()

        @outPorts.out.disconnect()

      setTimeout(later, 0)

    @inPorts.in.on 'disconnect', () =>
      @groups = []

exports.getComponent = () -> new RepeatAsync

```